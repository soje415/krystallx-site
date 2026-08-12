/**
 * Meta Graph publisher — Facebook Page + Instagram.
 *
 * The two platforms take images differently and it matters:
 *   Facebook  — accepts raw bytes via multipart upload. Works anywhere.
 *   Instagram — accepts ONLY a public image URL. It fetches the image itself,
 *               so the card must be reachable on the open internet before the
 *               call is made. That's what CARD_BASE_URL is for.
 *
 * Env:
 *   META_ACCESS_TOKEN  long-lived Page access token
 *   META_PAGE_ID       Facebook Page id
 *   META_IG_USER_ID    Instagram Business account id (optional; skips IG if unset)
 *   CARD_BASE_URL      public base for card PNGs (optional; required for IG)
 */
import { readFileSync } from 'node:fs'

const GRAPH = 'https://graph.facebook.com/v21.0'

async function graph(path, { method = 'POST', params = {}, token }) {
  const url = new URL(`${GRAPH}/${path}`)
  const body = new URLSearchParams({ ...params, access_token: token })
  const res = await fetch(url, {
    method,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  })
  const json = await res.json()
  if (!res.ok || json.error) {
    throw new Error(`${path}: ${json.error?.message ?? res.statusText}`)
  }
  return json
}

/** Facebook accepts the bytes directly, so no public URL is needed. */
async function postFacebook({ token, pageId, message, cardPath }) {
  const form = new FormData()
  form.set('message', message)
  form.set('access_token', token)
  form.set('source', new Blob([readFileSync(cardPath)], { type: 'image/png' }), 'card.png')

  const res = await fetch(`${GRAPH}/${pageId}/photos`, { method: 'POST', body: form })
  const json = await res.json()
  if (!res.ok || json.error) throw new Error(`facebook: ${json.error?.message ?? res.statusText}`)
  return { platform: 'facebook', id: json.post_id ?? json.id }
}

/**
 * Instagram is a two-step publish: create a media container pointing at a
 * public URL, then publish the container. Meta's servers fetch the image, so
 * a URL that is only reachable from our machine will fail.
 */
async function postInstagram({ token, igUserId, caption, cardUrl }) {
  const container = await graph(`${igUserId}/media`, {
    token,
    params: { image_url: cardUrl, caption },
  })
  const published = await graph(`${igUserId}/media_publish`, {
    token,
    params: { creation_id: container.id },
  })
  return { platform: 'instagram', id: published.id }
}

/**
 * Publish one post to every configured platform.
 * Failures are per-platform: Instagram failing must not lose the Facebook post.
 */
export async function publishPost(post, cardPath, slug, env = process.env) {
  const token = env.META_ACCESS_TOKEN
  const pageId = env.META_PAGE_ID
  const igUserId = env.META_IG_USER_ID
  const cardBase = env.CARD_BASE_URL

  if (!token || !pageId) {
    return { published: false, results: [], reason: 'META_ACCESS_TOKEN / META_PAGE_ID not set (dry run)' }
  }

  const results = []

  try {
    results.push(await postFacebook({ token, pageId, message: post.caption, cardPath }))
  } catch (e) {
    results.push({ platform: 'facebook', error: e.message })
  }

  if (igUserId && cardBase) {
    try {
      // IG captions cap at 2200 characters.
      const caption = post.caption.slice(0, 2190)
      results.push(
        await postInstagram({
          token,
          igUserId,
          caption,
          cardUrl: `${cardBase.replace(/\/$/, '')}/${slug}.png`,
        }),
      )
    } catch (e) {
      results.push({ platform: 'instagram', error: e.message })
    }
  } else if (igUserId) {
    results.push({ platform: 'instagram', error: 'CARD_BASE_URL not set — IG needs a public image URL' })
  }

  const ok = results.filter((r) => r.id)
  return {
    published: ok.length > 0,
    results,
    reason: ok.length ? `posted to ${ok.map((r) => r.platform).join(', ')}` : 'all platforms failed',
  }
}
