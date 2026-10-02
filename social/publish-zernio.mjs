/**
 * Zernio publisher — Instagram + TikTok + X (and Facebook if connected).
 *
 * Replaces Ayrshare ($149/mo) as the default. Accounts are connected once in
 * the Zernio dashboard (OAuth); we discover them at publish time via
 * GET /accounts, so no account ids live in config.
 *
 * Per-platform shape matters:
 *   Instagram / Facebook — long caption + the card.
 *   TikTok               — card posts as a one-image photo post; needs the
 *                          explicit consent flags TikTok's rules require.
 *   X                    — the generator's `thread` (each tweet < 275 chars);
 *                          only the first carries the card.
 *
 * Env:
 *   ZERNIO_API_KEY
 *   ZERNIO_PLATFORMS  optional CSV, default = every connected account
 */
import { readFileSync } from 'node:fs'

const API = 'https://zernio.com/api/v1'

async function zernio(key, path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', ...init.headers },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${path}: ${json.error ?? json.message ?? res.statusText}`)
  return json
}

/** Presign → PUT bytes → return the public URL to reference in the post. */
async function uploadCard(key, cardPath) {
  const filename = cardPath.split('/').pop()
  const bytes = readFileSync(cardPath)
  const { uploadUrl, publicUrl } = await zernio(key, '/media/presign', {
    method: 'POST',
    body: JSON.stringify({ filename, contentType: 'image/png', size: bytes.length }),
  })
  const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'content-type': 'image/png' }, body: bytes })
  if (!put.ok) throw new Error(`media upload: ${put.status}`)
  return publicUrl
}

function platformEntry(account, post) {
  const platform = account.platform
  const entry = { platform, accountId: account._id ?? account.id }

  if (platform === 'twitter' || platform === 'x') {
    const [first, ...rest] = post.thread ?? [post.caption.slice(0, 275)]
    entry.platformSpecificData = {
      content: first,
      threadItems: rest.map((content) => ({ content })),
    }
  } else if (platform === 'tiktok') {
    entry.platformSpecificData = {
      tiktokSettings: {
        media_type: 'photo',
        privacy_level: 'PUBLIC_TO_EVERYONE',
        allow_comment: true,
        content_preview_confirmed: true,
        express_consent_given: true,
        auto_add_music: false,
        description: post.caption.slice(0, 3990),
      },
    }
  }
  return entry
}

export async function publishPost(post, cardPath, _slug, env = process.env) {
  const key = env.ZERNIO_API_KEY
  if (!key) return { published: false, results: [], reason: 'ZERNIO_API_KEY not set (dry run)' }

  try {
    const { accounts = [] } = await zernio(key, '/accounts')
    const only = env.ZERNIO_PLATFORMS?.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean)
    const targets = accounts.filter((a) => !only?.length || only.includes(a.platform))
    if (!targets.length) {
      return { published: false, results: [], reason: 'no connected accounts — connect them in the Zernio dashboard' }
    }

    const mediaUrl = await uploadCard(key, cardPath)
    const json = await zernio(key, '/posts', {
      method: 'POST',
      body: JSON.stringify({
        content: post.caption.slice(0, 2190), // Instagram's cap is the tightest
        mediaItems: [{ type: 'image', url: mediaUrl }],
        platforms: targets.map((a) => platformEntry(a, post)),
        publishNow: true,
      }),
    })

    const p = json.post ?? json
    const results = (p.platforms ?? []).map((x) => ({
      platform: x.platform,
      status: x.status,
      error: x.error ?? x.errorMessage,
    }))
    const ok = results.filter((r) => r.status !== 'failed' && !r.error)
    return {
      published: ok.length > 0,
      results,
      reason: ok.length
        ? `posted to ${ok.map((r) => r.platform).join(', ')}` +
          (ok.length < results.length ? ` · failed: ${results.filter((r) => !ok.includes(r)).map((r) => `${r.platform} (${r.error})`).join(', ')}` : '')
        : `all platforms failed: ${results.map((r) => `${r.platform} (${r.error})`).join(', ') || 'unknown'}`,
    }
  } catch (e) {
    return { published: false, results: [], reason: e.message }
  }
}
