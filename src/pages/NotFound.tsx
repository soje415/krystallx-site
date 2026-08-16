import { Link } from 'react-router-dom'
import { PageShell, Reveal, Eyebrow } from '../components/motion'
import { useSeo } from '../lib/seo'

export function NotFound() {
  useSeo('Page not found — KrystallX Shield')
  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-7 py-32 md:py-40 relative">
          <Reveal>
            <Eyebrow color="var(--color-red)">Signal lost · 404</Eyebrow>
            <h1 className="font-display font-bold text-[clamp(32px,5.5vw,54px)] leading-[1.04] max-w-2xl mb-6 text-balance">
              No coverage at these coordinates.
            </h1>
            <p className="text-ink-dim text-[16px] max-w-xl leading-relaxed mb-10">
              The page you requested isn't in our archive. It may have been moved, or the link may be incomplete.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase bg-amber text-void px-7 py-4 hover:bg-amber-glow transition-colors"
              >
                Return to base →
              </Link>
              <Link
                to="/request-briefing"
                className="inline-flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase border border-steel text-ink-dim px-7 py-4 hover:border-ink-faint hover:text-ink transition-colors"
              >
                Request a Briefing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
