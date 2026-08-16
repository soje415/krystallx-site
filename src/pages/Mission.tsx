import { PageShell, Reveal, Eyebrow } from '../components/motion'
import { useSeo } from '../lib/seo'

const VALUES = [
  {
    title: 'Verify before we claim it',
    desc: "If a capability hasn't been checked against a real event, it doesn't appear on this site as proven — it's labeled as what it actually is.",
  },
  {
    title: 'State the gaps out loud',
    desc: "Partial coverage gets described as partial coverage. A model with no real-event validation gets described that way, not glossed over.",
  },
  {
    title: 'Accountability is a feature, not friction',
    desc: 'Every identity lookup traces to a warrant and a case, permanently and unchangeably. That constraint is deliberate, not a limitation we\'re working around.',
  },
]

export function Mission() {
  useSeo(
    'Mission — KrystallX Shield',
    'Built for institutions that have to answer for what they claim. Verify before we claim it, state the gaps out loud, and treat accountability as a feature.',
  )
  return (
    <PageShell>
      <section className="border-b border-steel relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-7 py-24 md:py-28 relative">
          <Reveal>
            <Eyebrow>Mission</Eyebrow>
            <h1 className="font-display font-bold text-[clamp(32px,5.5vw,54px)] leading-[1.04] max-w-3xl mb-6 text-balance">
              Built for institutions that have to answer for what they claim.
            </h1>
            <p className="text-ink-dim text-[16px] md:text-[17px] max-w-2xl leading-relaxed">
              KrystallX Shield exists because Nigeria's environmental and security agencies need intelligence they can act on <em className="text-ink not-italic">and</em> defend afterward — to a court, to a legislature, to the public. That's a different bar than "looks impressive in a demo."
            </p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-7 py-24">
        <Reveal>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-3">How we operate</div>
          <h2 className="font-display font-bold text-[30px] mb-14 max-w-2xl text-balance">Three rules that shape everything we ship.</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-px bg-steel border border-steel">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="bg-elevated p-8">
              <div className="font-mono text-[24px] text-amber mb-4 tabular-nums">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="font-display font-semibold text-[19px] mb-3 text-ink">{v.title}</h3>
              <p className="text-[13.5px] text-ink-dim leading-relaxed">{v.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-24">
          <div className="grid md:grid-cols-2 gap-16">
            <Reveal>
              <h2 className="font-display font-bold text-[26px] mb-4 text-balance">Where we sit</h2>
              <p className="text-ink-dim text-[14.5px] leading-relaxed">
                Nigerian-built, Nigerian-focused, expanding across West Africa. We work with state and federal agencies whose mandate spans flood response, environmental enforcement, and public security — not as a foreign vendor parachuting in a generic platform, but as a team that built this against real events on this ground.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display font-bold text-[26px] mb-4 text-balance">Who this is for</h2>
              <p className="text-ink-dim text-[14.5px] leading-relaxed">
                State emergency management agencies, environmental regulators, maritime and border security, and state police or security outfits operating under proper legal authority. We work through qualified relationships, not self-serve signup.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
