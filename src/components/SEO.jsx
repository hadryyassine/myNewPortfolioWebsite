import { useEffect } from 'react'
import site from '../data/site'

function toAbsoluteUrl(value) {
  if (!value) return site.baseUrl
  if (/^https?:\/\//i.test(value)) return value
  const normalized = value.startsWith('/') ? value : `/${value}`
  return `${site.baseUrl}${normalized}`
}

function upsertMeta({ name, property, content }) {
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
  if (!content) {
    const existing = document.head.querySelector(selector)
    if (existing) existing.remove()
    return
  }
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    if (name) tag.setAttribute('name', name)
    if (property) tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

function upsertJsonLd(jsonLd) {
  const selector = 'script[type="application/ld+json"][data-seo-jsonld]'
  const existing = document.head.querySelector(selector)

  if (!jsonLd) {
    if (existing) existing.remove()
    return
  }

  const script = existing || document.createElement('script')
  script.setAttribute('type', 'application/ld+json')
  script.setAttribute('data-seo-jsonld', 'true')
  script.textContent = JSON.stringify(jsonLd)
  if (!existing) document.head.appendChild(script)
}

export default function SEO({
  title,
  description = site.description,
  url = site.baseUrl,
  image = site.ogImage,
  type = 'website',
  keywords = [],
  jsonLd = null,
  publishedTime,
  modifiedTime,
  noindex = false,
}) {
  const fullTitle = title ? `${title} — ${site.name}` : site.title
  const canonicalUrl = toAbsoluteUrl(url)
  const imageUrl = toAbsoluteUrl(image)
  const robots = noindex ? 'noindex,nofollow' : 'index,follow'
  const keywordContent = Array.isArray(keywords) ? keywords.filter(Boolean).join(', ') : keywords

  useEffect(() => {
    document.title = fullTitle

    upsertMeta({ name: 'description', content: description })
    upsertMeta({ name: 'keywords', content: keywordContent })
    upsertMeta({ name: 'robots', content: robots })

    upsertCanonical(canonicalUrl)

    upsertMeta({ property: 'og:type', content: type })
    upsertMeta({ property: 'og:title', content: fullTitle })
    upsertMeta({ property: 'og:description', content: description })
    upsertMeta({ property: 'og:url', content: canonicalUrl })
    upsertMeta({ property: 'og:image', content: imageUrl })
    upsertMeta({ property: 'og:site_name', content: site.name })
    upsertMeta({ property: 'og:locale', content: site.locale })

    upsertMeta({ name: 'twitter:card', content: 'summary_large_image' })
    if (site.twitter) upsertMeta({ name: 'twitter:site', content: site.twitter })
    upsertMeta({ name: 'twitter:title', content: fullTitle })
    upsertMeta({ name: 'twitter:description', content: description })
    upsertMeta({ name: 'twitter:image', content: imageUrl })

    if (type === 'article') {
      upsertMeta({ property: 'article:published_time', content: publishedTime })
      upsertMeta({ property: 'article:modified_time', content: modifiedTime || publishedTime })
      upsertMeta({ property: 'article:author', content: site.authorUrl })
    } else {
      upsertMeta({ property: 'article:published_time', content: null })
      upsertMeta({ property: 'article:modified_time', content: null })
      upsertMeta({ property: 'article:author', content: null })
    }

    upsertJsonLd(jsonLd)
  }, [
    canonicalUrl,
    description,
    fullTitle,
    imageUrl,
    jsonLd,
    keywordContent,
    modifiedTime,
    noindex,
    publishedTime,
    robots,
    type,
  ])

  return null
}
