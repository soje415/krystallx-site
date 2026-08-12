/**
 * OPSEC gate. Runs on every generated post BEFORE a human sees it.
 *
 * Three verdicts:
 *   KILL   — discard silently. Never escalated to a human, because the whole
 *            point is that these must not reach a publish queue at all.
 *   REVIEW — cannot auto-publish; forced to human approval regardless of tier.
 *   PASS   — eligible for its declared tier.
 *
 * This is deliberately dumb pattern matching, not an LLM judging its own
 * output. A model asked to check its own work shares the blind spot that
 * produced the mistake.
 */

/** Upstream data sources and internal codenames — see the de-branding rule. */
const BANNED_NAMES = [
  'sentinel-1', 'sentinel-2', 'sentinel-5p', 'sentinel 1', 'sentinel 2',
  'copernicus', 'landsat', 'viirs', 'modis', 'black marble', 'blackmarble',
  'umbra', 'iceye', 'capella', 'maxar', 'planet labs', 'planetscope',
  'sentinel hub', 'sentinelhub', 'aisstream', 'global fishing watch',
  'hydra', 'ares', 'nexus', 'anansi', 'reach-sentinel', 'sentinel isr',
  'foresight', 'holdsite scoring',
]

/** Never discussed publicly at any tier. */
const SECURITY_IDENTITY = [
  'imsi', 'sigint', 'signals intelligence', 'interception', 'wiretap',
  'identity verification', 'warrant-gated', 'df compass', 'rf spectrum',
  'lawful intercept', 'phone tap',
]

/**
 * Real organisations. Not banned — the NiHSA relationship is legitimate
 * traction worth citing — but naming a third party in a post the founder
 * hasn't read is how you end up implying an endorsement nobody agreed to.
 */
const THIRD_PARTIES = [
  'nema', 'nihsa', 'cjtf', 'nnpc', 'nosdra', 'nesrea', 'dicon', 'nscdc',
  'nasrda', 'chevron', 'totalenergies', 'agip', 'seplat', 'ecowas',
  'dss', 'nigerian army', 'nigeria police',
]

/** Unverifiable marketing absolutes. */
const OVERCLAIM = [
  'guaranteed', '100%', 'always accurate', 'never miss', 'never misses',
  'fully autonomous', 'world-class', 'unmatched',
  'real-time surveillance', 'continuous surveillance', '24/7 surveillance',
]

/**
 * "the only" / "the first" are only a problem as MARKET claims. Plain English
 * uses them constantly ("the first one matters", "the only version that
 * survives a courtroom"), and flagging those teaches the reviewer to ignore
 * the gate — which is worse than not flagging at all.
 */
const MARKET_CLAIM =
  /\b(the (only|first)|world'?s first)\s+(\w+\s+){0,3}(platform|system|company|firm|provider|solution|service|product|technology|tool)\b/i

/** Decimal degrees, DMS, and "12.34N 5.67E" style coordinate pairs. */
const COORD_PATTERNS = [
  /-?\d{1,2}\.\d{3,}\s*[,°]\s*-?\d{1,3}\.\d{3,}/,
  /\d{1,2}\s*°\s*\d{1,2}\s*['′]\s*[\d.]+\s*["″]?\s*[NS]/i,
  /\b\d{1,2}\.\d+\s*[NS][ ,]+\d{1,3}\.\d+\s*[EW]\b/i,
]

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Whole-word (or whole-phrase) matching. Substring matching produced
 * false positives that mattered: "total" fired on "rainfall totals".
 */
const found = (haystack, needles) =>
  needles.filter((n) => new RegExp(`(?<![a-z0-9])${escape(n)}(?![a-z0-9])`, 'i').test(haystack))

/**
 * @param {{caption?: string, thread?: string[], card?: object, image_prompt?: string,
 *          illustrative?: boolean, cites_detection?: boolean, evidence?: string}} post
 * @returns {{verdict: 'PASS'|'REVIEW'|'KILL', reasons: string[]}}
 */
export function opsecCheck(post) {
  const reasons = []
  let verdict = 'PASS'

  const kill = (r) => { reasons.push(`KILL: ${r}`); verdict = 'KILL' }
  const review = (r) => {
    reasons.push(`REVIEW: ${r}`)
    if (verdict !== 'KILL') verdict = 'REVIEW'
  }

  // Everything the post would put in front of a reader, in one string.
  const text = [
    post.caption ?? '',
    ...(post.thread ?? []),
    ...Object.values(post.card ?? {}),
    post.image_prompt ?? '',
  ].join(' \n ')
  const lower = text.toLowerCase()

  for (const hit of found(lower, BANNED_NAMES)) {
    kill(`names an upstream source or internal codename ("${hit}")`)
  }
  for (const hit of found(lower, SECURITY_IDENTITY)) {
    kill(`touches the Security & Identity pillar ("${hit}")`)
  }
  for (const p of COORD_PATTERNS) {
    if (p.test(text)) { kill('contains what looks like actionable coordinates'); break }
  }
  for (const hit of found(lower, OVERCLAIM)) {
    review(`unverifiable absolute ("${hit}")`)
  }
  for (const hit of found(lower, THIRD_PARTIES)) {
    review(`names a third-party organisation ("${hit}")`)
  }
  if (MARKET_CLAIM.test(text)) {
    review('unverifiable market-position claim ("the only/first ... platform")')
  }

  // A specific detection claim needs a traceable record behind it. This is the
  // rule that protects the brand's entire "every claim traces to a real running
  // system" promise.
  if (post.cites_detection && !post.evidence) {
    kill('claims a specific detection with no evidence reference')
  }

  // Synthetic imagery must be labelled, or it reads as a real satellite capture.
  if (post.image_prompt && post.illustrative !== true) {
    kill('AI-generated visual not marked illustrative')
  }

  // Dates or place-specific framing on an illustrative image invite the exact
  // misreading the label exists to prevent.
  if (post.illustrative && /\b(19|20)\d{2}\b/.test(text) && post.cites_detection) {
    review('illustrative visual paired with a dated claim')
  }

  // Internal routing labels must never reach a public graphic.
  const PILLAR_IDS = ['explainer', 'capability', 'context', 'mission', 'proof', 'activity']
  const eyebrow = (post.card?.eyebrow ?? '').toLowerCase()
  for (const id of PILLAR_IDS) {
    if (eyebrow.includes(id)) review(`internal pillar label "${id}" leaked into the card eyebrow`)
  }
  if (/krystallx/i.test(post.card?.footright ?? '')) {
    review('footright repeats the wordmark already printed on the card')
  }

  if (!post.caption || post.caption.trim().length < 20) {
    kill('caption missing or too short to be a real post')
  }

  return { verdict, reasons }
}
