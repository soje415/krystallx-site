export function HudBar() {
  return (
    <div className="border-b border-steel bg-void/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto px-7 h-11 flex items-center justify-between font-mono text-[10.5px] tracking-wider text-ink-dim uppercase">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_6px_var(--color-green)] animate-pulse" />
          System Nominal
        </span>
        <span className="hidden sm:inline text-ink-faint">Nigeria &amp; West Africa · Satellite Intelligence</span>
      </div>
    </div>
  )
}
