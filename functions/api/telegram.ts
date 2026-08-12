/**
 * Telegram webhook — approval buttons and bot commands.
 *
 * SECURITY: this endpoint can cause a public post, so it is locked down three
 * ways. (1) Telegram's secret-token header must match, proving the call came
 * from Telegram and not from anyone who guessed the URL. (2) The chat id must
 * be the owner's — a bot is reachable by any Telegram user, so without this
 * check a stranger who found the bot could approve posts. (3) The post content
 * is re-fetched from the repo by slug; nothing that round-trips through
 * callback_data is trusted as content.
 */

interface Env {
  TELEGRAM_BOT_TOKEN: string
  TELEGRAM_SECRET_TOKEN: string
  TELEGRAM_OWNER_CHAT_ID: string
  GITHUB_TOKEN?: string
  GITHUB_REPO?: string // "soje415/krystallx-site"
  META_ACCESS_TOKEN?: string
  META_PAGE_ID?: string
  META_IG_USER_ID?: string
  CARD_BASE_URL?: string
}

const GRAPH = 'https://graph.facebook.com/v21.0'

async function tg(env: Env, method: string, body: unknown) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

/** Read a file from the (private) repo through the contents API. */
async function repoFile(env: Env, path: string): Promise<ArrayBuffer | null> {
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) return null
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`, {
    headers: {
      authorization: `token ${env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github.raw',
      'user-agent': 'krystallx-social',
    },
  })
  if (!res.ok) return null
  return res.arrayBuffer()
}

async function publishToMeta(env: Env, slug: string, caption: string) {
  const token = env.META_ACCESS_TOKEN
  const pageId = env.META_PAGE_ID
  if (!token || !pageId) return { ok: false, detail: 'Meta credentials not configured' }

  const results: string[] = []

  // Facebook — upload the bytes directly.
  const card = await repoFile(env, `public/cards/${slug}.png`)
  if (card) {
    const form = new FormData()
    form.set('message', caption)
    form.set('access_token', token)
    form.set('source', new Blob([card], { type: 'image/png' }), 'card.png')
    const r = await fetch(`${GRAPH}/${pageId}/photos`, { method: 'POST', body: form })
    const j = (await r.json()) as { error?: { message: string } }
    results.push(j.error ? `facebook failed: ${j.error.message}` : 'facebook ✓')
  } else {
    results.push('facebook failed: card not found in repo')
  }

  // Instagram — needs a public URL; it fetches the image itself.
  if (env.META_IG_USER_ID && env.CARD_BASE_URL) {
    const imageUrl = `${env.CARD_BASE_URL.replace(/\/$/, '')}/${slug}.png`
    const c = await fetch(`${GRAPH}/${env.META_IG_USER_ID}/media`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ image_url: imageUrl, caption: caption.slice(0, 2190), access_token: token }),
    })
    const cj = (await c.json()) as { id?: string; error?: { message: string } }
    if (cj.id) {
      const p = await fetch(`${GRAPH}/${env.META_IG_USER_ID}/media_publish`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ creation_id: cj.id, access_token: token }),
      })
      const pj = (await p.json()) as { id?: string; error?: { message: string } }
      results.push(pj.id ? 'instagram ✓' : `instagram failed: ${pj.error?.message}`)
    } else {
      results.push(`instagram failed: ${cj.error?.message}`)
    }
  }

  return { ok: results.some((r) => r.endsWith('✓')), detail: results.join(' · ') }
}

/** Kick off a generation run in GitHub Actions. */
async function dispatchRun(env: Env, pillar: string | null, days: string) {
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) return 'GitHub not configured'
  const inputs: Record<string, string> = { days }
  if (pillar) inputs.pillar = pillar.toUpperCase()
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/social.yml/dispatches`,
    {
      method: 'POST',
      headers: {
        authorization: `token ${env.GITHUB_TOKEN}`,
        accept: 'application/vnd.github+json',
        'user-agent': 'krystallx-social',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ ref: 'main', inputs }),
    },
  )
  return res.status === 204 ? 'Run started — post lands here in a couple of minutes.' : `Dispatch failed (${res.status})`
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  // (1) Prove the caller is Telegram.
  if (request.headers.get('x-telegram-bot-api-secret-token') !== env.TELEGRAM_SECRET_TOKEN) {
    return new Response('forbidden', { status: 403 })
  }

  const update = (await request.json()) as any

  // ---- Approve / Reject ----
  const cb = update.callback_query
  if (cb) {
    // (2) Only the owner may approve. Anyone can message a bot.
    if (String(cb.message?.chat?.id) !== env.TELEGRAM_OWNER_CHAT_ID) {
      await tg(env, 'answerCallbackQuery', { callback_query_id: cb.id, text: 'Not authorised.' })
      return new Response('ok')
    }

    const [action, slug] = String(cb.data ?? '').split(':')
    let note: string

    if (action === 'no') {
      note = '🗑 Rejected — not posted.'
    } else if (action === 'ok') {
      // (3) Re-fetch content from the repo rather than trusting the callback.
      const raw = await repoFile(env, `social/out/${slug}.json`)
      if (!raw) {
        note = '⚠️ Could not load that post from the repo.'
      } else {
        const post = JSON.parse(new TextDecoder().decode(raw))
        const r = await publishToMeta(env, slug, post.caption)
        note = r.ok ? `✅ Posted — ${r.detail}` : `⚠️ ${r.detail}`
      }
    } else {
      note = 'Unknown action.'
    }

    await tg(env, 'answerCallbackQuery', { callback_query_id: cb.id, text: note.slice(0, 190) })
    // Clear the buttons so the same post can't be published twice.
    await tg(env, 'editMessageCaption', {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      caption: `${(cb.message.caption ?? '').split('\n')[0]}\n\n${note}`,
      reply_markup: { inline_keyboard: [] },
    })
    return new Response('ok')
  }

  // ---- Commands ----
  const msg = update.message
  if (msg?.text && String(msg.chat?.id) === env.TELEGRAM_OWNER_CHAT_ID) {
    const [cmd, a, b] = msg.text.trim().split(/\s+/)
    let reply: string

    if (cmd === '/post') {
      // /post              → today's pillar, 1 day
      // /post explainer    → forced pillar
      // /post explainer 3  → forced pillar, 3 days
      reply = await dispatchRun(env, a ?? null, b ?? '1')
    } else if (cmd === '/start' || cmd === '/help') {
      reply =
        'KrystallX social.\n\n' +
        '/post — generate today\'s post\n' +
        '/post explainer — force a pillar\n' +
        '/post explainer 3 — several days\n\n' +
        'Pillars: explainer, capability, context, mission, proof, activity\n' +
        'Queued posts arrive here with Approve / Reject buttons.'
    } else {
      reply = 'Unknown command. /help for options.'
    }

    await tg(env, 'sendMessage', { chat_id: msg.chat.id, text: reply })
  }

  return new Response('ok')
}
