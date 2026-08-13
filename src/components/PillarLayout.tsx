import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageShell, Reveal, StatCounter, Eyebrow } from './motion'

export interface PillarStat { value: number; suffix?: string; decimals?: number; label: string }
export interface PillarCapability { name: string; description: string; proof?: string }

export function PillarLayout({
  colorVar, colorClass, eyebrow, title, description, stats, capabilities, note,
  visual, visualHeading, visualLead,
}: {
  colorVar: string
  colorClass: string
  eyebrow: string
  title: ReactNode
  description: string
  stats: PillarStat[]
  capabilities: PillarCapability[]
  note?: string
  /** The pillar's method diagram — the argument, before the capability list. */
  visual?: ReactNode
  visualHeading?: string
  visualLead?: string
}) {
  return (
    <PageShell>
      <section className="border-b border-steel relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: colorVar }}
        />
        <div className="max-w-[1240px] mx-auto px-7 py-24 md:py-28 relative">
          <Reveal>
            <Eyebrow color={colorVar}>{eyebrow}</Eyebrow>
            <h1 className="font-display font-bold text-[clamp(32px,5.5vw,54px)] leading-[1.04] max-w-4xl mb-6 text-ink text-balance">
              {title}
            </h1>
            <p className="text-ink-dim text-[16px] md:text-[17px] max-w-2xl leading-relaxed mb-10">
              {description}
            </p>
          </Reveal>
          {stats.length > 0 && (
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-10 md:gap-14 pt-8 border-t border-steel">
                {stats.map((s) => (
                  <StatCounter key={s.label} {...s} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {visual && (
        <section className="border-b border-steel">
          <div className="max-w-[1240px] mx-auto px-7 py-20">
            <Reveal>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: colorVar }}>
                How it works
              </div>
              {visualHeading && (
                <h2 className="font-display font-bold text-[28px] mb-4 max-w-2xl text-balance">{visualHeading}</h2>
              )}
              {visualLead && (
                <p className="text-ink-dim text-[14.5px] leading-relaxed max-w-2xl mb-10">{visualLead}</p>
              )}
            </Reveal>
            <Reveal delay={0.1}>{visual}</Reveal>
          </div>
        </section>
      )}

      <section className="max-w-[1240px] mx-auto px-7 py-20">
        <Reveal>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-10">Capabilities</div>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-px bg-steel border border-steel">
          {capabilities.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.06} className="bg-elevated p-7 relative">
              <div className={`absolute top-0 left-0 w-1 h-full ${colorClass}`} />
              <h3 className="font-display font-semibold text-[19px] mb-2.5 text-ink">{c.name}</h3>
              <p className="text-[13.5px] text-ink-dim leading-relaxed">{c.description}</p>
              {c.proof && (
                <p className="text-[12px] font-mono text-green mt-3.5">{c.proof}</p>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {note && (
        <section className="max-w-[1240px] mx-auto px-7 pb-20">
          <Reveal>
            <div className="border border-steel bg-elevated p-6 flex gap-4 items-start">
              <span className="w-1.5 h-1.5 mt-1.5 shrink-0" style={{ background: colorVar }} />
              <p className="text-[13.5px] text-ink-dim leading-relaxed">{note}</p>
            </div>
          </Reveal>
        </section>
      )}

      <section className="border-t border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Reveal>
            <h2 className="font-display font-semibold text-[24px] text-ink">See this on your own AOI.</h2>
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
