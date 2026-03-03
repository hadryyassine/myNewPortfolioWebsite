import { useState } from 'react'

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
  const slideAspectRatio = 16 / 9

  const formattedPage = String(page).padStart(2, '0')
  const imageSrc = imageBasePath
    ? `${imageBasePath}/slide-${formattedPage}.${imageExtension}`
    : ''

  const prev = () => setPage((p) => clamp(p - 1, 1, safeTotal))
  const next = () => setPage((p) => clamp(p + 1, 1, safeTotal))

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
          {imageSrc ? (
            <img
              key={page}
              src={imageSrc}
              alt={`${title} - slide ${page}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <iframe
              key={page}
              src={`${pdfUrl}#page=${page}&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
              title={title}
              className="h-full w-full"
              width="100%"
              loading="lazy"
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
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
