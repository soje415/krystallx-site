import { useState, useRef, useEffect, type FormEvent } from 'react'
import { PageShell, Reveal, Eyebrow } from '../components/motion'
import { useSeo } from '../lib/seo'

interface Turn {
  role: 'user' | 'assistant'
  content: string
}

const COVERS = [
  'Which capabilities apply to your mandate — environmental, maritime, land, security, or state-police C4ISR',
  'Coverage today vs. what\'s in build, stated plainly',
  'A live walkthrough on a region you choose, not a canned demo',
  'What "warrant-gated" actually means for the Security & Identity pillar',
]

/** Must match MAX_TURNS in functions/api/intake.ts — the server rejects beyond it. */
const MAX_TURNS = 24

const OPENING =
  "I handle briefing requests here. Tell me what you're responsible for and what problem brought you — I'll work out which capabilities are relevant and set up the right conversation.\n\nIf you'd rather skip ahead: your name, organisation, and what you need to monitor gets us most of the way there."

export function RequestBriefing() {
  useSeo(
    'Request a Briefing — KrystallX Shield',
    'No self-serve signup. Request a qualified briefing with the KrystallX Shield team — coverage, capabilities and Security & Identity are discussed in person, not in a checkout.',
  )
  const [turns, setTurns] = useState<Turn[]>([{ role: 'assistant', content: OPENING }])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ full_name: string; organisation: string; email: string } | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  // The endpoint caps a conversation at MAX_TURNS messages and rejects the next
  // one outright. Counting the same way here lets us warn before that happens
  // instead of letting a long, good conversation end on an error.
  const sent = turns.length - 1 // the opening line is UI copy, never sent
  const remaining = MAX_TURNS - sent
  const atCap = remaining <= 0

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, busy])

  async function send(e: FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || busy || done || atCap) return

    const next: Turn[] = [...turns, { role: 'user', content: text }]
    setTurns(next)
    setDraft('')
    setBusy(true)
    setError(null)

    // A failed send must not eat what they typed. Put the turn back in the box
    // so Send retries it, rather than leaving them to retype from memory.
    const restore = (message: string) => {
      setTurns(turns)
      setDraft(text)
      setError(message)
    }

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // The opening line is UI copy, not model output — don't replay it as history.
        body: JSON.stringify({ messages: next.slice(1).map((t) => ({ role: t.role, content: t.content })) }),
      })
      const data = await res.json()

      if (!res.ok) {
        restore(data.error ?? 'Something went wrong.')
        return
      }
      if (data.reply) setTurns((t) => [...t, { role: 'assistant', content: data.reply }])
      if (data.submitted) setDone(data.summary)
    } catch {
      restore('Could not reach the intake service.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageShell>
      <section className="border-b border-steel relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-7 py-24 md:py-28 relative">
          <Reveal>
            <Eyebrow>Request a Briefing</Eyebrow>
            <h1 className="font-display font-bold text-[clamp(32px,5.5vw,54px)] leading-[1.04] max-w-3xl mb-6 text-balance">
              No self-serve signup. This is a relationship, not a checkout.
            </h1>
            <p className="text-ink-dim text-[16px] md:text-[17px] max-w-2xl leading-relaxed">
              We work through qualified briefings with state and federal agencies, not open sign-up — especially for the
              Security &amp; Identity pillar, which is never demonstrated outside a verified government relationship.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-7 py-20">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-4">A briefing covers</div>
            <ul className="flex flex-col gap-4 mb-10">
              {COVERS.map((c) => (
                <li key={c} className="flex gap-3 text-[14px] text-ink-dim leading-relaxed">
                  <span className="w-1.5 h-1.5 mt-2 shrink-0 bg-amber" />
                  {c}
                </li>
              ))}
            </ul>

            <div className="border border-steel bg-elevated p-6">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-3">Prefer email</div>
              <a
                href="mailto:hello@krystallxsheild.org?subject=Briefing%20Request"
                className="font-display font-semibold text-[17px] text-amber hover:text-amber-glow transition-colors"
              >
                hello@krystallxsheild.org
              </a>
              <p className="text-[12.5px] text-ink-faint leading-relaxed mt-4 pt-4 border-t border-steel">
                For Security &amp; Identity: briefings are limited to verified government and law-enforcement entities.
                Expect a verification step before any technical discussion.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {/* Fixed 560px overflows a short phone viewport; scale with the screen
                but keep enough room that the log doesn't become a two-line slot. */}
            <div className="border border-steel bg-elevated flex flex-col h-[clamp(400px,62vh,560px)]">
              <div className="border-b border-steel px-5 py-3 flex items-center gap-2.5 shrink-0">
                <span className="w-1.5 h-1.5 bg-green" aria-hidden="true" />
                <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-dim">
                  Briefing Intake
                </span>
              </div>

              <div
                ref={logRef}
                className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5"
                role="log"
                aria-live="polite"
                aria-label="Briefing intake conversation"
              >
                {turns.map((t, i) => (
                  <div key={i} className={t.role === 'user' ? 'pl-8' : ''}>
                    <div
                      className={`font-mono text-[9.5px] tracking-[0.18em] uppercase mb-1.5 ${
                        t.role === 'user' ? 'text-ink-faint' : 'text-amber'
                      }`}
                    >
                      {t.role === 'user' ? 'You' : 'KrystallX'}
                    </div>
                    <p className="text-[14px] leading-relaxed text-ink-dim whitespace-pre-wrap">{t.content}</p>
                  </div>
                ))}

                {busy && (
                  <p className="font-mono text-[11px] text-ink-faint tracking-wide">▍thinking…</p>
                )}

                {done && (
                  <div className="border border-green/40 bg-green/5 p-4 mt-1">
                    <div className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-green mb-2">
                      Request received
                    </div>
                    <p className="text-[13.5px] text-ink-dim leading-relaxed">
                      Logged for <span className="text-ink">{done.full_name}</span> at{' '}
                      <span className="text-ink">{done.organisation}</span>. A member of the team reviews every request
                      personally and will follow up at <span className="text-ink">{done.email}</span> to arrange the
                      briefing. Access to the platform is granted by a person, after verification — never automatically.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="border border-red/40 bg-red/5 p-4" role="alert">
                    <p className="text-[13.5px] text-ink-dim leading-relaxed">
                      {error} Your message is back in the box — press Send to try again, or{' '}
                      <a href="mailto:hello@krystallxsheild.org" className="text-amber hover:text-amber-glow">
                        email us directly
                      </a>{' '}
                      and we'll pick it up from there.
                    </p>
                  </div>
                )}

                {!done && atCap && (
                  <div className="border border-amber/40 bg-amber/5 p-4" role="status">
                    <p className="text-[13.5px] text-ink-dim leading-relaxed">
                      This conversation has run as long as it can here.{' '}
                      <a href="mailto:hello@krystallxsheild.org?subject=Briefing%20Request" className="text-amber hover:text-amber-glow">
                        Email us
                      </a>{' '}
                      and we'll carry on from what you've written.
                    </p>
                  </div>
                )}
              </div>

              {!done && !atCap && (
                <form onSubmit={send} className="border-t border-steel p-3 flex gap-2 shrink-0">
                  <label htmlFor="intake-input" className="sr-only">
                    Your message
                  </label>
                  <input
                    id="intake-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    disabled={busy}
                    maxLength={2000}
                    autoComplete="off"
                    placeholder="Type your reply…"
                    className="flex-1 bg-void border border-steel px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-amber transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={busy || !draft.trim()}
                    className="font-mono text-[11px] tracking-wider uppercase bg-amber text-void px-5 hover:bg-amber-glow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>

            <p className="text-[11.5px] text-ink-faint leading-relaxed mt-3">
              This assistant qualifies briefing requests. It holds no operational data and cannot grant platform access.
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
