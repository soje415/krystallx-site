import { PillarLayout } from '../components/PillarLayout'

export function Maritime() {
  return (
    <PillarLayout
      colorVar="var(--color-cyan)"
      colorClass="bg-cyan"
      eyebrow="Maritime Domain Awareness"
      title={<>Vessels don't stop moving when the <em className="text-cyan not-italic">clouds</em> roll in.</>}
      description="Real-time maritime tracking layered with radar detection that doesn't depend on daylight or clear skies — built for the Niger Delta's oil-servicing and coastal-security operators."
      stats={[
        { value: 3, label: 'Core detection layers' },
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
      ]}
      note="Built for pipeline right-of-way and Niger Delta coastal-security use cases first, generalizing to broader maritime domains by request."
    />
  )
}
