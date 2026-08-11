/**
 * Content pillars and the weekly rotation.
 *
 * visual is CARD everywhere for now: the card renderer is free, instant and
 * perfectly on-brand, and it needs no third-party account. AI imagery and
 * video are deferred — video especially, since it was the only line item
 * that cost real money.
 *
 * Tiers map to the autonomy decision: AUTO publishes unattended, APPROVE waits
 * for a Telegram tap, DRAFT never publishes without an edit. Assigned per
 * pillar rather than per post so autonomy is a property of the content type,
 * not something the model can talk itself into.
 */

export const PILLARS = {
  EXPLAINER: {
    id: 'EXPLAINER',
    tier: 'AUTO',
    visual: 'CARD',
    brief:
      'Teach one concrete thing about how satellite monitoring actually works — why radar sees through cloud, what a false positive costs, why revisit cadence matters more than resolution. No product pitch. The reader should finish slightly better informed even if they never buy anything.',
  },
  CAPABILITY: {
    id: 'CAPABILITY',
    tier: 'APPROVE',
    visual: 'CARD',
    brief:
      'Explain one capability and, crucially, its honest limits. The limit is the credibility. Never imply continuous surveillance where the truth is periodic sampling.',
  },
  CONTEXT: {
    id: 'CONTEXT',
    tier: 'APPROVE',
    visual: 'CARD',
    brief:
      'Nigeria and West Africa context: flood season, the economics of pipeline theft, why dam management is a downstream problem. Use only widely-published public knowledge. No claim about what we detected.',
  },
  MISSION: {
    id: 'MISSION',
    tier: 'AUTO',
    visual: 'CARD',
    brief:
      'Why the company works the way it does — evidence over assertion, honest limits, judicial accountability. Position, do not boast.',
  },
  PROOF: {
    id: 'PROOF',
    tier: 'DRAFT',
    visual: 'CARD',
    brief:
      'The Numan 2022 hindcast: flagged four days before the official warning, with the 2021 control year correctly quiet. This is the ONLY claim with a reconstructed dated record. Never invent a second one.',
  },
  ACTIVITY: {
    id: 'ACTIVITY',
    tier: 'DRAFT',
    visual: 'CARD',
    brief:
      'Heavily abstracted operating tempo only — scale of monitoring, never a specific detection, location, client, or date. If it could identify where or for whom, it does not ship.',
  },
}

/** Mon–Sun. Explainers carry the week because they are safe and inexhaustible. */
export const WEEKLY_ROTATION = [
  'EXPLAINER', 'CAPABILITY', 'CONTEXT', 'EXPLAINER', 'MISSION', 'CONTEXT', 'ACTIVITY',
]

export function pillarForDate(date = new Date()) {
  // getUTCDay(): 0=Sun. Shift so Monday is index 0.
  const idx = (date.getUTCDay() + 6) % 7
  return PILLARS[WEEKLY_ROTATION[idx]]
}
