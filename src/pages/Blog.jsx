import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { posts, allCategories } from '../blog/posts'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'

function toggleSet(arr, value) {
  const set = new Set(arr)
  set.has(value) ? set.delete(value) : set.add(value)
  return Array.from(set)
}

export default function Blog() {
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
    // build a single haystack from title + summary + keywords + categories
    const hay = norm(
      [p.title, p.summary, ...(p.keywords || []), ...(p.categories || [])].join(' ')
    )

    const matchesQuery =
      tokens.length === 0 ? true : tokens.every((t) => hay.includes(t))

    const matchesCats =
      selected.length === 0 ? true : p.categories.some((c) => selected.includes(c))

    return matchesQuery && matchesCats
  })
}, [q, selected])


  return (
    <>
      <SEO title="Blog" url={`${site.baseUrl}/blog`} />

      {/* Center everything vertically within the viewport space between header & footer */}
      <section
        style={space ? { minHeight: `${space}px` } : undefined}
        className="flex items-center"
      >
        <div className="w-full">
          <div className="mb-6 flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Blog</h1>
            <input
              value={q}
              onChange={(e) => {
                const val = e.target.value
                const next = new URLSearchParams(params)
                if (val) next.set('q', val)
                else next.delete('q')
                setParams(next, { replace: true })
              }}
              placeholder="Search…"
              className="ml-auto px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent"
            />
          </div>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
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
                  className={`text-xs px-2 py-1 rounded-md border ${
                    active
                      ? 'border-brand/50 bg-brand/10'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
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
                className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800"
                title="Clear categories"
              >
                Clear
              </button>
            )}
          </div>

          {/* Posts */}
          <ul className="mt-6 grid gap-4">
            {filtered.map((p) => (
              <li
                key={p.slug}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5"
              >
                <div className="text-sm text-neutral-500">
                  {new Date(p.date).toDateString()}
                </div>
                <h2 className="mt-1 text-lg font-medium">
                  <Link className="hover:underline" to={p.url}>
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">{p.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.categories.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="text-sm text-neutral-500">No posts match your filters.</li>
            )}
          </ul>
        </div>
      </section>
    </>
  )
}
