import { PillarLayout } from '../components/PillarLayout'
import { WarrantGateDiagram } from '../components/diagrams'
import { useSeo } from '../lib/seo'

export function Security() {
  useSeo(
    'Security & Identity — KrystallX Shield',
    'Warrant-gated identity verification and signals intelligence for authorized law enforcement, under full judicial audit trail.',
  )
  return (
    <PillarLayout
      visual={<WarrantGateDiagram />}
      visualHeading="The only thing we will show you here is the gate."
      visualLead="We publish no target types, no coverage, no operational detail on this pillar. What we will publish is the shape of the control around it, because a claim of judicial accountability is worth nothing unless you can see where it sits in the path."
      colorVar="var(--color-red)"
      colorClass="bg-red"
      eyebrow="Security & Identity"
      title={<>Every lookup traces to a <em className="text-red not-italic">warrant</em>. Every warrant traces to a case.</>}
      description="Identity verification and signals intelligence for authorized law enforcement — built around judicial accountability first, capability second. We describe what this does, not how it works or who it's watching."
      stats={[]}
      capabilities={[
        {
          name: 'Identity Verification',
          description: 'Court-order-gated identity resolution for state security agencies, with an immutable audit trail on every lookup — who, when, under which warrant, for which case. No lookup happens outside that gate, structurally, not by convention.',
        },
        {
          name: 'Signals Intelligence',
          description: 'Capability exists. We do not publish target types, coverage areas, or operational detail on this page, on principle, regardless of audience.',
        },
      ]}
      note="This pillar is available only through a qualified briefing with a verified government or law-enforcement entity. Nothing case-specific — real or illustrative — is ever shown publicly, including on this page."
    />
  )
}
