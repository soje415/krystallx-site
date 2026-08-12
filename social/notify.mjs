/**
 * Telegram notification with approval buttons.
 *
 * callback_data carries only the slug (Telegram caps it at 64 bytes), so the
 * webhook re-fetches the post from the repo rather than trusting anything
 * round-tripped through the client.
 */
import { readFileSync } from 'node:fs'

const API = 'https://api.telegram.org'

async function call(token, method, body) {
  const res = await fetch(`${API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(`${method}: ${json.description}`)
  return json.result
}

/** sendPhoto needs multipart; everything else is JSON. */
async function sendPhoto(token, chatId, cardPath, caption, keyboard) {
  const form = new FormData()
  form.set('chat_id', String(chatId))
  form.set('caption', caption)
  form.set('parse_mode', 'HTML')
  if (keyboard) form.set('reply_markup', JSON.stringify(keyboard))
  form.set('photo', new Blob([readFileSync(cardPath)], { type: 'image/png' }), 'card.png')

  const res = await fetch(`${API}/bot${token}/sendPhoto`, { method: 'POST', body: form })
  const json = await res.json()
  if (!json.ok) throw new Error(`sendPhoto: ${json.description}`)
  return json.result
}

const trim = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * @param {object} post
 * @param {string} cardPath
 * @param {string} slug
 * @param {'APPROVE'|'DRAFT'|'AUTO'} tier
 * @param {object} publishResult  present when the post already went out (AUTO)
 */
export async function notify(post, cardPath, slug, tier, publishResult, env = process.env) {
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return { notified: false, reason: 'telegram not configured' }

  const flags = post.opsec?.reasons?.length
    ? `\n\n⚠️ ${post.opsec.reasons.map((r) => esc(r)).join('\n⚠️ ')}`
    : ''

  let header
  let keyboard = null

  if (tier === 'AUTO' && publishResult?.published) {
    header = `✅ <b>Posted automatically</b> — ${esc(publishResult.reason)}`
  } else if (tier === 'DRAFT') {
    header = '📝 <b>Draft — needs your edit</b>\nThis pillar never auto-publishes.'
  } else {
    header = '⏳ <b>Awaiting approval</b>'
    keyboard = {
      inline_keyboard: [[
        { text: '✅ Approve & post', callback_data: `ok:${slug}` },
        { text: '🗑 Reject', callback_data: `no:${slug}` },
      ]],
    }
  }

  const caption = [
    header,
    '',
    `<b>${esc(post.card.headline.replace(/<\/?em>/g, ''))}</b>`,
    `<i>${esc(post.pillar)} · ${slug}</i>`,
    '',
    esc(trim(post.caption, 550)),
    flags,
  ].join('\n')

  // Telegram caps photo captions at 1024 characters.
  const result = await sendPhoto(token, chatId, cardPath, trim(caption, 1020), keyboard)
  return { notified: true, message_id: result.message_id }
}

export { call as telegramCall }
