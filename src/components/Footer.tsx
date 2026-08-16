import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-steel mt-auto">
      <div className="max-w-[1240px] mx-auto px-7 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-2.5 h-2.5 bg-amber" />
            <span className="font-display font-bold text-[17px] tracking-wide text-ink">
              KRYSTALLX <span className="text-amber">SHIELD</span>
            </span>
          </div>
          <p className="text-[13px] text-ink-dim leading-relaxed max-w-[26ch]">
            Satellite-verified intelligence for institutions that protect Nigeria's people, water, and borders.
          </p>
        </div>

        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-ink-faint mb-4">Capabilities</div>
          <ul className="flex flex-col gap-2.5 text-[13px]">
            <li><Link to="/environmental-intelligence" className="text-ink-dim hover:text-cyan transition-colors">Environmental Intelligence</Link></li>
            <li><Link to="/maritime-domain-awareness" className="text-ink-dim hover:text-cyan transition-colors">Maritime Domain Awareness</Link></li>
            <li><Link to="/land-threat-intelligence" className="text-ink-dim hover:text-amber transition-colors">Land &amp; Threat Intelligence</Link></li>
            <li><Link to="/security-identity" className="text-ink-dim hover:text-red transition-colors">Security &amp; Identity</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-ink-faint mb-4">Company</div>
          <ul className="flex flex-col gap-2.5 text-[13px]">
            <li><Link to="/mission" className="text-ink-dim hover:text-ink transition-colors">Mission</Link></li>
            <li><Link to="/evidence" className="text-ink-dim hover:text-ink transition-colors">Evidence</Link></li>
            <li><Link to="/request-briefing" className="text-ink-dim hover:text-ink transition-colors">Request a Briefing</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-ink-faint mb-4">Contact</div>
          <ul className="flex flex-col gap-2.5 text-[13px] text-ink-dim">
            <li>hello@krystallxsheild.org</li>
            <li className="text-ink-faint pt-1">By qualified briefing only — no self-serve access.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-steel">
        <div className="max-w-[1240px] mx-auto px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[10px] tracking-wide text-ink-faint uppercase">
          <span>&copy; {new Date().getFullYear()} KrystallX Shield. All rights reserved.</span>
          <span>Nigeria &amp; West Africa</span>
        </div>
      </div>
    </footer>
  )
}
