// Native SVG globe with a real wireframe world map — no stock imagery, no
// external assets. Continents and graticule are drawn from an orthographic
// projection (the same math real maps use) so the landmasses wrap and foreshorten
// like a sphere instead of a flat sticker. Built in the site's own token palette.
import { useEffect, useMemo, useRef, useState } from 'react'

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

/* ── Orthographic projection ───────────────────────────────────────────────
 * A real spherical projection: a point at (lon, lat) maps to the globe's disc,
 * and points on the far hemisphere (z < 0) are hidden. Centred on West Africa
 * so the brand's home region is the face the globe opens on.
 */
type Pt = [number, number]

const R = 195
const CX = 250
const CY = 250
const LAT0 = 12
const D2R = Math.PI / 180

function makeProject(lon0: number) {
  const φ0 = LAT0 * D2R
  const cosφ0 = Math.cos(φ0)
  const sinφ0 = Math.sin(φ0)
  return (lon: number, lat: number) => {
    const dλ = (lon - lon0) * D2R
    const φ = lat * D2R
    const cosφ = Math.cos(φ)
    const sinφ = Math.sin(φ)
    const cosλ = Math.cos(dλ)
    const sinλ = Math.sin(dλ)
    const x = R * cosφ * sinλ
    const y = R * (cosφ0 * sinφ - sinφ0 * cosφ * cosλ)
    const z = sinφ0 * sinφ + cosφ0 * cosφ * cosλ
    return { x: CX + x, y: CY - y, z }
  }
}

/** Join projected points into a path, breaking the pen where the limb hides them. */
function pathString(pts: { x: number; y: number; z: number }[]): string {
  let d = ''
  let pen = false
  for (const q of pts) {
    if (q.z >= 0) {
      d += (pen ? 'L' : 'M') + q.x.toFixed(1) + ' ' + q.y.toFixed(1)
      pen = true
    } else {
      pen = false
    }
  }
  return d
}

/** A closed continent ring: sampled, and flagged solid when fully on the near side. */
function ring(lon0: number, pts: Pt[], step = 2) {
  const p = makeProject(lon0)
  const out: { x: number; y: number; z: number }[] = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / step))
    for (let j = 0; j < n; j++) {
      const t = j / n
      out.push(p(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    }
  }
  const solid = out.every((q) => q.z >= 0)
  return { d: pathString([...out, out[0]]), solid }
}

function meridian(lon0: number, lon: number, step = 3): string {
  const p = makeProject(lon0)
  const pts: { x: number; y: number; z: number }[] = []
  for (let lat = -90; lat <= 90; lat += step) pts.push(p(lon, lat))
  return pathString(pts)
}

function parallel(lon0: number, lat: number, step = 3): string {
  const p = makeProject(lon0)
  const pts: { x: number; y: number; z: number }[] = []
  for (let lon = -180; lon <= 180; lon += step) pts.push(p(lon, lat))
  return pathString(pts)
}

/* Stylised continent outlines — [lon, lat], coarse on purpose: this is a
 * wireframe, not a survey chart. Recognisable, not authoritative. */
const CONTINENTS: Pt[][] = [
  // Africa
  [[-17, 15], [-10, 25], [-5, 35], [10, 37], [25, 32], [32, 31], [37, 18], [43, 12], [51, 10], [46, 2], [42, -5], [40, -12], [37, -20], [35, -25], [28, -34], [20, -35], [15, -29], [12, -18], [13, -12], [12, -5], [9, 4], [0, 6], [-8, 5], [-14, 8], [-17, 15]],
  // Europe
  [[-9, 43], [-9, 37], [0, 38], [3, 41], [7, 44], [12, 44], [15, 40], [19, 40], [23, 37], [28, 41], [34, 42], [40, 42], [48, 42], [50, 46], [45, 52], [42, 55], [38, 57], [30, 60], [24, 64], [18, 69], [15, 71], [10, 66], [5, 62], [5, 58], [8, 55], [5, 53], [0, 51], [-2, 49], [-5, 48], [-9, 43]],
  // Asia
  [[28, 41], [34, 42], [40, 42], [48, 42], [50, 46], [55, 47], [50, 55], [55, 60], [50, 65], [55, 70], [65, 72], [75, 73], [90, 74], [105, 75], [120, 74], [135, 71], [150, 70], [165, 69], [175, 66], [180, 65], [172, 60], [160, 60], [150, 60], [140, 60], [130, 60], [122, 60], [118, 50], [112, 45], [105, 42], [100, 42], [95, 48], [90, 52], [80, 55], [70, 55], [60, 50], [55, 48], [50, 42], [48, 38], [45, 35], [42, 36], [38, 34], [36, 30], [33, 28], [30, 30], [28, 35], [28, 41]],
  // North America
  [[-168, 66], [-160, 70], [-150, 71], [-140, 70], [-130, 70], [-120, 69], [-110, 68], [-100, 68], [-90, 67], [-80, 64], [-70, 62], [-60, 60], [-65, 55], [-70, 50], [-75, 45], [-80, 42], [-83, 38], [-80, 32], [-82, 28], [-85, 25], [-90, 22], [-95, 22], [-97, 26], [-100, 30], [-105, 32], [-110, 35], [-115, 40], [-120, 42], [-125, 46], [-130, 50], [-135, 55], [-140, 58], [-150, 60], [-158, 62], [-168, 66]],
  // Greenland
  [[-45, 60], [-52, 60], [-58, 64], [-55, 68], [-50, 72], [-42, 75], [-35, 78], [-25, 80], [-20, 78], [-20, 74], [-25, 70], [-30, 66], [-35, 64], [-40, 61], [-45, 60]],
  // South America
  [[-80, 10], [-77, 8], [-72, 10], [-65, 10], [-60, 8], [-55, 5], [-50, 0], [-44, -3], [-38, -6], [-35, -10], [-36, -15], [-40, -22], [-48, -28], [-52, -33], [-58, -38], [-62, -42], [-65, -50], [-68, -54], [-72, -50], [-74, -45], [-73, -40], [-71, -35], [-70, -30], [-70, -25], [-72, -18], [-75, -12], [-77, -5], [-80, 0], [-80, 10]],
  // Australia
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [147, -12], [150, -18], [153, -25], [152, -30], [148, -35], [145, -38], [140, -38], [135, -35], [130, -32], [124, -33], [118, -34], [113, -30], [114, -26], [114, -22]],
]

const MERIDIANS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180]
const PARALLELS = [-60, -30, 0, 30, 60]

export function HeroGlobe() {
  const stars = useStars(70)
  const reduced = useReducedMotion()
  const [lon0, setLon0] = useState(8)
  const rafRef = useRef(0)

  // A slow rotation so the whole world comes into view. Static when motion is
  // reduced. ~2.2°/s — a full orbit in just under three minutes.
  useEffect(() => {
    if (reduced) return
    let last = performance.now()
    const step = (now: number) => {
      const dt = now - last
      last = now
      setLon0((v) => (v + dt * 0.0022) % 360)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reduced])

  const world = useMemo(() => {
    const continents = CONTINENTS.map((poly) => ring(lon0, poly))
    const meridians = MERIDIANS.map((lon) => meridian(lon0, lon))
    const parallels = PARALLELS.map((lat) => parallel(lon0, lat))
    return { continents, meridians, parallels }
  }, [lon0])

  return (
    <svg viewBox="0 0 500 460" className="w-full h-auto" role="img" aria-label="Wireframe globe with the world's continents and a satellite in orbit, on a starfield">
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
        {/* graticule — the light wireframe sphere around the world */}
        <g fill="none" stroke="var(--color-cyan)" strokeWidth={0.5} opacity={0.22}>
          {world.parallels.map((d, i) => <path key={`pa-${i}`} d={d} />)}
        </g>
        <g fill="none" stroke="var(--color-cyan)" strokeWidth={0.4} opacity={0.15}>
          {world.meridians.map((d, i) => <path key={`me-${i}`} d={d} />)}
        </g>

        {/* continents — filled only when the landmass is fully on the near side,
            otherwise the fill would chord across the back of the globe */}
        {world.continents.map((c, i) => (
          <path
            key={`co-${i}`}
            d={c.d}
            fill={c.solid ? 'var(--color-cyan)' : 'none'}
            fillOpacity={c.solid ? 0.07 : 0}
            stroke="var(--color-cyan)"
            strokeOpacity={0.6}
            strokeWidth={1}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* vertical uplink beams from rim */}
      {[95, 150, 350, 405].map((x, i) => (
        <line key={i} x1={x} y1={70 + i * 6} x2={x} y2={140} stroke="url(#beam-fade)" strokeWidth="1.4" opacity={reduced ? 0.4 : undefined}>
          {!reduced && <animate attributeName="opacity" values="0.15;0.7;0.15" dur={`${3 + i}s`} repeatCount="indefinite" />}
        </line>
      ))}

      {/* orbit ring — the wireframe around the globe */}
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
