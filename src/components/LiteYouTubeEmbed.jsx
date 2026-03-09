import { useEffect, useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import {
  ensureResourceHint,
  getYouTubeEmbedUrl,
  getYouTubePosterUrl,
} from '../utils/performance'

export default function LiteYouTubeEmbed({
  videoId,
  start = 0,
  title,
  posterSrc,
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const thumbnailSrc = posterSrc || getYouTubePosterUrl(videoId)
  const embedSrc = useMemo(
    () => getYouTubeEmbedUrl({ videoId, start, autoplay: isPlaying }),
    [isPlaying, start, videoId]
  )

  useEffect(() => {
    ensureResourceHint('preconnect', 'https://www.youtube-nocookie.com')
    ensureResourceHint('preconnect', 'https://i.ytimg.com')
  }, [])

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[#dce5ea] bg-white shadow-sm dark:border-[#2a3b46] dark:bg-[#10202a]">
      <div className="w-full" style={{ aspectRatio: 16 / 9 }}>
        {isPlaying ? (
          <iframe
            className="h-full w-full"
            width="100%"
            height="100%"
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="group relative h-full w-full overflow-hidden bg-[#0f1a22] text-left"
            aria-label={`Play ${title}`}
          >
            <img
              src={thumbnailSrc}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-[#10202a] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-out group-hover:scale-105">
                <Play className="ml-1 h-6 w-6 fill-current" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="text-sm font-medium text-white sm:text-base">{title}</p>
              <p className="mt-1 text-xs text-white/80 sm:text-sm">
                Load the full YouTube player only when you want to watch.
              </p>
            </div>
          </button>
        )}
      </div>
    </section>
  )
}
