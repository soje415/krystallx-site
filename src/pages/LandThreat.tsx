import { PillarLayout } from '../components/PillarLayout'
import { SweepDiagram } from '../components/diagrams'

export function LandThreat() {
  return (
    <PillarLayout
      visual={<SweepDiagram />}
      visualHeading="A sweep tasks an area, and has to survive two filters to produce anything."
      visualLead="The pipeline is deliberately unglamorous. What matters is what it refuses to do: fail quietly when cloud rolls in, and let a detection out the far end before the exclusion doctrine has had its say."
      colorVar="var(--color-amber)"
      colorClass="bg-amber"
      eyebrow="Land & Threat Intelligence"
      title={<>From orbit to LGA, one <em className="text-amber not-italic">continuous</em> line of sight.</>}
      description="The satellite sweep pipeline that powers holdsite and mining-camp detection, feeding a national threat map and a live orbital tracking layer built on real orbital mechanics, not decoration."
      stats={[
        { value: 5, label: 'Detection capabilities' },
        { value: 2, label: 'Regions live today' },
      ]}
      capabilities={[
        {
          name: 'Satellite ISR Sweep',
          description: 'The core satellite sweep pipeline — multi-source optical and radar imagery fused, switching to radar-primary automatically when cloud cover exceeds usable thresholds.',
        },
        {
          name: 'Holdsite Detection',
          description: 'Encampment-signature detection methodology, hindcast-backed against known incidents, built with an explicit civilian-exclusion doctrine.',
        },
        {
          name: 'Mining Camp Detection',
          description: 'The same detection doctrine as holdsite identification, applied to illegal mining camps — shared signatures, same exclusion rules.',
        },
        {
          name: 'National Threat Map',
          description: 'LGA-level threat heatmap with drill-down detail — currently covering North + FCT, expanding region by region.',
        },
        {
          name: 'Orbital Command',
          description: 'A live satellite globe running real SGP4/SDP4 orbital propagation — the same math that runs actual satellite tracking, not a looping animation.',
        },
      ]}
      note="Coverage today: Northwest, Northeast, and FCT. Southern-region coverage is in build, not yet live — stated here plainly rather than implied."
    />
  )
}
