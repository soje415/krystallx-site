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
      'Satellite ISR Sweep — imaging tasking on demand',
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

const C4ISR = [
  {
    letter: 'C²',
    name: 'Command & Control',
    detail:
      'A single live operating picture for the state, with dispatch and tasking driven from it — so the commander and the officer on the ground are reading the same map.',
  },
  {
    letter: 'C³',
    name: 'Communications',
    detail:
      'Alerting into the channels units already use, so a detection reaches the people who can act on it without waiting for a shift briefing.',
  },
  {
    letter: 'C⁴',
    name: 'Computers',
    detail:
      'Deployed as software on infrastructure the state already has. No new command centre required to start — Tier 1 changes nothing about existing infrastructure.',
  },
  {
    letter: 'ISR',
    name: 'Intelligence, Surveillance & Reconnaissance',
    detail:
      'Satellite tasking on demand: threat mapping to LGA level, holdsite and camp detection, and radar imaging that works through cloud and darkness.',
  },
]

export function Deployment() {
  return (
    <PageShell>
      <section className="border-b border-steel relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-7 py-24 md:py-28 relative">
          <Reveal>
            <Eyebrow color="var(--color-red)">State Police Deployment · C4ISR</Eyebrow>
            <h1 className="font-display font-bold text-[clamp(32px,5.5vw,54px)] leading-[1.04] max-w-3xl mb-6 text-balance">
              A state police force needs a <em className="text-red not-italic">command picture</em> on day one.
            </h1>
            <p className="text-ink-dim text-[16px] md:text-[17px] max-w-2xl leading-relaxed mb-5">
              As Nigerian states prepare to stand up their own policing capability, the hard part is not recruitment — it is command. Officers deployed without a shared operating picture are reacting to yesterday's report. C4ISR is the layer that turns a new force into a coordinated one: tactical command, security awareness, and satellite-derived intelligence in a single console.
            </p>
            <p className="text-ink-dim text-[16px] md:text-[17px] max-w-2xl leading-relaxed">
              A state's needs at first contact are rarely its needs after twelve months. Each tier is a real deployment scope, not a marketing label — and every tier is discussed and configured in a briefing, not a checkout.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-20">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-3">
              What C4ISR means here
            </div>
            <h2 className="font-display font-bold text-[28px] mb-10 max-w-2xl text-balance">
              An acronym is worth nothing. These are the components it maps to.
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-steel border border-steel">
            {C4ISR.map((c, i) => (
              <Reveal key={c.letter} delay={i * 0.06} className="bg-elevated p-6">
                <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-red mb-2">{c.letter}</div>
                <h3 className="font-display font-semibold text-[16px] mb-2 text-ink">{c.name}</h3>
                <p className="text-[12.5px] text-ink-dim leading-relaxed">{c.detail}</p>
              </Reveal>
            ))}
          </div>
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
