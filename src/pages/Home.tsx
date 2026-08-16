import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageShell, Reveal, StatCounter, Eyebrow } from '../components/motion'
import { useSeo } from '../lib/seo'
import { HeroGlobe } from '../components/HeroGlobe'
import { OrbitTelemetry } from '../components/OrbitTelemetry'
import { SensorBand } from '../components/SensorBand'

const PILLARS = [
  {
    to: '/environmental-intelligence',
    tag: 'Shown concretely',
    color: 'var(--color-cyan)',
    colorClass: 'text-cyan',
    barClass: 'bg-cyan',
    title: 'Environmental Intelligence',
    desc: 'Flood, dam, mining, oil-slick, methane, and carbon-MRV monitoring — satellite-driven, verified against real events.',
  },
  {
    to: '/maritime-domain-awareness',
    tag: 'Shown concretely',
    color: 'var(--color-cyan)',
    colorClass: 'text-cyan',
    barClass: 'bg-cyan',
    title: 'Maritime Domain Awareness',
    desc: 'Vessel tracking, dark-vessel and illegal-bunkering detection, flare and methane watch, and SAR — day or night, clear skies or cloud cover.',
  },
  {
    to: '/land-threat-intelligence',
    tag: 'Shown concretely',
    color: 'var(--color-amber)',
    colorClass: 'text-amber',
    barClass: 'bg-amber',
    title: 'Land & Threat Intelligence',
    desc: 'ISR sweep pipeline, holdsite and mining-camp detection, national threat mapping, orbital tracking.',
  },
  {
    to: '/security-identity',
    tag: 'Outcome-only',
    color: 'var(--color-red)',
    colorClass: 'text-red',
    barClass: 'bg-red',
    title: 'Security & Identity',
    desc: 'Warrant-gated identity verification and signals intelligence, under full judicial audit trail.',
  },
]

export function Home() {
  useSeo(
    'KrystallX Shield — Satellite-Verified Intelligence for Nigeria & West Africa',
    'Satellite-verified flood, maritime, and threat intelligence for Nigeria and West Africa, under full judicial accountability. We saw the Numan flood four days before the official warning did.',
  )
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative border-b border-steel overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-7 py-28 md:py-36 relative">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Eyebrow>Environmental &amp; Security Intelligence · Nigeria &amp; West Africa</Eyebrow>
              <h1 className="font-display font-bold text-[clamp(38px,6vw,68px)] leading-[1.02] tracking-tight mb-8 text-balance">
                We saw the Numan flood <em className="text-amber not-italic">four days</em> before the official warning did.
              </h1>
              <p className="text-ink-dim text-[17px] md:text-[19px] max-w-xl leading-relaxed mb-10">
                One platform for security and environmental intelligence — flood and dam early warning, maritime and pipeline monitoring, threat detection, and C4ISR for state policing. Satellite-verified, under full judicial accountability where it counts.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/request-briefing"
                  className="inline-flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase bg-amber text-void px-7 py-4 hover:bg-amber-glow transition-colors"
                >
                  Request a Briefing →
                </Link>
                <Link
                  to="/evidence"
                  className="inline-flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase border border-steel text-ink-dim px-7 py-4 hover:border-ink-faint hover:text-ink transition-colors"
                >
                  See the Evidence
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                <HeroGlobe />
                <div
                  className="absolute pointer-events-none"
                  style={{
                    inset: '-18%',
                    background:
                      'radial-gradient(ellipse 45% 45% at 50% 46%, rgba(43,169,224,0.14), transparent 70%)',
                  }}
                />
              </div>
              <div className="mt-6">
                <OrbitTelemetry />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-10 md:gap-16 mt-20 pt-10 border-t border-steel"
          >
            <StatCounter value={10} label="Dams monitored" />
            <StatCounter value={4} suffix="D" label="Numan lead time" />
            <StatCounter value={24} suffix="/7" label="Satellite sweep cadence" />
            <StatCounter value={4} label="Capability pillars" />
          </motion.div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="max-w-[1240px] mx-auto px-7 py-24">
        <Reveal>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-3">What we watch, what we verify</div>
          <h2 className="font-display font-bold text-[32px] mb-14 max-w-2xl text-balance">Four pillars. One console.</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-px bg-steel border border-steel">
          {PILLARS.map((p, i) => (
            <Reveal key={p.to} delay={i * 0.08}>
              <Link to={p.to} className="group block bg-elevated hover:bg-hover transition-colors p-8 h-full relative overflow-hidden">
                <div className={`absolute top-0 left-0 h-1 w-full ${p.barClass}`} />
                <span className="font-mono text-[9.5px] tracking-widest uppercase mb-4 block" style={{ color: p.color }}>{p.tag}</span>
                <h3 className="font-display font-semibold text-[22px] mb-3 text-ink group-hover:text-amber transition-colors">{p.title}</h3>
                <p className="text-[13.5px] text-ink-dim leading-relaxed mb-6 max-w-md">{p.desc}</p>
                <span className="font-mono text-[11px] tracking-wide uppercase text-ink-faint group-hover:text-ink transition-colors inline-flex items-center gap-1.5">
                  Explore <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <SensorBand />

      {/* STATE POLICE C4ISR */}
      <section className="border-t border-steel relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-red" />
        <div className="max-w-[1240px] mx-auto px-7 py-24">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-start">
            <Reveal>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-red mb-3">
                State Police Deployment · C4ISR
              </div>
              <h2 className="font-display font-bold text-[30px] mb-5 text-balance">
                A new police force needs a command picture, not just officers.
              </h2>
              <p className="text-ink-dim text-[14.5px] leading-relaxed mb-5">
                As Nigerian states prepare to stand up their own policing capability, the constraint is command, not
                headcount. We deploy C4ISR — tactical command, security awareness, and satellite intelligence in one
                console — in three tiers, starting with a tier that requires no change to a state's existing
                infrastructure.
              </p>
              <p className="text-ink-dim text-[14.5px] leading-relaxed mb-7">
                The same platform runs the environmental side: the flood, dam, and pipeline monitoring a state
                government needs sits behind the same login as the threat map. One relationship, both mandates.
              </p>
              <Link
                to="/state-police-deployment"
                className="font-mono text-[11px] tracking-wider uppercase text-red hover:text-amber transition-colors inline-flex items-center gap-1.5"
              >
                See the deployment tiers →
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="border border-steel bg-elevated divide-y divide-steel">
                {[
                  ['C²', 'Command & control', 'One live picture, dispatch driven from it'],
                  ['C³', 'Communications', 'Alerting into channels units already use'],
                  ['C⁴', 'Computers', 'Runs on infrastructure the state already has'],
                  ['ISR', 'Intelligence & reconnaissance', 'Satellite tasking, LGA-level threat mapping'],
                ].map(([letter, name, detail]) => (
                  <div key={letter} className="flex gap-4 p-5">
                    <span className="font-mono text-[12px] text-red w-9 shrink-0 pt-0.5">{letter}</span>
                    <div>
                      <div className="text-[14px] text-ink mb-0.5">{name}</div>
                      <div className="text-[12.5px] text-ink-dim leading-relaxed">{detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* EVIDENCE TEASER */}
      <section className="border-t border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-24">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-14 items-center">
            <Reveal>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-green mb-3">Hindcast-certified</div>
              <h2 className="font-display font-bold text-[30px] mb-5 text-balance">The Numan flood, September 2022.</h2>
              <p className="text-ink-dim text-[14.5px] leading-relaxed mb-6">
                Run back against the actual 2022 event, our reach-monitoring array flagged the Numan flood signature four days before the official warning was issued — while the neighboring 2021 dry season correctly stayed quiet. This is the one claim on this site with a fully reconstructed, dated record behind it.
              </p>
              <Link to="/evidence" className="font-mono text-[11px] tracking-wider uppercase text-amber hover:text-amber-glow transition-colors inline-flex items-center gap-1.5">
                Read the full methodology →
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="border border-steel bg-elevated p-8 font-mono text-[11.5px] leading-loose">
                <div className="flex justify-between border-b border-steel pb-2.5 mb-2.5"><span className="text-ink-faint">EVENT</span><span className="text-ink">NUMAN FLOOD</span></div>
                <div className="flex justify-between border-b border-steel pb-2.5 mb-2.5"><span className="text-ink-faint">DATE</span><span className="text-ink">SEP 2022</span></div>
                <div className="flex justify-between border-b border-steel pb-2.5 mb-2.5"><span className="text-ink-faint">SIGNAL LEAD TIME</span><span className="text-green">+4 DAYS</span></div>
                <div className="flex justify-between border-b border-steel pb-2.5 mb-2.5"><span className="text-ink-faint">2021 CONTROL YEAR</span><span className="text-ink">QUIET — CORRECT</span></div>
                <div className="flex justify-between"><span className="text-ink-faint">STATUS</span><span className="text-green">CONFIRMED</span></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="border-t border-steel relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-7 py-24 relative text-center">
          <Reveal>
            <h2 className="font-display font-bold text-[clamp(26px,4vw,42px)] mb-6 max-w-2xl mx-auto text-balance">
              Every claim on this site traces to a real, running system.
            </h2>
            <p className="text-ink-dim text-[15px] max-w-xl mx-auto mb-10">
              No self-serve signup, no public pricing. We work through a qualified briefing so the right people see the right depth.
            </p>
            <Link
              to="/request-briefing"
              className="inline-flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase bg-amber text-void px-8 py-4 hover:bg-amber-glow transition-colors"
            >
              Request a Briefing →
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
