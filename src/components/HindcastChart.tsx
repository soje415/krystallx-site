import { useMemo, useState, useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  EVENT_2022,
  CONTROL_2021,
  WATCH_DATE,
  CONFIRMED_DATE,
  LEAD_DAYS,
  type EventPoint,
} from '../data/numan'

/*
 * The Numan hindcast, plotted from the stored record. See src/data/numan.ts for
 * provenance — nothing here generates or smooths a value.
 *
 * COLOUR. Identity and status are kept apart on purpose. The two series carry
 * identity: 2022 in brand cyan, 2021 as a deliberately recessive gray, dashed
 * and direct-labelled so the pair never rests on colour alone (validated on the
 * elevated surface — CVD ΔE 19.7, normal-vision ΔE 21.2). Amber, green and red
 * are reserved for detector status (WATCH, CONFIRMED, official warning) and are
 * never spent on a series; every status mark carries a text label too.
 */

const EVENT = '#2ba9e0'   // --color-cyan
const CONTROL = '#5c6a6e' // --color-ink-faint
const SURFACE = '#11191f' // --color-elevated

const W = 900
const H = 380
const M = { top: 34, right: 26, bottom: 46, left: 50 }
const PLOT_W = W - M.left - M.right
const PLOT_H = H - M.top - M.bottom

const T0 = Date.UTC(2022, 6, 1)
const T1 = Date.UTC(2022, 9, 31)
const Y_MAX = 80

const DAY = 86_400_000
const ms = (iso: string) => Date.parse(`${iso}T00:00:00Z`)
/** 2021 passes are aligned onto the 2022 axis by calendar date — same window, same reach. */
const alignedMs = (iso: string) => ms(`2022-${iso.slice(5)}`)

const x = (t: number) => M.left + ((t - T0) / (T1 - T0)) * PLOT_W
const y = (v: number) => M.top + PLOT_H - (v / Y_MAX) * PLOT_H

const path = (pts: { t: number; v: number }[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ')

const fmtDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

const MONTHS = [
  { t: Date.UTC(2022, 6, 1), label: 'Jul' },
  { t: Date.UTC(2022, 7, 1), label: 'Aug' },
  { t: Date.UTC(2022, 8, 1), label: 'Sep' },
  { t: Date.UTC(2022, 9, 1), label: 'Oct' },
]

const GRID = [0, 20, 40, 60, 80]

interface Marker {
  date: string
  color: string
  label: string
  detail: string
}

const MARKERS: Marker[] = [
  { date: WATCH_DATE, color: 'var(--color-amber)', label: 'WATCH', detail: 'both tests pass, one pass' },
  { date: CONFIRMED_DATE, color: 'var(--color-green)', label: 'CONFIRMED', detail: 'second consecutive pass, gate open' },
]

export function HindcastChart() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const clipId = useId()

  const event = useMemo(() => EVENT_2022.map((p) => ({ ...p, t: ms(p.d) })), [])
  const control = useMemo(() => CONTROL_2021.map((p) => ({ ...p, t: alignedMs(p.d) })), [])

  const eventPath = path(event.map((p) => ({ t: p.t, v: p.km2 })))
  const controlPath = path(control.map((p) => ({ t: p.t, v: p.km2 })))
  const pinPath = path(event.map((p) => ({ t: p.t, v: p.pin })))

  const confirmedT = ms(CONFIRMED_DATE)
  const warningT = confirmedT + LEAD_DAYS * DAY
  const peak = event.reduce((a, b) => (b.km2 > a.km2 ? b : a))
  const hovered: (EventPoint & { t: number }) | null = active === null ? null : event[active]

  return (
    <figure className="m-0">
      <div className="border border-steel bg-elevated">
        {/* Below ~720px a uniform scale-down makes the annotations unreadable, so the
            plot scrolls at a legible minimum rather than shrinking past use. */}
        <div className="overflow-x-auto">
        <div className="relative min-w-[720px]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          role="img"
          aria-label="Measured wetted area at the Benue river reach at Numan, July to October. The 2022 flood year rises sharply in early September and is flagged CONFIRMED on 9 September, four days before the official warning. The 2021 control year stays flat throughout."
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={M.left} y={M.top} width={PLOT_W} height={PLOT_H} />
            </clipPath>
          </defs>

          {/* Y grid — recessive */}
          {GRID.map((v) => (
            <g key={v}>
              <line
                x1={M.left}
                x2={W - M.right}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--color-steel)"
                strokeWidth={1}
                opacity={v === 0 ? 0.9 : 0.45}
              />
              <text
                x={M.left - 10}
                y={y(v) + 4}
                textAnchor="end"
                className="font-mono"
                fontSize={11}
                fill="var(--color-ink-faint)"
              >
                {v}
              </text>
            </g>
          ))}
          <text
            x={M.left - 10}
            y={M.top - 14}
            textAnchor="end"
            className="font-mono"
            fontSize={10}
            fill="var(--color-ink-faint)"
            letterSpacing="0.14em"
          >
            KM²
          </text>

          {/* Month ticks */}
          {MONTHS.map((m) => (
            <text
              key={m.label}
              x={x(m.t)}
              y={H - M.bottom + 22}
              textAnchor="start"
              className="font-mono"
              fontSize={11}
              fill="var(--color-ink-faint)"
              letterSpacing="0.1em"
            >
              {m.label}
            </text>
          ))}

          <g clipPath={`url(#${clipId})`}>
            {/* The lead: CONFIRMED to the official warning, four days later. */}
            <motion.rect
              x={x(confirmedT)}
              y={M.top}
              width={x(warningT) - x(confirmedT)}
              height={PLOT_H}
              fill="var(--color-green)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.11 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduced ? 0.2 : 0.7, delay: reduced ? 0 : 1.1 }}
            />

            {/* Seasonal test threshold: 1.4x the control-year median at the same day of year. */}
            <path d={pinPath} fill="none" stroke="var(--color-ink-faint)" strokeWidth={1.5} strokeDasharray="2 5" />

            {/* 2021 control — recessive, dashed, direct-labelled. */}
            <motion.path
              d={controlPath}
              fill="none"
              stroke={CONTROL}
              strokeWidth={2}
              strokeDasharray="7 5"
              strokeLinecap="round"
              initial={{ pathLength: reduced ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduced ? 0 : 1.1, ease: 'easeInOut' }}
            />

            {/* 2022 event */}
            <motion.path
              d={eventPath}
              fill="none"
              stroke={EVENT}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: reduced ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduced ? 0 : 1.3, ease: 'easeInOut' }}
            />

            {event.map((p) => (
              <circle key={p.d} cx={x(p.t)} cy={y(p.km2)} r={3.2} fill={EVENT} stroke={SURFACE} strokeWidth={2} />
            ))}

            {/* Status markers — always paired with a text label, never colour alone. */}
            {MARKERS.map((mk) => {
              const pt = event.find((p) => p.d === mk.date)
              if (!pt) return null
              return (
                <g key={mk.date}>
                  <line
                    x1={x(pt.t)}
                    x2={x(pt.t)}
                    y1={M.top}
                    y2={y(pt.km2) - 9}
                    stroke={mk.color}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    opacity={0.65}
                  />
                  <circle cx={x(pt.t)} cy={y(pt.km2)} r={5} fill={mk.color} stroke={SURFACE} strokeWidth={2} />
                </g>
              )
            })}

            {/* The official warning, four days after CONFIRMED. */}
            <line
              x1={x(warningT)}
              x2={x(warningT)}
              y1={M.top}
              y2={M.top + PLOT_H}
              stroke="var(--color-red)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.8}
            />

            {/* Crosshair */}
            {hovered && (
              <line
                x1={x(hovered.t)}
                x2={x(hovered.t)}
                y1={M.top}
                y2={M.top + PLOT_H}
                stroke="var(--color-ink-faint)"
                strokeWidth={1}
              />
            )}
          </g>

          {/* Status annotations — stacked in rows, because WATCH, CONFIRMED and the
              warning fall within nine days of each other on a four-month axis. */}
          <text
            x={x(ms(WATCH_DATE)) - 7}
            y={M.top + 12}
            textAnchor="end"
            className="font-mono"
            fontSize={10.5}
            fill="var(--color-amber)"
            letterSpacing="0.14em"
          >
            WATCH · {fmtDay(WATCH_DATE)}
          </text>
          <text
            x={x(confirmedT) + 8}
            y={M.top + 12}
            className="font-mono"
            fontSize={10.5}
            fill="var(--color-green)"
            letterSpacing="0.14em"
          >
            CONFIRMED · {fmtDay(CONFIRMED_DATE)}
          </text>
          <text
            x={x(warningT) + 8}
            y={M.top + 30}
            className="font-mono"
            fontSize={10.5}
            fill="var(--color-red)"
            letterSpacing="0.14em"
          >
            OFFICIAL WARNING · {LEAD_DAYS} DAYS LATER
          </text>

          {/* Peak value, called out to the left where the plot is empty. */}
          <text
            x={x(peak.t) - 11}
            y={y(peak.km2) + 4}
            textAnchor="end"
            className="font-mono"
            fontSize={11}
            fill={EVENT}
            letterSpacing="0.08em"
          >
            {peak.km2.toFixed(1)} km²
          </text>

          {/* Direct series labels — identity never rests on colour alone. */}
          <text
            x={x(ms('2022-07-11')) + 9}
            y={y(64.241) - 11}
            className="font-mono"
            fontSize={11}
            fill={EVENT}
            letterSpacing="0.08em"
          >
            2022
          </text>
          <text
            x={x(alignedMs('2021-08-09'))}
            y={y(21.244) + 26}
            textAnchor="middle"
            className="font-mono"
            fontSize={11}
            fill={CONTROL}
            letterSpacing="0.08em"
          >
            2021 control
          </text>

          {/* Hover targets — wider than the marks. */}
          {event.map((p, i) => {
            const half = PLOT_W / event.length / 2
            return (
              <rect
                key={`hit-${p.d}`}
                x={x(p.t) - half}
                y={M.top}
                width={half * 2}
                height={PLOT_H}
                fill="transparent"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              />
            )
          })}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute pointer-events-none border border-steel bg-void px-3 py-2 font-mono text-[11px] leading-relaxed whitespace-nowrap z-10"
            style={{
              left: `${(x(hovered.t) / W) * 100}%`,
              top: 12,
              transform: x(hovered.t) > W * 0.62 ? 'translateX(calc(-100% - 10px))' : 'translateX(10px)',
            }}
          >
            <div className="text-ink mb-1">{fmtDay(hovered.d)} 2022</div>
            <div className="text-ink-dim">
              wetted <span className="text-cyan">{hovered.km2.toFixed(2)} km²</span>
            </div>
            <div className="text-ink-faint">seasonal test {hovered.pin.toFixed(2)} km²</div>
          </div>
        )}
        </div>
        </div>

        {/* Legend — present for two series, as well as the direct labels. */}
        <div className="border-t border-steel px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10.5px] tracking-wider uppercase text-ink-faint">
          <span className="flex items-center gap-2">
            <svg width="18" height="8" aria-hidden="true">
              <line x1="0" y1="4" x2="18" y2="4" stroke={EVENT} strokeWidth="2" />
            </svg>
            2022 flood year
          </span>
          <span className="flex items-center gap-2">
            <svg width="18" height="8" aria-hidden="true">
              <line x1="0" y1="4" x2="18" y2="4" stroke={CONTROL} strokeWidth="2" strokeDasharray="5 4" />
            </svg>
            2021 control year
          </span>
          <span className="flex items-center gap-2">
            <svg width="18" height="8" aria-hidden="true">
              <line x1="0" y1="4" x2="18" y2="4" stroke="var(--color-ink-faint)" strokeWidth="1.5" strokeDasharray="2 4" />
            </svg>
            Seasonal test threshold
          </span>
        </div>
      </div>

      <figcaption className="text-[12.5px] text-ink-faint leading-relaxed mt-4">
        Wetted area per radar pass at the Benue reach at Numan (Gongola confluence, Adamawa), read from the platform's
        own stored measurements — the same records the live early-warning job writes. The detector is unchanged from
        the one running today. Two earlier single-pass WATCH events in the 2022 season (29 Jun, 16 Aug) did not
        escalate, because a second consecutive pass never confirmed them. Three June passes sit outside this window:
        the first two have no trailing history behind them, so the surge test is undefined and cannot be evaluated at
        all.
      </figcaption>

      <details className="mt-4 border border-steel bg-elevated">
        <summary className="px-5 py-3 font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-dim cursor-pointer hover:text-ink transition-colors">
          Read the underlying numbers
        </summary>
        <div className="px-5 pb-5 overflow-x-auto">
          <table className="w-full font-mono text-[11.5px] border-collapse">
            <caption className="sr-only">
              Measured wetted area in square kilometres per radar pass at Benue at Numan, with the seasonal test
              threshold for each 2022 pass and the aligned 2021 control measurement.
            </caption>
            <thead>
              <tr className="text-ink-faint text-left">
                <th scope="col" className="font-normal py-2 pr-4 border-b border-steel">Pass</th>
                <th scope="col" className="font-normal py-2 pr-4 border-b border-steel text-right">2022 km²</th>
                <th scope="col" className="font-normal py-2 pr-4 border-b border-steel text-right">Seasonal test</th>
                <th scope="col" className="font-normal py-2 border-b border-steel">Level</th>
              </tr>
            </thead>
            <tbody>
              {event.map((p) => {
                const mk = MARKERS.find((m) => m.date === p.d)
                return (
                  <tr key={p.d} className="text-ink-dim">
                    <th scope="row" className="font-normal py-1.5 pr-4 border-b border-steel/50 text-left">
                      {fmtDay(p.d)}
                    </th>
                    <td className="py-1.5 pr-4 border-b border-steel/50 text-right text-ink">{p.km2.toFixed(2)}</td>
                    <td className="py-1.5 pr-4 border-b border-steel/50 text-right">{p.pin.toFixed(2)}</td>
                    <td className="py-1.5 border-b border-steel/50" style={mk ? { color: mk.color } : undefined}>
                      {mk?.label ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
