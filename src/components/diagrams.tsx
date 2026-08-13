import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/*
 * Pillar diagrams. Each one draws the actual method behind its pillar — how a
 * lead is produced, and what has to be true before it is. They are arguments,
 * not decoration: a reader who disagrees with the diagram disagrees with the
 * system. Nothing here names a satellite, a vendor, or an internal system.
 */

const SURFACE = '#11191f'

/** Shared frame: scrolls rather than shrinking below a legible width. */
function DiagramFrame({
  children,
  caption,
  viewBox,
  label,
  minWidth = 760,
}: {
  children: ReactNode
  caption: string
  viewBox: string
  label: string
  minWidth?: number
}) {
  return (
    <figure className="m-0">
      <div className="border border-steel bg-elevated overflow-x-auto">
        <div style={{ minWidth }}>
          <svg viewBox={viewBox} className="w-full h-auto block" role="img" aria-label={label}>
            {children}
          </svg>
        </div>
      </div>
      <figcaption className="text-[12.5px] text-ink-faint leading-relaxed mt-4 max-w-3xl">{caption}</figcaption>
    </figure>
  )
}

/** A drawn connector with its own arrowhead — no marker defs to keep in sync. */
function Arrow({
  from,
  to,
  color = 'var(--color-steel)',
  dashed = false,
}: {
  from: [number, number]
  to: [number, number]
  color?: string
  dashed?: boolean
}) {
  const [x1, y1] = from
  const [x2, y2] = to
  const a = Math.atan2(y2 - y1, x2 - x1)
  const h = 6
  const back = 9
  const tipX = x2
  const tipY = y2
  const bx = tipX - back * Math.cos(a)
  const by = tipY - back * Math.sin(a)
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      <polygon
        points={`${tipX},${tipY} ${bx - h * Math.sin(a) * -1},${by + h * Math.cos(a) * -1} ${bx + h * Math.sin(a) * -1},${by - h * Math.cos(a) * -1}`}
        fill={color}
      />
    </g>
  )
}

function Box({
  x,
  y,
  w,
  h,
  accent,
  children,
}: {
  x: number
  y: number
  w: number
  h: number
  accent?: string
  children?: ReactNode
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={SURFACE} stroke="var(--color-steel)" strokeWidth={1} />
      {accent && <rect x={x} y={y} width={w} height={2.5} fill={accent} />}
      {children}
    </g>
  )
}

const Label = ({
  x,
  y,
  children,
  fill = 'var(--color-ink)',
  size = 12.5,
  anchor = 'middle' as const,
}: {
  x: number
  y: number
  children: ReactNode
  fill?: string
  size?: number
  anchor?: 'start' | 'middle' | 'end'
}) => (
  <text x={x} y={y} textAnchor={anchor} className="font-mono" fontSize={size} fill={fill} letterSpacing="0.06em">
    {children}
  </text>
)

const Tag = ({ x, y, children, fill }: { x: number; y: number; children: ReactNode; fill: string }) => (
  <text x={x} y={y} textAnchor="middle" className="font-mono" fontSize={10.5} fill={fill} letterSpacing="0.16em">
    {children}
  </text>
)

/* ── ENVIRONMENTAL — the Benue cascade countdown ──────────────────────────
 * Node order and the day windows are the reach registry's own values.
 */
const CASCADE = [
  { name: 'Lagdo pool', sub: 'SOURCE', eta: 'CONFIRM' },
  { name: 'Garoua', sub: 'combined channel', eta: 'T+0–1D' },
  { name: 'Yola / Jimeta', sub: 'Adamawa', eta: 'T+3–5D' },
  { name: 'Numan', sub: 'Gongola confluence', eta: 'T+5–7D' },
  { name: 'Makurdi', sub: 'Benue State', eta: 'T+10–14D' },
]

export function CascadeDiagram() {
  const reduced = useReducedMotion()
  const BW = 150
  const GAP = 30
  const bx = (i: number) => 15 + i * (BW + GAP)
  const cy = 118

  return (
    <DiagramFrame
      viewBox="0 0 900 200"
      minWidth={820}
      label="The Benue cascade: a confirmation at the upstream reservoir starts a countdown that reaches Garoua within a day, Yola in three to five days, Numan in five to seven, and Makurdi in ten to fourteen."
      caption="A confirmation is only ever stamped at the source. Downstream reaches are never given a date — they are given a time-to-arrival window, because a flood wave travels at the river's pace, not the forecast's. The windows above are the operating values on the Benue arm."
    >
      <text x={15} y={26} className="font-mono" fontSize={10.5} fill="var(--color-ink-faint)" letterSpacing="0.2em">
        SOURCE CONFIRMED
      </text>
      <text x={885} y={26} textAnchor="end" className="font-mono" fontSize={10.5} fill="var(--color-ink-faint)" letterSpacing="0.2em">
        DOWNSTREAM ARRIVAL
      </text>

      {CASCADE.map((n, i) => (
        <g key={n.name}>
          {i > 0 && <Arrow from={[bx(i) - GAP + 6, cy]} to={[bx(i) - 5, cy]} color="var(--color-cyan)" />}
          <motion.g
            initial={{ opacity: reduced ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: reduced ? 0.2 : 0.45, delay: reduced ? 0 : i * 0.12 }}
          >
            <Box x={bx(i)} y={84} w={BW} h={68} accent={i === 0 ? 'var(--color-green)' : 'var(--color-cyan)'} />
            <Label x={bx(i) + BW / 2} y={112}>
              {n.name}
            </Label>
            <text
              x={bx(i) + BW / 2}
              y={130}
              textAnchor="middle"
              className="font-mono"
              fontSize={10}
              fill="var(--color-ink-faint)"
              letterSpacing="0.08em"
            >
              {n.sub}
            </text>
            <Tag x={bx(i) + BW / 2} y={70} fill={i === 0 ? 'var(--color-green)' : 'var(--color-cyan)'}>
              {n.eta}
            </Tag>
          </motion.g>
        </g>
      ))}
    </DiagramFrame>
  )
}

/* ── MARITIME — three signals, one lead ──────────────────────────────────── */
const SIGNALS = [
  'Dark vessel at a pipeline crossing',
  'Oil slick inside the right-of-way',
  'New persistent thermal hotspot on the line',
]

export function FusionDiagram() {
  const reduced = useReducedMotion()
  const IW = 336
  const rowY = [30, 108, 186]

  return (
    <DiagramFrame
      viewBox="0 0 900 270"
      minWidth={800}
      label="Three independent signals — a dark vessel at a pipeline crossing, an oil slick inside the right-of-way, and a new persistent thermal hotspot on the line — must converge before anything is reported as a lead. Any one signal alone is not a lead."
      caption="No single layer here claims to prove theft, and none is reported as if it did. A dark vessel might be a transponder fault; a slick might be a spill; a hotspot might be a flare. The convergence of all three at the same place is what makes a lead worth acting on — and what keeps an operator from being sent out on noise."
    >
      {SIGNALS.map((s, i) => (
        <motion.g
          key={s}
          initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: reduced ? 0.2 : 0.45, delay: reduced ? 0 : i * 0.12 }}
        >
          <Box x={18} y={rowY[i]} w={IW} h={58} accent="var(--color-cyan)" />
          <text
            x={18 + IW / 2}
            y={rowY[i] + 35}
            textAnchor="middle"
            className="font-mono"
            fontSize={11.5}
            fill="var(--color-ink)"
            letterSpacing="0.04em"
          >
            {s}
          </text>
        </motion.g>
      ))}

      {/* Converge */}
      {rowY.map((ry) => (
        <g key={ry}>
          <line x1={354} y1={ry + 29} x2={392} y2={ry + 29} stroke="var(--color-cyan)" strokeWidth={1.5} />
          <line x1={392} y1={ry + 29} x2={392} y2={137} stroke="var(--color-cyan)" strokeWidth={1.5} />
        </g>
      ))}
      <Arrow from={[392, 137]} to={[434, 137]} color="var(--color-cyan)" />

      <Box x={440} y={104} w={160} h={66} accent="var(--color-amber)" />
      <Label x={520} y={132} size={12}>
        ALL THREE
      </Label>
      <Label x={520} y={150} fill="var(--color-ink-faint)" size={10.5}>
        AT THE SAME PLACE
      </Label>

      <Arrow from={[606, 137]} to={[664, 137]} color="var(--color-amber)" />

      <Box x={670} y={104} w={212} h={66} accent="var(--color-green)" />
      <Label x={776} y={132} size={12}>
        ONE ACTIONABLE LEAD
      </Label>
      <Label x={776} y={150} fill="var(--color-ink-faint)" size={10.5}>
        WITH ALL THREE SHOWN
      </Label>

      <text x={440} y={196} className="font-mono" fontSize={10.5} fill="var(--color-red)" letterSpacing="0.14em">
        ONE SIGNAL ALONE → NOT REPORTED AS A LEAD
      </text>
      <text x={440} y={216} className="font-mono" fontSize={10.5} fill="var(--color-ink-faint)" letterSpacing="0.1em">
        TWO OF THREE → LOGGED, NOT ESCALATED
      </text>
    </DiagramFrame>
  )
}

/* ── LAND & THREAT — the sweep pipeline ──────────────────────────────────── */
const STAGES = [
  { name: 'AOI tasked', sub: 'area, not a person' },
  { name: 'Imagery', sub: 'optical, or radar' },
  { name: 'Signature', sub: 'detection pass' },
  { name: 'Exclusion', sub: 'civilian doctrine' },
  { name: 'Lead', sub: 'with its evidence' },
]

export function SweepDiagram() {
  const reduced = useReducedMotion()
  const BW = 150
  const GAP = 30
  const bx = (i: number) => 15 + i * (BW + GAP)
  const cy = 92

  return (
    <DiagramFrame
      viewBox="0 0 900 240"
      minWidth={820}
      label="The sweep pipeline: an area of interest is tasked, imaged with optical or radar depending on cloud, passed through signature detection, then through a civilian exclusion filter, before anything becomes a lead."
      caption="Two things in this chain are the point. The imagery stage switches to radar automatically when cloud exceeds a usable threshold, so a sweep does not silently fail on an overcast day and report nothing found. And the exclusion filter sits inside the pipeline, before a lead exists — a detection that cannot clear it never becomes one."
    >
      {STAGES.map((s, i) => (
        <g key={s.name}>
          {i > 0 && <Arrow from={[bx(i) - GAP + 6, cy]} to={[bx(i) - 5, cy]} color="var(--color-amber)" />}
          <motion.g
            initial={{ opacity: reduced ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: reduced ? 0.2 : 0.45, delay: reduced ? 0 : i * 0.1 }}
          >
            <Box
              x={bx(i)}
              y={58}
              w={BW}
              h={68}
              accent={i === 3 ? 'var(--color-red)' : i === 4 ? 'var(--color-green)' : 'var(--color-amber)'}
            />
            <Label x={bx(i) + BW / 2} y={86}>
              {s.name}
            </Label>
            <text
              x={bx(i) + BW / 2}
              y={104}
              textAnchor="middle"
              className="font-mono"
              fontSize={10}
              fill="var(--color-ink-faint)"
              letterSpacing="0.08em"
            >
              {s.sub}
            </text>
          </motion.g>
        </g>
      ))}

      {/* The automatic fallback, called out under the imagery stage. */}
      <line x1={bx(1) + BW / 2} y1={126} x2={bx(1) + BW / 2} y2={152} stroke="var(--color-steel)" strokeWidth={1} />
      <Box x={bx(1) - 26} y={152} w={BW + 52} h={54} />
      <text
        x={bx(1) + BW / 2}
        y={173}
        textAnchor="middle"
        className="font-mono"
        fontSize={10.5}
        fill="var(--color-cyan)"
        letterSpacing="0.1em"
      >
        CLOUD OVER THRESHOLD
      </text>
      <text
        x={bx(1) + BW / 2}
        y={191}
        textAnchor="middle"
        className="font-mono"
        fontSize={10.5}
        fill="var(--color-ink-dim)"
        letterSpacing="0.1em"
      >
        → RADAR PRIMARY
      </text>

      {/* The exclusion filter's reject path. */}
      <line x1={bx(3) + BW / 2} y1={126} x2={bx(3) + BW / 2} y2={158} stroke="var(--color-red)" strokeWidth={1} strokeDasharray="4 4" />
      <text
        x={bx(3) + BW / 2}
        y={176}
        textAnchor="middle"
        className="font-mono"
        fontSize={10.5}
        fill="var(--color-red)"
        letterSpacing="0.1em"
      >
        DROPPED HERE
      </text>
      <text
        x={bx(3) + BW / 2}
        y={193}
        textAnchor="middle"
        className="font-mono"
        fontSize={10}
        fill="var(--color-ink-faint)"
        letterSpacing="0.08em"
      >
        never becomes a lead
      </text>
    </DiagramFrame>
  )
}

/* ── SECURITY & IDENTITY — the warrant gate ──────────────────────────────── */
export function WarrantGateDiagram() {
  const reduced = useReducedMotion()

  return (
    <DiagramFrame
      viewBox="0 0 900 240"
      minWidth={800}
      label="Every identity lookup passes through a warrant gate. With a warrant, the lookup resolves and writes an immutable audit row recording who, when, under which warrant and for which case. Without one, there is no path through — the request is refused structurally."
      caption="The gate sits in the path, not beside it. There is no route to a lookup that goes around the warrant check, which is why this is a structural guarantee rather than a policy we promise to follow. Every lookup that does happen leaves a record that cannot be edited after the fact — including ours."
    >
      <motion.g
        initial={{ opacity: reduced ? 1 : 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: reduced ? 0.2 : 0.5 }}
      >
        <Box x={15} y={90} w={180} h={62} accent="var(--color-ink-faint)" />
        <Label x={105} y={118} size={12}>
          LOOKUP REQUESTED
        </Label>
        <Label x={105} y={136} fill="var(--color-ink-faint)" size={10}>
          by an authorised agency
        </Label>
      </motion.g>

      <Arrow from={[201, 121]} to={[246, 121]} color="var(--color-steel)" />

      {/* The gate */}
      <rect x={252} y={26} width={118} height={190} fill={SURFACE} stroke="var(--color-red)" strokeWidth={1.5} strokeDasharray="5 4" />
      <text
        transform="translate(311 121) rotate(-90)"
        textAnchor="middle"
        className="font-mono"
        fontSize={12.5}
        fill="var(--color-red)"
        letterSpacing="0.2em"
      >
        WARRANT GATE
      </text>

      {/* Permitted path */}
      <Arrow from={[376, 78]} to={[434, 78]} color="var(--color-green)" />
      <text x={440} y={38} className="font-mono" fontSize={10} fill="var(--color-green)" letterSpacing="0.14em">
        WITH A WARRANT
      </text>
      <Box x={440} y={50} w={186} h={58} accent="var(--color-green)" />
      <Label x={533} y={76} size={12}>
        IDENTITY RESOLVED
      </Label>
      <Label x={533} y={94} fill="var(--color-ink-faint)" size={10}>
        scoped to the case
      </Label>

      <Arrow from={[632, 78]} to={[684, 78]} color="var(--color-green)" />
      <Box x={690} y={50} w={195} h={58} accent="var(--color-green)" />
      <Label x={787} y={72} size={11.5}>
        IMMUTABLE AUDIT ROW
      </Label>
      <Label x={787} y={92} fill="var(--color-ink-faint)" size={10}>
        who · when · warrant · case
      </Label>

      {/* Refused path — stops at the gate */}
      <line x1={376} y1={172} x2={424} y2={172} stroke="var(--color-red)" strokeWidth={1.5} strokeDasharray="4 4" />
      <g stroke="var(--color-red)" strokeWidth={2}>
        <line x1={432} y1={164} x2={448} y2={180} />
        <line x1={448} y1={164} x2={432} y2={180} />
      </g>
      <text x={378} y={156} className="font-mono" fontSize={10} fill="var(--color-red)" letterSpacing="0.14em">
        WITHOUT ONE
      </text>
      <text x={464} y={169} className="font-mono" fontSize={11.5} fill="var(--color-ink)" letterSpacing="0.06em">
        NO PATH EXISTS
      </text>
      <text x={464} y={187} className="font-mono" fontSize={10} fill="var(--color-ink-faint)" letterSpacing="0.08em">
        refused structurally, not by convention
      </text>
    </DiagramFrame>
  )
}
