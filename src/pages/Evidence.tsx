import { PageShell, Reveal, Eyebrow } from '../components/motion'
import { HindcastChart } from '../components/HindcastChart'
import { LEAD_DAYS } from '../data/numan'

const RULE = [
  ['Surge test', 'Wetted area at least 1.4× the trailing median of passes 10–45 days back — is this reach carrying more water than it was carrying itself, recently?'],
  ['Seasonal test', 'Wetted area at least 1.4× the control-year median at the same day of year — is this more than the river normally carries on this date?'],
  ['Floor', '20 km² absolute, so a proportional jump on a nearly dry reach cannot trip anything.'],
  ['WATCH', 'Both tests pass on a single pass.'],
  ['CONFIRMED', 'Both tests pass on two consecutive passes, and the upstream reservoir gate is open — at least 80% full, or filling at 2% or more per week.'],
]

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
              We'd rather show you one claim we can fully defend than ten we can't. This page grows only as
              capabilities clear the same bar the Numan case did — so here is the whole record, the rule that read it,
              and the numbers underneath, rather than a sentence asking you to take our word for it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* THE CHART — the claim itself, in the measurements */}
      <section className="max-w-[1240px] mx-auto px-7 pt-20 pb-16">
        <Reveal>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-green mb-3">Hindcast-certified</div>
          <h2 className="font-display font-bold text-[30px] mb-4 text-balance">The Numan flood, September 2022</h2>
          <p className="text-ink-dim text-[14.5px] leading-relaxed max-w-2xl mb-10">
            The September 2022 Benue River flood at Numan, Adamawa State, was one of the most consequential flood
            events in recent Nigerian history. We ran the live detector back across the season, pass by pass, and
            recorded where it would have fired.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <HindcastChart />
        </Reveal>
      </section>

      {/* WHAT THE CHART SHOWS + THE RULE */}
      <section className="max-w-[1240px] mx-auto px-7 pb-24">
        <div className="grid md:grid-cols-[1fr_1fr] gap-16 items-start">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-4">What it shows</div>
            <div className="space-y-5 text-[14.5px] text-ink-dim leading-relaxed">
              <p>
                Through July and August the reach moves inside its usual band, crossing the seasonal threshold now and
                again without ever satisfying both tests twice in a row. On <span className="text-ink">4 September</span>{' '}
                it jumps to 69.3 km² — clear of both tests — and the detector raises a WATCH. On{' '}
                <span className="text-ink">9 September</span> the next pass holds at 60.5 km², still clear of both, and
                with the upstream reservoir gate open the level escalates to CONFIRMED.
              </p>
              <p>
                That is <span className="text-green">{LEAD_DAYS} days</span> before the official warning went out
                through conventional channels. Run against the equivalent 2021 window on the same reach, the same
                detector stayed quiet all season — no false CONFIRMED, not once.
              </p>
              <p>
                This isn't a backtest tuned to the answer. The rule beside this text is the rule running live today
                across the monitored reaches; we pointed it at a known historical event to confirm it would have worked
                when it mattered. The thresholds are computed from the control years, not fitted to 2022.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="border border-steel bg-elevated">
              <div className="border-b border-steel px-6 py-3.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint">
                The detector, in full
              </div>
              <div className="divide-y divide-steel">
                {RULE.map(([name, detail]) => (
                  <div key={name} className="px-6 py-4">
                    <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-cyan mb-1.5">{name}</div>
                    <p className="text-[13px] text-ink-dim leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-steel px-6 py-4">
                <p className="text-[12.5px] text-ink-faint leading-relaxed">
                  Measurement is synthetic-aperture radar, so cloud cover over the basin during a flood — which is
                  when cloud is guaranteed — does not blind it. Radar revisit is a periodic sample, not a continuous
                  watch: the detector sees the river on pass days and never between them.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RECORD SUMMARY */}
      <section className="border-t border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-20">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-8">Record</div>
          </Reveal>
          <Reveal delay={0.08}>
            <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-steel border border-steel font-mono">
              {[
                ['Event', 'Numan flood', 'text-ink'],
                ['River reach', 'Benue @ Gongola confluence', 'text-ink'],
                ['Detection method', 'SAR reach fingerprint', 'text-ink'],
                ['WATCH raised', '4 Sep 2022', 'text-amber'],
                ['CONFIRMED', '9 Sep 2022', 'text-green'],
                ['Lead over official warning', `+${LEAD_DAYS} days`, 'text-green'],
                ['2021 control season', 'Quiet — correct', 'text-ink'],
                ['Status', 'Confirmed', 'text-green'],
              ].map(([label, value, tone]) => (
                <div key={label} className="bg-elevated px-5 py-5">
                  <dt className="text-[10px] tracking-[0.16em] uppercase text-ink-faint mb-2">{label}</dt>
                  <dd className={`text-[14px] ${tone} m-0`}>{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-20">
          <Reveal>
            <div className="border border-steel bg-elevated p-8 flex gap-4 items-start max-w-3xl">
              <span className="w-1.5 h-1.5 mt-1.5 shrink-0 bg-amber" />
              <p className="text-[13.5px] text-ink-dim leading-relaxed">
                Additional capabilities — resource-intel detections, maritime dark-vessel flags, threat-map coverage —
                are live and operating today but not yet listed here, because they haven't been run back against a
                fully dated, public historical record the way Numan was. That work is ongoing; this page will grow as
                each one clears the bar.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
