/**
 * Ayrshare publisher — the alternative to Meta Graph.
 *
 * Two advantages over the Meta path beyond the setup time: it covers X as
 * well as Facebook and Instagram, and it accepts a media upload, so it does
 * NOT depend on the card being publicly reachable. The Meta path cannot post
 * to Instagram until the site is deployed, because Instagram insists on
 * fetching the image from a public URL.
 *
 * Env:
 *   AYRSHARE_API_KEY
 *   AYRSHARE_PLATFORMS  optional CSV, default "facebook,instagram"
 */
import { readFileSync } from 'node:fs'

const API = 'https://api.ayrshare.com/api'

/** Upload the card and get back a hosted URL we can attach to the post. */
async function uploadCard(key, cardPath) {
  const res = await fetch(`${API}/media/upload`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      file: `data:image/png;base64,${readFileSync(cardPath).toString('base64')}`,
      fileName: cardPath.split('/').pop(),
    }),
  })
  const json = await res.json()
  if (!res.ok || !json.accessUrl) {
    throw new Error(`media upload: ${json.message ?? res.statusText}`)
  }
  return json.accessUrl
}

export async function publishPost(post, cardPath, _slug, env = process.env) {
  const key = env.AYRSHARE_API_KEY
  if (!key) return { published: false, results: [], reason: 'AYRSHARE_API_KEY not set (dry run)' }

  const platforms = (env.AYRSHARE_PLATFORMS ?? 'facebook,instagram').split(',').map((p) => p.trim())

  try {
    const mediaUrl = await uploadCard(key, cardPath)

    const res = await fetch(`${API}/post`, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        // Instagram caps captions at 2200 characters; trim for the shortest limit.
        post: post.caption.slice(0, 2190),
        platforms,
        mediaUrls: [mediaUrl],
      }),
    })
    const json = await res.json()

    // Ayrshare reports per-platform outcomes even on an overall 200.
    const results = (json.postIds ?? []).map((p) => ({ platform: p.platform, id: p.id }))
    const errors = (json.errors ?? []).map((e) => ({ platform: e.platform, error: e.message }))

    if (!res.ok && !results.length) {
      return { published: false, results: errors, reason: json.message ?? 'ayrshare rejected the post' }
    }
    return {
      published: results.length > 0,
      results: [...results, ...errors],
      reason: results.length ? `posted to ${results.map((r) => r.platform).join(', ')}` : 'all platforms failed',
    }
  } catch (e) {
    return { published: false, results: [], reason: e.message }
  }
}
