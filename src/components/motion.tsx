import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function Reveal({
  children, delay = 0, y = 18, className = '',
}: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  // Vestibular disorders are triggered by movement, not by opacity. Drop the
  // travel and keep a short fade so content still reads as arriving.
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduced ? 0.2 : 0.55, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StatCounter({
  value, suffix = '', decimals = 0, label,
}: { value: number; suffix?: string; decimals?: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { damping: 26, stiffness: 90 })
  const displayRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, value, motionVal])

  // With motion reduced, show the final figure rather than animating to it.
  useEffect(() => {
    if (reduced && displayRef.current) displayRef.current.textContent = value.toFixed(decimals)
  }, [reduced, value, decimals])

  useEffect(() => {
    if (reduced) return
    return spring.on('change', (v) => {
      if (displayRef.current) displayRef.current.textContent = v.toFixed(decimals)
    })
  }, [spring, decimals, reduced])

  return (
    <div ref={ref}>
      <div className="font-mono text-3xl md:text-4xl text-cyan tabular-nums">
        <span ref={displayRef}>0</span>{suffix}
      </div>
      <div className="font-mono text-[10px] tracking-widest uppercase text-ink-faint mt-1.5">{label}</div>
    </div>
  )
}

export function Eyebrow({ children, color = 'var(--color-amber)' }: { children: ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.22em] uppercase mb-5" style={{ color }}>
      <span className="w-6 h-px" style={{ background: color }} />
      {children}
    </div>
  )
}
