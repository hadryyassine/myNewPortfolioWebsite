import { useMemo } from 'react'
import { CornerUpLeft, FileText, Github } from 'lucide-react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'
import {
  allProjectCategories,
  allProjectTags,
  projects,
} from '../projects/projects'

function toggleSet(arr, value) {
  const set = new Set(arr)
  set.has(value) ? set.delete(value) : set.add(value)
  return Array.from(set)
}

function formatProjectDate(dateInput) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
    .format(new Date(dateInput))
    .toUpperCase()
}

export default function Projects() {
  const outletContext = useOutletContext() || {}
  const isDark = outletContext.isDark || false
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const selectedCategories = params.getAll('cat')
  const selectedTags = params.getAll('tag')
  const space = useViewportSpace()

  const filtered = useMemo(() => {
    const norm = (s) =>
      (s || '')
        .toString()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()

    const tokens = norm(q).split(/\s+/).filter(Boolean)

    return projects.filter((project) => {
      const hay = norm(
        [
          project.title,
          project.summary,
          ...(project.categories || []),
          ...(project.tags || []),
        ].join(' ')
      )

      const matchesQuery =
        tokens.length === 0 ? true : tokens.every((token) => hay.includes(token))

      const matchesCategories =
        selectedCategories.length === 0
          ? true
          : project.categories.some((category) => selectedCategories.includes(category))

      const matchesTags =
        selectedTags.length === 0
          ? true
          : project.tags.some((tag) => selectedTags.includes(tag))

      return matchesQuery && matchesCategories && matchesTags
    })
  }, [q, selectedCategories, selectedTags])

  return (
    <>
      <SEO title="Projects" url={`${site.baseUrl}/projects`} />

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
              Projects
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
                    next.delete('tag')
                    setParams(next, { replace: true })
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-150 ease-out ${
                    selectedCategories.length === 0 && selectedTags.length === 0
                      ? 'bg-[#6f9ca2] text-white'
                      : isDark
                        ? 'text-[#90a2ae] hover:bg-[#253540]'
                        : 'text-[#6c7f88] hover:bg-[#eef3f5]'
                  }`}
                  title="Show all"
                >
                  All
                </button>

                {allProjectCategories.map((category) => {
                  const active = selectedCategories.includes(category)
                  return (
                    <button
                      key={`cat-${category}`}
                      onClick={() => {
                        const next = new URLSearchParams(params)
                        const nextCats = toggleSet(selectedCategories, category)
                        next.delete('cat')
                        nextCats.forEach((value) => next.append('cat', value))
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
                      {category}
                    </button>
                  )
                })}

                {allProjectTags.map((tag) => {
                  const active = selectedTags.includes(tag)
                  return (
                    <button
                      key={`tag-${tag}`}
                      onClick={() => {
                        const next = new URLSearchParams(params)
                        const nextTags = toggleSet(selectedTags, tag)
                        next.delete('tag')
                        nextTags.forEach((value) => next.append('tag', value))
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
                      {tag}
                    </button>
                  )
                })}

                {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                  <button
                    onClick={() => {
                      const next = new URLSearchParams(params)
                      next.delete('cat')
                      next.delete('tag')
                      setParams(next, { replace: true })
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-150 ease-out ${
                      isDark ? 'text-[#90a2ae] hover:bg-[#253540]' : 'text-[#6c7f88] hover:bg-[#eef3f5]'
                    }`}
                    title="Clear filters"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <ul className="mt-6 grid gap-4">
            {filtered.map((project) => (
              <li
                key={project.slug}
                className={`rounded-2xl p-5 transition-all duration-200 hover:-translate-y-[2px] ${
                  isDark
                    ? 'bg-[#15212a]/88 shadow-[0_8px_26px_rgba(0,0,0,0.24)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.34)]'
                    : 'bg-[#f5f8fa] shadow-[0_12px_32px_rgba(53,80,90,0.14)] hover:shadow-[0_18px_40px_rgba(53,80,90,0.22)]'
                }`}
              >
                <div
                  className={`text-[9px] uppercase tracking-[0.16em] ${
                    isDark ? 'text-[#7f94a1]' : 'text-[#8b9aa1]'
                  }`}
                >
                  {formatProjectDate(project.date)}
                </div>

                <h2 className={`mt-2 text-xl font-semibold break-words ${isDark ? 'text-[#edf3f8]' : 'text-[#1f3036]'}`}>
                  <Link to={project.url} className="hover:underline">
                    {project.title}
                  </Link>
                </h2>

                <p className={`mt-2 ${isDark ? 'text-[#b8c7d0]' : 'text-[#4d626b]'}`}>
                  {project.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.categories.map((category) => (
                    <span
                      key={`cat-${project.slug}-${category}`}
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDark ? 'bg-[#23333d] text-[#c6d4dc]' : 'bg-[#edf1f3] text-[#5d727b]'
                      }`}
                    >
                      {category}
                    </span>
                  ))}
                  {project.tags.map((tag) => (
                    <span
                      key={`tag-${project.slug}-${tag}`}
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDark ? 'bg-[#23333d] text-[#c6d4dc]' : 'bg-[#edf1f3] text-[#5d727b]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <Link
                    to={project.url}
                    aria-label={`View ${project.title} case study`}
                    title="Case study"
                    className={`h-8 w-8 flex items-center justify-center ${
                      isDark ? 'text-[#90a2ae] hover:text-[#e0edf4]' : 'text-[#6a7d86] hover:text-[#2d444d]'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Case study</span>
                  </Link>

                  {project.links.repo && (
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title} GitHub repository`}
                      title="GitHub"
                      className={`h-8 w-8 flex items-center justify-center ${
                        isDark ? 'text-[#90a2ae] hover:text-[#e0edf4]' : 'text-[#6a7d86] hover:text-[#2d444d]'
                      }`}
                    >
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  )}

                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-150 ease-out ${
                        isDark
                          ? 'text-[#c5d5de] bg-[#20303a] hover:bg-[#2a3d48]'
                          : 'text-[#39535d] bg-[#e9f0f4] hover:bg-[#dfeaf0]'
                      }`}
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </li>
            ))}

            {filtered.length === 0 && (
              <li
                className={`rounded-2xl p-8 text-center ${
                  isDark
                    ? 'bg-[#15212a]/85 text-[#a2b3bf] shadow-[0_8px_26px_rgba(0,0,0,0.24)]'
                    : 'bg-[#f5f8fa] text-[#5f7680] shadow-[0_12px_32px_rgba(53,80,90,0.14)]'
                }`}
              >
                No projects match the selected filters.
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  )
}
