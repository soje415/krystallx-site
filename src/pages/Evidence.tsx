import { PageShell, Reveal, Eyebrow } from '../components/motion'

export function Evidence() {
  return (
    <PageShell>
      <section className="border-b border-steel relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-7 py-24 md:py-28 relative">
          <Reveal>
            <Eyebrow color="var(--color-green)">Evidence</Eyebrow>
            <h1 className="font-display font-bold text-[clamp(32px,5.5vw,54px)] leading-[1.04] max-w-3xl mb-6 text-balance">
              One fully reconstructed, dated case. More being certified.
            </h1>
            <p className="text-ink-dim text-[16px] md:text-[17px] max-w-2xl leading-relaxed">
              We'd rather show you one claim we can fully defend than ten we can't. This page grows only as capabilities clear the same bar the Numan case did.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-7 py-24">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-16 items-start">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-green mb-4">Hindcast-certified</div>
            <h2 className="font-display font-bold text-[30px] mb-6 text-balance">The Numan flood, September 2022</h2>
            <div className="space-y-5 text-[14.5px] text-ink-dim leading-relaxed">
              <p>
                We ran our reach-sentinel array back against the historical record of the September 2022 Benue River flood event at Numan, Adamawa State — one of the most consequential flood events in recent Nigerian history.
              </p>
              <p>
                The array's SAR-based reach fingerprints flagged the flood signature <span className="text-ink">four days before</span> the official warning was issued through conventional channels. As a control, we ran the same array against the equivalent 2021 window on the same reach — it correctly stayed quiet, with no false signal.
              </p>
              <p>
                This isn't a backtest tuned to the answer. The detection methodology is the same one running live today across the monitored reaches — we simply pointed it at a known historical event to confirm it would have worked when it mattered.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="border border-steel bg-elevated p-8 font-mono text-[12px] leading-loose sticky top-32">
              <div className="text-[10px] tracking-widest uppercase text-ink-faint mb-5">Record</div>
              <div className="flex justify-between border-b border-steel pb-3 mb-3"><span className="text-ink-faint">Event</span><span className="text-ink">Numan Flood</span></div>
              <div className="flex justify-between border-b border-steel pb-3 mb-3"><span className="text-ink-faint">River reach</span><span className="text-ink">Benue, Adamawa</span></div>
              <div className="flex justify-between border-b border-steel pb-3 mb-3"><span className="text-ink-faint">Event date</span><span className="text-ink">Sep 2022</span></div>
              <div className="flex justify-between border-b border-steel pb-3 mb-3"><span className="text-ink-faint">Detection method</span><span className="text-ink">SAR reach fingerprint</span></div>
              <div className="flex justify-between border-b border-steel pb-3 mb-3"><span className="text-ink-faint">Lead time</span><span className="text-green">+4 days</span></div>
              <div className="flex justify-between border-b border-steel pb-3 mb-3"><span className="text-ink-faint">2021 control window</span><span className="text-ink">Quiet — correct</span></div>
              <div className="flex justify-between"><span className="text-ink-faint">Status</span><span className="text-green">Confirmed</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-20">
          <Reveal>
            <div className="border border-steel bg-elevated p-8 flex gap-4 items-start max-w-3xl">
              <span className="w-1.5 h-1.5 mt-1.5 shrink-0 bg-amber" />
              <p className="text-[13.5px] text-ink-dim leading-relaxed">
                Additional capabilities — resource-intel detections, maritime dark-vessel flags, threat-map coverage — are live and operating today but not yet listed here, because they haven't been run back against a fully dated, public historical record the way Numan was. That work is ongoing; this page will grow as each one clears the bar.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
