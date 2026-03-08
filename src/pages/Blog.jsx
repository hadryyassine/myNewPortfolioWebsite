import { useMemo } from 'react'
import { motion as Motion } from 'framer-motion'
import { CornerUpLeft } from 'lucide-react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import { allCategories, posts } from '../blog/posts'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'

function toggleSet(arr, value) {
  const set = new Set(arr)
  set.has(value) ? set.delete(value) : set.add(value)
  return Array.from(set)
}

function formatBlogDate(dateInput) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
    .format(new Date(dateInput))
    .toUpperCase()
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Blog() {
  const outletContext = useOutletContext() || {}
  const isDark = outletContext.isDark || false
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const selected = params.getAll('cat')
  const space = useViewportSpace()

  const filtered = useMemo(() => {
    const norm = (s) =>
      (s || '')
        .toString()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()

    const tokens = norm(q).split(/\s+/).filter(Boolean)

    return posts.filter((p) => {
      const hay = norm([p.title, p.summary, ...(p.keywords || []), ...(p.categories || [])].join(' '))

      const matchesQuery = tokens.length === 0 ? true : tokens.every((t) => hay.includes(t))
      const matchesCats = selected.length === 0 ? true : p.categories.some((c) => selected.includes(c))

      return matchesQuery && matchesCats
    })
  }, [q, selected])

  return (
    <>
      <SEO
        title="Blog"
        description="Articles on DevOps, deployment strategies, cloud engineering, and lessons from real projects."
        url={`${site.baseUrl}/blog`}
        keywords={['devops blog', 'deployment strategies', 'cloud engineering', 'software engineering']}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: `${site.name} Blog`,
          url: `${site.baseUrl}/blog`,
          inLanguage: 'en',
        }}
      />

      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
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
              Blog
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
                placeholder="Search..."
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
                    next.delete('cat')
                    setParams(next, { replace: true })
                  }}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-150 ease-out ${
                      selected.length === 0
                        ? 'bg-[#6f9ca2] text-white'
                        : isDark
                        ? 'text-[#90a2ae] hover:bg-[#253540]'
                        : 'text-[#6c7f88] hover:bg-[#eef3f5]'
                  }`}
                  title="Show all categories"
                >
                  All
                </button>

                {allCategories.map((c) => {
                  const active = selected.includes(c)
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        const next = new URLSearchParams(params)
                        const nextCats = toggleSet(selected, c)
                        next.delete('cat')
                        nextCats.forEach((v) => next.append('cat', v))
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
                      {c}
                    </button>
                  )
                })}
                {selected.length > 0 && (
                  <button
                    onClick={() => {
                      const next = new URLSearchParams(params)
                      next.delete('cat')
                      setParams(next, { replace: true })
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-150 ease-out ${
                      isDark ? 'text-[#90a2ae] hover:bg-[#253540]' : 'text-[#6c7f88] hover:bg-[#eef3f5]'
                    }`}
                    title="Clear categories"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {filtered.length > 0 ? (
            <Motion.ul
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="mt-6 grid gap-4"
            >
              {filtered.map((p) => (
                <Motion.li
                  key={p.slug}
                  variants={cardVariants}
                  className={`rounded-2xl p-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 ${
                    isDark
                      ? 'bg-[#15212a]/88 shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)]'
                      : 'bg-[#f5f8fa] shadow-[0_10px_26px_rgba(53,80,90,0.12)] hover:shadow-[0_14px_30px_rgba(53,80,90,0.17)]'
                  }`}
                >
                  <div
                    className={`text-[9px] uppercase tracking-[0.16em] ${
                      isDark ? 'text-[#7f94a1]' : 'text-[#8b9aa1]'
                    }`}
                  >
                    {formatBlogDate(p.date)} · {p.readingTime}
                  </div>
                  <h2 className={`mt-2 text-xl font-semibold break-words ${isDark ? 'text-[#edf3f8]' : 'text-[#1f3036]'}`}>
                    <Link className="hover:underline" to={p.url}>
                      {p.title}
                    </Link>
                  </h2>
                  <p className={`mt-2 ${isDark ? 'text-[#b8c7d0]' : 'text-[#4d626b]'}`}>{p.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.categories.map((c) => (
                      <span
                        key={c}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDark
                            ? 'bg-[#23333d] text-[#c6d4dc]'
                            : 'bg-[#edf1f3] text-[#5d727b]'
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </Motion.li>
              ))}
            </Motion.ul>
          ) : (
            <div
              className={`mt-8 rounded-2xl p-8 text-center ${
                isDark
                  ? 'bg-[#15212a]/85 text-[#a2b3bf] shadow-[0_8px_26px_rgba(0,0,0,0.24)]'
                  : 'bg-[#f5f8fa] text-[#5f7680] shadow-[0_12px_32px_rgba(53,80,90,0.14)]'
              }`}
            >
              <svg
                viewBox="0 0 80 80"
                className="mx-auto h-14 w-14 opacity-70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="36" cy="36" r="18" stroke="currentColor" strokeWidth="3" />
                <path d="M50 50L62 62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M28 36H44" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <p className="mt-4 text-sm">No posts match your search or selected filters.</p>
              <button
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className={`mt-4 text-xs px-3 py-1.5 rounded-full ${isDark ? 'hover:bg-[#22303a]' : 'hover:bg-[#f3ecdf]'}`}
              >
                Reset filters
              </button>
            </div>
          )}
          </div>
        </section>
      </Motion.div>
    </>
  )
}
