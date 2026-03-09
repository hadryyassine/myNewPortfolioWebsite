export const BOOT_MINIMUM_MS = 220

export function getRemainingBootDelay(startedAt, now = Date.now(), minimum = BOOT_MINIMUM_MS) {
  return Math.max(0, minimum - (now - startedAt))
}

export function runWhenIdle(callback, timeout = 200) {
  if (typeof window === 'undefined') return () => {}

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 700 })
    return () => window.cancelIdleCallback(id)
  }

  const id = window.setTimeout(callback, timeout)
  return () => window.clearTimeout(id)
}

export function preloadImage(src) {
  if (!src || typeof Image === 'undefined') return null

  const image = new Image()
  image.decoding = 'async'
  image.src = src
  return image
}

export function getSlideImageSrc(imageBasePath, page, imageExtension = 'jpg') {
  if (!imageBasePath) return ''

  const formattedPage = String(page).padStart(2, '0')
  return `${imageBasePath}/slide-${formattedPage}.${imageExtension}`
}

export function getYouTubePosterUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function getYouTubeEmbedUrl({ videoId, start = 0, autoplay = false }) {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })

  if (Number(start) > 0) params.set('start', String(start))
  if (autoplay) params.set('autoplay', '1')

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}

export function ensureResourceHint(rel, href) {
  if (typeof document === 'undefined' || !href) return

  const selector = `link[rel="${rel}"][href="${href}"]`
  if (document.head.querySelector(selector)) return

  const link = document.createElement('link')
  link.rel = rel
  link.href = href
  if (rel === 'preconnect') link.crossOrigin = ''
  document.head.appendChild(link)
}
