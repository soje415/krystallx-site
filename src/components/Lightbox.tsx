import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Fullscreen image lightbox. Locks body scroll while open, closes on Escape
 * and on backdrop click, and restores focus behaviour is left to the caller.
 */
export function Lightbox({
  open,
  onClose,
  children,
  label = 'Enlarged image',
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  label?: string
}) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-void/90 backdrop-blur-sm" aria-hidden="true" />

          <motion.div
            className="relative max-w-[min(1100px,94vw)] max-h-[92vh] w-full"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 sm:translate-x-1/3 sm:-translate-y-1/3 w-10 h-10 grid place-items-center bg-elevated border border-steel text-ink-dim hover:text-ink hover:border-ink-faint transition-colors font-mono text-lg"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
