import { PillarLayout } from '../components/PillarLayout'
import { FusionDiagram } from '../components/diagrams'
import { useSeo } from '../lib/seo'

export function Maritime() {
  useSeo(
    'Maritime Domain Awareness — KrystallX Shield',
    'Vessel tracking, dark-vessel and illegal bunkering detection, SAR and flare/methane watch for the Niger Delta — through cloud and darkness.',
  )
  return (
    <PillarLayout
      visual={<FusionDiagram />}
      visualHeading="Three signals have to agree before anyone gets sent out."
      visualLead="Bunkering detection is where a platform is most tempted to overclaim, because each individual signal looks damning on its own. We report the convergence instead — and say plainly what a partial match is."
      colorVar="var(--color-cyan)"
      colorClass="bg-cyan"
      eyebrow="Maritime Domain Awareness"
      title={<>Vessels don't stop moving when the <em className="text-cyan not-italic">clouds</em> roll in.</>}
      description="Real-time maritime tracking layered with radar, thermal, and slick detection that doesn't depend on daylight or clear skies — built for the Niger Delta's oil-servicing and coastal-security operators, where the vessel you can't see is the one moving stolen product."
      stats={[
        { value: 5, label: 'Core detection layers' },
        { value: 3, label: 'Signals fused for bunkering' },
        { value: 24, suffix: '/7', label: 'Sweep cadence' },
      ]}
      capabilities={[
        {
          name: 'Vessel Tracking',
          description: 'Real-time domain awareness across monitored waters, correlated against AIS self-reporting.',
        },
        {
          name: 'Dark Vessel Detection',
          description: 'A pipeline-crossing CFAR sweep correlated against AIS data to surface vessels that have gone dark near sensitive infrastructure — not a generic anomaly score, a specific crossing-event trigger.',
        },
        {
          name: 'SAR Detection',
          description: 'Synthetic-aperture radar bright-target detection, independent of cloud cover or time of day — where optical monitoring alone goes blind.',
        },
        {
          name: 'Illegal Bunkering Detection',
          description: 'Three independent signals fused into a single lead: a dark vessel at a pipeline crossing, an oil slick within the pipeline right-of-way, and a new persistent thermal hotspot on the line. No single layer claims to prove theft — the convergence of all three is what makes a lead worth acting on.',
        },
        {
          name: 'Flare & Methane Watch',
          description: 'Persistent thermal and atmospheric monitoring across the pipeline network. A new hotspot where none burned before is a tap or an illegal refining camp — the same signal that serves emissions reporting also reads as evidence of product theft.',
        },
      ]}
      note="Honest limits: radar revisit is a periodic sample, not continuous surveillance — an individual bunkering event only registers if it coincides with a satellite pass. What this catches reliably is a recurring pattern at the same crossing over time. Built for pipeline right-of-way and Niger Delta coastal-security use cases first, generalizing to broader maritime domains by request."
    />
  )
}
