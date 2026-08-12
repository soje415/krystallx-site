import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Live orbital telemetry.
 *
 * This is REAL data — the International Space Station's actual position, from
 * a public tracking API, refreshed every few seconds. It is labelled as the
 * ISS deliberately: a HUD full of plausible-looking numbers that implied our
 * own constellation would be exactly the kind of fabricated claim this brand
 * refuses to make elsewhere. Real and attributed beats impressive and vague.
 *
 * Fails silently — a dead network must not leave a broken widget in the hero.
 */

interface Telemetry {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
}

const fmt = (n: number, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

const hemi = (v: number, pos: string, neg: string) => `${fmt(Math.abs(v), 3)}° ${v >= 0 ? pos : neg}`

export function OrbitTelemetry() {
  const [data, setData] = useState<Telemetry | null>(null)
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    let alive = true
    const controller = new AbortController()

    async function tick() {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544', {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(String(res.status))
        const json = (await res.json()) as Telemetry
        if (alive) {
          setData(json)
          setFailed(false)
        }
      } catch {
        // AbortError on unmount is expected; anything else just hides the strip.
        if (alive && !controller.signal.aborted) setFailed(true)
      }
    }

    tick()
    const id = setInterval(tick, 5000)
    return () => {
      alive = false
      controller.abort()
      clearInterval(id)
    }
  }, [])

  if (failed || !data) return null

  const fields: [string, string][] = [
    ['LAT', hemi(data.latitude, 'N', 'S')],
    ['LON', hemi(data.longitude, 'E', 'W')],
    ['ALT', `${fmt(data.altitude, 1)} km`],
    ['VEL', `${fmt(data.velocity, 0)} km/h`],
  ]

  return (
    <div className="border border-steel bg-elevated/60 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 px-4 py-2 border-b border-steel">
        <span
          className={`w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_6px_var(--color-green)] ${
            reduced ? '' : 'animate-pulse'
          }`}
          aria-hidden="true"
        />
        <span className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-green">Live orbital telemetry</span>
        <span className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-ink-faint ml-auto">
          ISS · 25544
        </span>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-steel">
        {fields.map(([label, value]) => (
          <div key={label} className="bg-elevated px-4 py-3">
            <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-faint mb-1">{label}</dt>
            <dd className="font-mono text-[12.5px] text-cyan tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="px-4 py-2 border-t border-steel font-mono text-[9px] tracking-wide uppercase text-ink-faint">
        Public tracking data · refreshed every 5s
      </p>
    </div>
  )
}
