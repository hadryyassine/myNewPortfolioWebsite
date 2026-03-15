import { useCallback, useEffect, useMemo, useState } from 'react'
import { getSlideImageSrc, preloadImage } from '../utils/performance'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function SlideDeck({
  pdfUrl,
  imageBasePath = '',
  imageExtension = 'jpg',
  totalPages = 1,
  startPage = 1,
  title = 'Slide deck',
}) {
  const safeTotal = Math.max(1, Number(totalPages) || 1)
  const [page, setPage] = useState(clamp(startPage, 1, safeTotal))
  const [isActivated, setIsActivated] = useState(false)
  const slideAspectRatio = 16 / 9

  const imageSrc = useMemo(
    () => getSlideImageSrc(imageBasePath, page, imageExtension),
    [imageBasePath, imageExtension, page]
  )

  const warmSlide = useCallback((targetPage) => {
    const targetSrc = getSlideImageSrc(imageBasePath, targetPage, imageExtension)
    if (targetSrc) preloadImage(targetSrc)
  }, [imageBasePath, imageExtension])

  useEffect(() => {
    if (!isActivated || !imageBasePath) return

    warmSlide(page)
    warmSlide(Math.min(page + 1, safeTotal))
  }, [imageBasePath, isActivated, page, safeTotal, warmSlide])

  const activate = () => {
    warmSlide(page)
    setIsActivated(true)
  }

  const prev = () => setPage((currentPage) => clamp(currentPage - 1, 1, safeTotal))
  const next = () => setPage((currentPage) => clamp(currentPage + 1, 1, safeTotal))

  return (
    <section className="not-prose my-8 rounded-2xl border border-[#dce5ea] bg-white/70 p-4 shadow-sm dark:border-[#2a3b46] dark:bg-[#10202a]/70 sm:p-5">
      <header className="mb-4 flex flex-wrap items-center gap-3 px-1 text-sm sm:px-2">
        <p className="font-medium text-[#22343d] dark:text-[#d9e6ee]">{title}</p>
        <p className="ml-auto text-xs text-[#647b86] dark:text-[#8ca3af]">
          Slide {page} / {safeTotal}
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-[#d9e4ea] bg-white dark:border-[#2a3a45] dark:bg-[#0e1a22]">
        <div className="w-full" style={{ aspectRatio: slideAspectRatio }}>
          {isActivated ? (
            imageSrc ? (
              <img
                key={page}
                src={imageSrc}
                alt={`${title} - slide ${page}`}
                className="h-full w-full object-cover"
                loading={page === startPage ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={page === startPage ? 'high' : 'auto'}
              />
            ) : (
              <iframe
                key={page}
                src={`${pdfUrl}#page=${page}&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                title={title}
                className="h-full w-full"
                width="100%"
                loading="eager"
              />
            )
          ) : (
            <button
              type="button"
              onClick={activate}
              onPointerEnter={() => warmSlide(page)}
              className="group flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(111,156,162,0.18),transparent_50%),linear-gradient(180deg,#f7fbfc_0%,#eef5f8_100%)] px-6 text-center dark:bg-[radial-gradient(circle_at_top,rgba(111,156,162,0.15),transparent_45%),linear-gradient(180deg,#12212b_0%,#0d1820_100%)]"
            >
              <span className="rounded-full border border-[#cad8e0] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#526972] dark:border-[#2f4451] dark:bg-[#152731]/85 dark:text-[#a3bac7]">
                Interactive deck
              </span>
              <p className="mt-4 max-w-xl text-sm text-[#5e7680] dark:text-[#8ca3af]">
                The next slide is warmed up as you browse to keep navigation responsive.
              </p>
              <span className="mt-5 inline-flex items-center rounded-full bg-[#6f9ca2] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(53,80,90,0.16)] transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                Load slides
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {isActivated ? (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={page <= 1}
              aria-label="Previous slide"
              title="Previous slide"
              className="h-9 w-9 rounded-md border border-[#cad8e0] text-lg leading-none text-[#324953] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#35515f] dark:text-[#d6e4ec]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              disabled={page >= safeTotal}
              aria-label="Next slide"
              title="Next slide"
              className="h-9 w-9 rounded-md border border-[#cad8e0] text-lg leading-none text-[#324953] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#35515f] dark:text-[#d6e4ec]"
            >
              →
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={activate}
            onPointerEnter={() => warmSlide(page)}
            className="inline-flex h-9 items-center rounded-md border border-[#cad8e0] px-3 text-sm font-medium text-[#324953] dark:border-[#35515f] dark:text-[#d6e4ec]"
          >
            Load slides
          </button>
        )}
        <a
          href={imageSrc || `${pdfUrl}#page=${page}`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-xs underline text-[#486877] hover:text-[#2d4d5a] dark:text-[#9fc0ce] dark:hover:text-[#cde4ed]"
        >
          Open current slide
        </a>
      </div>
    </section>
  )
}
