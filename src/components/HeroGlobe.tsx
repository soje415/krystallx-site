// Native SVG satellite + data-flow globe — no stock imagery, no external
// assets. Built in the site's own token palette so it reads as this brand's
// visual language rather than a generic stock-photo sci-fi look.
import { useMemo, useState, useEffect } from 'react'

// SMIL <animate> elements ignore the CSS prefers-reduced-motion media query
// entirely, unlike CSS animations — so it's checked directly here and the
// animate children are simply omitted, leaving the static artwork in place.
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function useStars(count: number) {
  return useMemo(() => {
    const rand = seeded(42)
    return Array.from({ length: count }, () => ({
      cx: rand() * 500,
      cy: rand() * 220,
      r: 0.5 + rand() * 1.1,
      delay: rand() * 4,
      dur: 2.5 + rand() * 3,
    }))
  }, [count])
}

function useCityLights(count: number) {
  return useMemo(() => {
    const rand = seeded(7)
    return Array.from({ length: count }, () => {
      const angle = Math.PI * (0.08 + rand() * 0.84)
      const radius = 190 * Math.sqrt(rand())
      return {
        cx: 250 + Math.cos(angle) * radius,
        cy: 250 - Math.sin(angle) * radius * 0.62,
        r: 0.8 + rand() * 1.4,
        delay: rand() * 3,
      }
    }).filter((p) => p.cy > 165)
  }, [count])
}

const CONTOURS = [
  'M 70 210 Q 130 170 190 205 T 310 200 T 430 215',
  'M 55 250 Q 120 300 200 260 T 340 265 T 445 250',
  'M 90 300 Q 160 340 230 310 T 360 315 T 420 300',
  'M 130 350 Q 190 380 260 360 T 380 365',
  'M 60 165 Q 140 140 220 168 T 400 160',
]

export function HeroGlobe() {
  const stars = useStars(70)
  const lights = useCityLights(90)
  const reduced = useReducedMotion()

  return (
    <svg viewBox="0 0 500 460" className="w-full h-auto" role="img" aria-label="Illustration of a satellite in orbit above an illuminated globe with flowing data-network lines across its surface">
      <defs>
        <radialGradient id="globe-fill" cx="42%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#0e2a38" />
          <stop offset="55%" stopColor="#081722" />
          <stop offset="100%" stopColor="#050a0e" />
        </radialGradient>
        <radialGradient id="globe-rim" cx="50%" cy="15%" r="60%">
          <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="beam-fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id="globe-clip">
          <circle cx="250" cy="250" r="195" />
        </clipPath>
      </defs>

      {/* starfield */}
      <g>
        {stars.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="var(--color-ink)" opacity={reduced ? 0.5 : undefined}>
            {!reduced && <animate attributeName="opacity" values="0.15;0.9;0.15" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />}
          </circle>
        ))}
      </g>

      {/* globe body */}
      <circle cx="250" cy="250" r="195" fill="url(#globe-fill)" stroke="var(--color-steel)" strokeWidth="1" />
      <circle cx="250" cy="250" r="195" fill="url(#globe-rim)" />

      <g clipPath="url(#globe-clip)">
        {/* flowing contour lines */}
        {CONTOURS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--color-cyan)"
            strokeWidth="1"
            opacity="0.5"
            strokeDasharray="6 5"
          >
            {!reduced && <animate attributeName="stroke-dashoffset" from="0" to="-22" dur={`${5 + i}s`} repeatCount="indefinite" />}
          </path>
        ))}
        {/* city lights */}
        {lights.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="var(--color-cyan)" opacity={reduced ? 0.7 : undefined}>
            {!reduced && <animate attributeName="opacity" values="0.3;1;0.3" dur="3.2s" begin={`${p.delay}s`} repeatCount="indefinite" />}
          </circle>
        ))}
        {/* landmass hint */}
        <ellipse cx="205" cy="230" rx="70" ry="34" fill="var(--color-elevated)" opacity="0.5" />
        <ellipse cx="320" cy="270" rx="55" ry="26" fill="var(--color-elevated)" opacity="0.4" />
      </g>

      {/* vertical uplink beams from rim */}
      {[95, 150, 350, 405].map((x, i) => (
        <line key={i} x1={x} y1={70 + i * 6} x2={x} y2={140} stroke="url(#beam-fade)" strokeWidth="1.4" opacity={reduced ? 0.4 : undefined}>
          {!reduced && <animate attributeName="opacity" values="0.15;0.7;0.15" dur={`${3 + i}s`} repeatCount="indefinite" />}
        </line>
      ))}

      {/* orbit ring */}
      <ellipse cx="250" cy="250" rx="230" ry="230" fill="none" stroke="var(--color-steel)" strokeWidth="0.75" strokeDasharray="1 6" opacity="0.6" />

      {/* satellite */}
      <g transform="translate(330,58) rotate(18)">
        <line x1="0" y1="0" x2="0" y2="60" stroke="var(--color-cyan)" strokeWidth="1" opacity="0.35" strokeDasharray="2 4" />
        <rect x="-9" y="-7" width="18" height="14" rx="1.5" fill="var(--color-elevated)" stroke="var(--color-ink-dim)" strokeWidth="1" />
        <circle cx="0" cy="0" r="2" fill="var(--color-amber)">
          {!reduced && <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />}
        </circle>
        <rect x="-32" y="-3" width="20" height="6" fill="var(--color-cyan)" opacity="0.5" stroke="var(--color-ink-dim)" strokeWidth="0.75" />
        <rect x="12" y="-3" width="20" height="6" fill="var(--color-cyan)" opacity="0.5" stroke="var(--color-ink-dim)" strokeWidth="0.75" />
        <line x1="9" y1="-4" x2="9" y2="-16" stroke="var(--color-ink-dim)" strokeWidth="1" />
        <line x1="9" y1="-16" x2="17" y2="-22" stroke="var(--color-ink-dim)" strokeWidth="1" />
      </g>
    </svg>
  )
}
