import { Link } from 'react-router-dom'
import { PageShell, Reveal, Eyebrow } from '../components/motion'

interface Tier {
  tag: string
  name: string
  summary: string
  includes: string[]
  outcome: string
  featured?: boolean
}

const TIERS: Tier[] = [
  {
    tag: 'Tier 1',
    name: 'Foundational Situational Awareness',
    summary: 'A unified regional threat picture, deployed without any change to existing command infrastructure.',
    includes: [
      'National Threat Map — LGA-level heatmap for the state',
      'Orbital tracking view',
      'Warrant-gated identity verification, case-by-case',
    ],
    outcome: 'Command sees one current picture instead of assembling it from scattered reports.',
  },
  {
    tag: 'Tier 2',
    name: 'Enhanced Operational Intelligence',
    summary: 'Everything in Tier 1, plus proactive detection tasked directly against the state\'s active concerns.',
    includes: [
      'Everything in Tier 1',
      'Sentinel ISR — satellite sweep tasking on demand',
      'Holdsite & mining-camp detection',
      "Environmental & maritime layers relevant to the state's mandate",
    ],
    outcome: 'Detection ahead of the incident, not reporting after it.',
    featured: true,
  },
  {
    tag: 'Tier 3',
    name: 'Full Command Integration',
    summary: 'The platform becomes standing operational infrastructure, not a supplementary tool.',
    includes: [
      'Everything in Tier 2',
      'Full Security & Identity pillar, including capabilities not detailed publicly',
      'Cross-agency coordination workflows',
      'Dedicated onboarding, training, and named point of contact',
      'Priority tasking on state-defined areas of operation',
    ],
    outcome: 'One command relationship, accountable end to end.',
  },
]

export function Deployment() {
  return (
    <PageShell>
      <section className="border-b border-steel relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-7 py-24 md:py-28 relative">
          <Reveal>
            <Eyebrow color="var(--color-red)">State Police Deployment</Eyebrow>
            <h1 className="font-display font-bold text-[clamp(32px,5.5vw,54px)] leading-[1.04] max-w-3xl mb-6 text-balance">
              One platform, three tiers of command integration.
            </h1>
            <p className="text-ink-dim text-[16px] md:text-[17px] max-w-2xl leading-relaxed">
              A state's needs at first contact are rarely its needs after twelve months. Each tier is a real deployment scope, not a marketing label — and every tier is discussed and configured in a briefing, not a checkout.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-7 py-24">
        <div className="grid md:grid-cols-3 gap-px bg-steel border border-steel">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className={`h-full flex flex-col p-8 ${t.featured ? 'bg-hover' : 'bg-elevated'}`}>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-red">{t.tag}</span>
                  {t.featured && (
                    <span className="font-mono text-[9px] tracking-wider uppercase text-amber border border-amber px-2 py-0.5">Most adopted</span>
                  )}
                </div>
                <h3 className="font-display font-bold text-[22px] mb-3 text-ink leading-tight">{t.name}</h3>
                <p className="text-[13px] text-ink-dim leading-relaxed mb-6">{t.summary}</p>

                <div className="font-mono text-[9.5px] tracking-widest uppercase text-ink-faint mb-3">Includes</div>
                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {t.includes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[12.5px] text-ink-dim leading-snug">
                      <span className="text-red shrink-0">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-steel pt-5">
                  <div className="font-mono text-[9.5px] tracking-widest uppercase text-ink-faint mb-2">Outcome</div>
                  <p className="text-[13px] text-ink leading-relaxed">{t.outcome}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-20">
          <Reveal>
            <div className="border border-steel bg-elevated p-8 max-w-3xl flex gap-4 items-start">
              <span className="w-1.5 h-1.5 mt-1.5 shrink-0 bg-red" />
              <p className="text-[13.5px] text-ink-dim leading-relaxed">
                Tiers describe scope, not price — we don't publish rates here because deployment cost depends on the state's existing infrastructure, area of operation, and integration depth. What we do commit to publicly: every tier includes the same warrant-gated audit trail on identity verification, with no reduced version of that accountability at any level.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Reveal>
            <h2 className="font-display font-semibold text-[24px] text-ink">Talk through which tier fits your state.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/request-briefing"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase bg-amber text-void px-6 py-3.5 hover:bg-amber-glow transition-colors"
            >
              Request a Briefing →
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
