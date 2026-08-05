import { PageShell, Reveal, Eyebrow } from '../components/motion'

const COVERS = [
  'Which capabilities apply to your mandate — environmental, maritime, land, or security',
  'Coverage today vs. what\'s in build, stated plainly',
  'A live walkthrough on a region you choose, not a canned demo',
  'What "warrant-gated" actually means for the Security & Identity pillar',
]

export function RequestBriefing() {
  return (
    <PageShell>
      <section className="border-b border-steel relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-7 py-24 md:py-28 relative">
          <Reveal>
            <Eyebrow>Request a Briefing</Eyebrow>
            <h1 className="font-display font-bold text-[clamp(32px,5.5vw,54px)] leading-[1.04] max-w-3xl mb-6 text-balance">
              No self-serve signup. This is a relationship, not a checkout.
            </h1>
            <p className="text-ink-dim text-[16px] md:text-[17px] max-w-2xl leading-relaxed">
              We work through qualified briefings with state and federal agencies, not open sign-up — especially for the Security &amp; Identity pillar, which is never demonstrated outside a verified government relationship.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-7 py-24">
        <div className="grid md:grid-cols-2 gap-16">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-4">A briefing covers</div>
            <ul className="flex flex-col gap-4">
              {COVERS.map((c) => (
                <li key={c} className="flex gap-3 text-[14px] text-ink-dim leading-relaxed">
                  <span className="w-1.5 h-1.5 mt-2 shrink-0 bg-amber" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-steel bg-elevated p-8">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-5">Reach us directly</div>
              <a
                href="mailto:hello@krystallxdefense.com?subject=Briefing%20Request"
                className="block font-display font-semibold text-[22px] text-amber hover:text-amber-glow transition-colors mb-6"
              >
                hello@krystallxdefense.com
              </a>
              <p className="text-[13px] text-ink-dim leading-relaxed mb-6">
                Include your agency or organization, mandate, and which pillar you're interested in — we'll route it to the right person and follow up to schedule.
              </p>
              <div className="pt-6 border-t border-steel text-[12.5px] text-ink-faint leading-relaxed">
                For Security &amp; Identity specifically: briefings are limited to verified government and law-enforcement entities. Expect a verification step before any technical discussion.
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
