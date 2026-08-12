#!/usr/bin/env node
/**
 * Daily social run: pick pillar → generate → OPSEC gate → render card → queue.
 *
 * Publishing is intentionally NOT wired. Posts land in social/out/ as a queue
 * of JSON + PNG. The publisher is an adapter (see publish() below) so Ayrshare
 * or direct platform APIs slot in without touching generation or the gate.
 *
 *   node social/run.mjs                 # today's pillar
 *   node social/run.mjs --pillar EXPLAINER
 *   node social/run.mjs --days 7        # generate a week ahead
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { PILLARS, pillarForDate } from './pillars.mjs'
import { opsecCheck } from './opsec.mjs'
import { generatePost } from './generate.mjs'
import { publishPost } from './publish.mjs'
import { notify } from './notify.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const OUT = join(HERE, 'out')
// Cards live under public/ so they deploy with the site. Instagram will not
// accept an upload — it fetches the image from a public URL — so an
// undeployed card means no Instagram post.
const CARDS = join(ROOT, 'public', 'cards')

/** Load .dev.vars so local runs use the same secret file as wrangler. */
function loadDevVars() {
  const p = join(ROOT, '.dev.vars')
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

function recentHeadlines(limit = 12) {
  if (!existsSync(OUT)) return []
  return readdirSync(OUT)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .slice(-limit)
    .map((f) => {
      try {
        // Headline alone is too weak a signal — two posts can carry different
        // headlines and still cover identical ground. Include the sub so the
        // model sees the actual subject matter it must avoid repeating.
        const d = JSON.parse(readFileSync(join(OUT, f), 'utf8'))
        return d.card ? `${d.card.headline} — ${d.card.sub}` : null
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

function renderCard(post, slug) {
  mkdirSync(CARDS, { recursive: true })
  const out = join(CARDS, `${slug}.png`)
  execFileSync(
    'node',
    [
      join(ROOT, 'scripts/render-card.mjs'),
      '--out', out,
      '--eyebrow', post.card.eyebrow,
      '--headline', post.card.headline,
      '--sub', post.card.sub,
      '--footright', post.card.footright,
    ],
    { stdio: 'pipe' },
  )
  return out
}



async function runOne(pillar, dateStr) {
  const slug = `${dateStr}-${pillar.id.toLowerCase()}`
  process.stdout.write(`\n── ${slug} ──\n`)

  const post = await generatePost(pillar, recentHeadlines())
  const gate = opsecCheck(post)
  post.opsec = gate

  if (gate.verdict === 'KILL') {
    process.stdout.write(`  ✗ KILLED — discarded, not queued\n`)
    for (const r of gate.reasons) process.stdout.write(`    ${r}\n`)
    return { slug, killed: true, gate }
  }

  // A REVIEW verdict overrides the pillar's tier — it cannot auto-publish.
  const effectiveTier = gate.verdict === 'REVIEW' ? 'APPROVE' : post.tier
  post.effective_tier = effectiveTier

  const card = renderCard(post, slug)
  writeFileSync(join(OUT, `${slug}.json`), JSON.stringify(post, null, 2))

  // AUTO publishes immediately; everything else waits for a tap in Telegram.
  const result =
    effectiveTier === 'AUTO'
      ? await publishPost(post, card, slug)
      : { published: false, reason: `held for ${effectiveTier}` }

  let notified = { notified: false }
  try {
    notified = await notify(post, card, slug, effectiveTier, result)
  } catch (e) {
    // A notification failure must never lose the post — it's on disk either way.
    notified = { notified: false, reason: e.message }
  }

  process.stdout.write(`  ✓ ${gate.verdict} · tier ${effectiveTier}\n`)
  for (const r of gate.reasons) process.stdout.write(`    ${r}\n`)
  process.stdout.write(`  card: ${card}\n`)
  process.stdout.write(`  ${post.card.headline.replace(/<\/?em>/g, '')}\n`)
  process.stdout.write(`  publish: ${result.reason}\n`)
  process.stdout.write(`  telegram: ${notified.notified ? 'sent' : notified.reason ?? 'skipped'}\n`)
  process.stdout.write(`  tokens: ${post.usage.input} in / ${post.usage.output} out\n`)

  return { slug, killed: false, gate, tier: effectiveTier }
}

async function main() {
  loadDevVars()
  mkdirSync(OUT, { recursive: true })
  mkdirSync(CARDS, { recursive: true })

  const argv = process.argv.slice(2)
  const arg = (f) => { const i = argv.indexOf(f); return i === -1 ? null : argv[i + 1] }

  const days = Number(arg('--days') ?? 1)
  const forced = arg('--pillar')

  const results = []
  for (let d = 0; d < days; d++) {
    const date = new Date(Date.now() + d * 86_400_000)
    const pillar = forced ? PILLARS[forced.toUpperCase()] : pillarForDate(date)
    if (!pillar) throw new Error(`unknown pillar: ${forced}`)
    results.push(await runOne(pillar, date.toISOString().slice(0, 10)))
  }

  const killed = results.filter((r) => r.killed).length
  process.stdout.write(
    `\n${results.length} generated · ${results.length - killed} queued · ${killed} killed by OPSEC\n`,
  )
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
