import { useEffect } from 'react'

/**
 * Per-route document title and meta description. The site is a client-rendered
 * SPA, so index.html's static title/description is the only metadata a crawler
 * sees for every URL unless each page sets its own. This keeps the base brand
 * on every title and swaps the description to match the page.
 */
export function useSeo(title: string, description?: string) {
  useEffect(() => {
    document.title = title

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }
  }, [title, description])
}
