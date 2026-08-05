import { PillarLayout } from '../components/PillarLayout'

export function Environmental() {
  return (
    <PillarLayout
      colorVar="var(--color-cyan)"
      colorClass="bg-cyan"
      eyebrow="Environmental Intelligence"
      title={<>Water, land, and air, watched <em className="text-cyan not-italic">before</em> they become emergencies.</>}
      description="Satellite-driven monitoring across flood, dam, mining, oil, and carbon — the flagship of this platform, and the pillar with the most concrete, verifiable proof behind it."
      stats={[
        { value: 10, label: 'Dams monitored' },
        { value: 4, suffix: 'D', label: 'Numan lead time' },
        { value: 5, label: 'Resource-intel domains' },
      ]}
      capabilities={[
        {
          name: 'Flood Early Warning',
          description: "NiHSA's official annual flood outlook fused against live satellite detection — shown side by side, never merged into a single number that hides which source said what.",
          proof: '✓ Numan 2022 — flagged 4 days ahead of the official warning',
        },
        {
          name: 'Dam Watch',
          description: 'Daily automated reservoir fill-level monitoring across 10 dams, with early-warning thresholds tuned per reservoir.',
        },
        {
          name: 'Resource Intel',
          description: 'Illegal mining detection, oil-slick tracking with drift and volume modeling, and flare/methane watch via VIIRS persistence and Sentinel-5P.',
        },
        {
          name: 'Carbon MRV',
          description: 'Activity-data-only land-use tracking for NDC 3.0 reporting — deliberately no fabricated carbon-credit numbers where the underlying data doesn\'t support them.',
        },
        {
          name: 'Transboundary Rivers',
          description: 'Early-warning arrays on the Mayo-Kébi and Sokoto-Rima systems, tracking flow anomalies before they cross into Nigerian territory.',
        },
      ]}
      note="Coverage note: resource-intel and transboundary arrays run continuously; dam and flood monitoring currently cover priority basins, expanding by request."
    />
  )
}
