import { useMemo } from 'react'
import { CornerUpLeft, ExternalLink } from 'lucide-react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'
import {
  allResourceTypes,
  resourceTypeLabels,
  resources,
} from '../resources/resources'

function toggleSet(arr, value) {
  const set = new Set(arr)
  set.has(value) ? set.delete(value) : set.add(value)
  return Array.from(set)
}

function normalize(input) {
  return (input || '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function formatMeta(item) {
  const parts = []
  if (item.author) parts.push(item.author)
  if (item.year) parts.push(String(item.year))
  if (item.location) parts.push(item.location)
  if (item.platform) parts.push(item.platform)
  return parts.join(' · ')
}

function formatResourceDate(dateInput) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
    .format(new Date(dateInput))
    .toUpperCase()
}

export default function Resources() {
  const outletContext = useOutletContext() || {}
  const isDark = outletContext.isDark || false
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const selectedTypes = params.getAll('type')
  const space = useViewportSpace()

  const filtered = useMemo(() => {
    const tokens = normalize(q).split(/\s+/).filter(Boolean)

    return resources.filter((item) => {
      const haystack = normalize(
        [
          item.title,
          item.summary,
          item.note,
          item.author,
          item.platform,
          item.location,
          ...(item.tags || []),
        ].join(' ')
      )

      const matchesQuery =
        tokens.length === 0 ? true : tokens.every((token) => haystack.includes(token))
      const matchesType =
        selectedTypes.length === 0 ? true : selectedTypes.includes(item.type)

      return matchesQuery && matchesType
    })
  }, [q, selectedTypes])

  const featured = useMemo(
    () => filtered.filter((item) => item.featured).slice(0, 3),
    [filtered]
  )

  return (
    <>
      <SEO title="Resources" url={`${site.baseUrl}/resources`} />

      <section
        style={space ? { minHeight: `${space}px` } : undefined}
        className="flex items-start py-4 sm:py-6"
      >
        <div className="w-full">
          <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
            <h1
              className={`text-[1.9rem] sm:text-3xl font-medium tracking-tight ${
                isDark ? 'text-[#e9f2f8]' : 'text-[#1f2f35]'
              }`}
            >
              Resources
            </h1>

            <div className="ml-auto flex items-center gap-2 basis-full sm:basis-auto">
              <input
                value={q}
                onChange={(e) => {
                  const val = e.target.value
                  const next = new URLSearchParams(params)
                  if (val) next.set('q', val)
                  else next.delete('q')
                  setParams(next, { replace: true })
                }}
                placeholder="Search resources..."
                className={`w-full sm:w-56 md:w-72 px-3 py-1.5 rounded-lg min-w-0 transition-shadow duration-200 ease-out focus:outline-none ${
                  isDark
                    ? 'bg-[#1a252e]/88 text-neutral-100 placeholder:text-[#8ea1ad] shadow-[0_10px_24px_rgba(0,0,0,0.25)] focus:shadow-[0_0_0_2px_rgba(126,158,176,0.28),0_12px_26px_rgba(0,0,0,0.35)]'
                    : 'bg-[#f2f6f8] text-[#2a3d45] placeholder:text-[#7c8f98] shadow-[0_8px_22px_rgba(53,80,90,0.08)] focus:shadow-[0_0_0_2px_rgba(126,158,176,0.22),0_10px_24px_rgba(53,80,90,0.14)]'
                }`}
              />

              <Link
                to="/"
                aria-label="Return to home"
                title="Return"
                className={`h-8 w-8 flex items-center justify-center shrink-0 ${
                  isDark ? 'text-[#8ea1ad] hover:text-[#dce7ee]' : 'text-[#6a7d86] hover:text-[#2d444d]'
                }`}
              >
                <CornerUpLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-4 sticky top-2 z-20">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  onClick={() => {
                    const next = new URLSearchParams(params)
                    next.delete('type')
                    setParams(next, { replace: true })
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-150 ease-out ${
                    selectedTypes.length === 0
                      ? 'bg-[#6f9ca2] text-white'
                      : isDark
                        ? 'text-[#90a2ae] hover:bg-[#253540]'
                        : 'text-[#6c7f88] hover:bg-[#eef3f5]'
                  }`}
                  title="Show all resource types"
                >
                  All
                </button>

                {allResourceTypes.map((type) => {
                  const active = selectedTypes.includes(type)
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        const next = new URLSearchParams(params)
                        const nextTypes = toggleSet(selectedTypes, type)
                        next.delete('type')
                        nextTypes.forEach((value) => next.append('type', value))
                        setParams(next, { replace: true })
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-150 ease-out ${
                        active
                          ? 'bg-[#6f9ca2] text-white'
                          : isDark
                            ? 'text-[#90a2ae] hover:bg-[#253540]'
                            : 'text-[#6c7f88] hover:bg-[#eef3f5]'
                      }`}
                    >
                      {resourceTypeLabels[type]}
                    </button>
                  )
                })}
                {(selectedTypes.length > 0 || q) && (
                  <button
                    onClick={() => setParams(new URLSearchParams(), { replace: true })}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-150 ease-out ${
                      isDark ? 'text-[#90a2ae] hover:bg-[#253540]' : 'text-[#6c7f88] hover:bg-[#eef3f5]'
                    }`}
                    title="Clear filters and search"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {featured.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item) => (
                <article
                  key={`featured-${item.slug}`}
                  className={`rounded-2xl p-4 transition-all duration-200 hover:-translate-y-[2px] ${
                    isDark
                      ? 'bg-[#6f9ca2]/24 shadow-[0_10px_28px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)]'
                      : 'bg-[#6f9ca2]/16 shadow-[0_12px_32px_rgba(53,80,90,0.14)] hover:shadow-[0_18px_40px_rgba(53,80,90,0.22)]'
                  }`}
                >
                  <div
                    className={`text-[9px] uppercase tracking-[0.16em] ${
                      'text-[#6f9ca2]'
                    }`}
                  >
                    TOP PICK · {resourceTypeLabels[item.type]}
                  </div>
                  <h2 className={`mt-2 text-lg font-semibold break-words ${isDark ? 'text-[#edf3f8]' : 'text-[#1f3036]'}`}>
                    {item.title}
                  </h2>
                  <p className={`mt-2 text-sm ${isDark ? 'text-[#b8c7d0]' : 'text-[#4d626b]'}`}>
                    {item.note || item.summary}
                  </p>
                </article>
              ))}
            </div>
          )}

          <ul className="mt-6 grid gap-4">
            {filtered.map((item) => {
              const meta = formatMeta(item)
              return (
                <li
                  key={item.slug}
                  className={`rounded-2xl p-5 transition-all duration-200 hover:-translate-y-[2px] ${
                    isDark
                      ? 'bg-[#15212a]/88 shadow-[0_8px_26px_rgba(0,0,0,0.24)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.34)]'
                      : 'bg-[#f5f8fa] shadow-[0_12px_32px_rgba(53,80,90,0.14)] hover:shadow-[0_18px_40px_rgba(53,80,90,0.22)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      {item.dateAdded && (
                        <div
                          className={`text-[9px] uppercase tracking-[0.16em] ${
                            isDark ? 'text-[#7f94a1]' : 'text-[#8b9aa1]'
                          }`}
                        >
                          {formatResourceDate(item.dateAdded)}
                        </div>
                      )}

                      <h2 className={`mt-2 text-xl font-semibold break-words ${isDark ? 'text-[#edf3f8]' : 'text-[#1f3036]'}`}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {item.title}
                        </a>
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDark ? 'bg-[#23333d] text-[#c6d4dc]' : 'bg-[#edf1f3] text-[#5d727b]'
                          }`}
                        >
                          {resourceTypeLabels[item.type]}
                        </span>
                        {(item.tags || []).map((tag) => (
                          <span
                            key={`${item.slug}-${tag}`}
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDark ? 'bg-[#23333d] text-[#c6d4dc]' : 'bg-[#edf1f3] text-[#5d727b]'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className={`mt-3 ${isDark ? 'text-[#b8c7d0]' : 'text-[#4d626b]'}`}>{item.summary}</p>
                      {item.note && (
                        <p className={`mt-2 text-sm ${isDark ? 'text-[#98acb8]' : 'text-[#607781]'}`}>
                          {item.note}
                        </p>
                      )}
                      {meta && <div className={`mt-2 text-sm ${isDark ? 'text-[#8fa2af]' : 'text-[#748991]'}`}>{meta}</div>}
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${item.title}`}
                      title="Open resource"
                      className={`h-8 w-8 shrink-0 flex items-center justify-center ${
                        isDark ? 'text-[#90a2ae] hover:text-[#e0edf4]' : 'text-[#6a7d86] hover:text-[#2d444d]'
                      }`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open resource</span>
                    </a>
                  </div>
                </li>
              )
            })}

            {filtered.length === 0 && (
              <li
                className={`rounded-2xl p-8 text-center ${
                  isDark
                    ? 'bg-[#15212a]/85 text-[#a2b3bf] shadow-[0_8px_26px_rgba(0,0,0,0.24)]'
                    : 'bg-[#f5f8fa] text-[#5f7680] shadow-[0_12px_32px_rgba(53,80,90,0.14)]'
                }`}
              >
                No resources match your filters.
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  )
}
