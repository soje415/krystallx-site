import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const CAPABILITIES = [
  { to: '/environmental-intelligence', label: 'Environmental Intelligence', color: 'var(--color-cyan)' },
  { to: '/maritime-domain-awareness', label: 'Maritime Domain Awareness', color: 'var(--color-cyan)' },
  { to: '/land-threat-intelligence', label: 'Land & Threat Intelligence', color: 'var(--color-amber)' },
  { to: '/security-identity', label: 'Security & Identity', color: 'var(--color-red)' },
]

const DEPLOYMENT = { to: '/state-police-deployment', label: 'State Police Deployment Tiers', color: 'var(--color-red)' }

export function Nav() {
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => setMobileOpen(false), [location.pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="border-b border-steel bg-void/80 backdrop-blur-md sticky top-11 z-40">
      <nav className="max-w-[1240px] mx-auto px-7 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-2.5 h-2.5 bg-amber group-hover:bg-amber-glow transition-colors" />
          <span className="font-display font-bold text-[19px] tracking-wide text-ink">
            KRYSTALLX <span className="text-amber">SHIELD</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 font-mono text-[11.5px] tracking-wide uppercase">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="px-4 py-2 text-ink-dim hover:text-ink transition-colors flex items-center gap-1.5"
            >
              Capabilities
              <svg width="9" height="9" viewBox="0 0 9 9" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
                <path d="M1 3 L4.5 6.5 L8 3" stroke="currentColor" strokeWidth="1.3" fill="none" />
              </svg>
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-64 border border-steel bg-elevated shadow-2xl shadow-black/60"
                >
                  {CAPABILITIES.map((c) => (
                    <Link
                      key={c.to}
                      to={c.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 border-b border-steel last:border-b-0 hover:bg-hover transition-colors normal-case"
                    >
                      <span className="w-1.5 h-1.5 shrink-0" style={{ background: c.color }} />
                      <span className="text-[12.5px] text-ink-dim tracking-normal">{c.label}</span>
                    </Link>
                  ))}
                  <Link
                    to={DEPLOYMENT.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 border-t border-steel bg-void/40 hover:bg-hover transition-colors normal-case"
                  >
                    <span className="w-1.5 h-1.5 shrink-0" style={{ background: DEPLOYMENT.color }} />
                    <span className="text-[12.5px] text-ink-dim tracking-normal">{DEPLOYMENT.label}</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/mission" className={({ isActive }) => `px-4 py-2 transition-colors ${isActive ? 'text-amber' : 'text-ink-dim hover:text-ink'}`}>
            Mission
          </NavLink>
          <NavLink to="/evidence" className={({ isActive }) => `px-4 py-2 transition-colors ${isActive ? 'text-amber' : 'text-ink-dim hover:text-ink'}`}>
            Evidence
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/request-briefing"
            className="hidden sm:inline-block font-mono text-[11px] tracking-wider uppercase bg-amber text-void px-4 py-2.5 hover:bg-amber-glow transition-colors"
          >
            Request Briefing
          </Link>
          <button
            className="lg:hidden text-ink w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-current transition-transform ${mobileOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`block w-5 h-px bg-current transition-transform ${mobileOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-steel bg-elevated overflow-hidden"
          >
            <div className="px-7 py-4 flex flex-col gap-1 font-mono text-[12px] uppercase tracking-wide">
              {CAPABILITIES.map((c) => (
                <Link key={c.to} to={c.to} className="py-2.5 text-ink-dim border-b border-steel/60 flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 shrink-0" style={{ background: c.color }} />
                  {c.label}
                </Link>
              ))}
              <Link to={DEPLOYMENT.to} className="py-2.5 text-ink-dim border-b border-steel/60 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 shrink-0" style={{ background: DEPLOYMENT.color }} />
                {DEPLOYMENT.label}
              </Link>
              <Link to="/mission" className="py-2.5 text-ink-dim border-b border-steel/60">Mission</Link>
              <Link to="/evidence" className="py-2.5 text-ink-dim border-b border-steel/60">Evidence</Link>
              <Link to="/request-briefing" className="mt-3 text-center bg-amber text-void py-2.5">Request Briefing</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
