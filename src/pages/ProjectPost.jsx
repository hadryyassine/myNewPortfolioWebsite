import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CornerUpLeft, ExternalLink, Github } from 'lucide-react'
import MDXProvider from '../components/MDXProvider'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'
import { projects } from '../projects/projects'

export default function ProjectPost() {
  const { slug } = useParams()
  const space = useViewportSpace()
  const meta = useMemo(() => projects.find((project) => project.slug === slug), [slug])

  if (!meta) {
    return (
      <section className="py-20 text-center text-neutral-500">Project not found.</section>
    )
  }

  const MDX = meta.component
  const url = `${site.baseUrl}${meta.url}`
  const publishedTime = Number.isNaN(Date.parse(meta.date))
    ? undefined
    : new Date(meta.date).toISOString()
  const projectKeywords = [...(meta.categories || []), ...(meta.tags || [])].filter(Boolean)
  const relatedLinks = [meta.links.demo, meta.links.repo].filter(Boolean)
  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': meta.links.repo ? 'SoftwareSourceCode' : 'CreativeWork',
    name: meta.title,
    description: meta.summary || site.description,
    datePublished: publishedTime,
    dateModified: publishedTime,
    creator: {
      '@type': 'Person',
      name: site.authorName,
      url: site.authorUrl,
    },
    url,
    image: `${site.baseUrl}${site.ogImage}`,
    keywords: projectKeywords.join(', '),
    ...(meta.links.repo ? { codeRepository: meta.links.repo } : {}),
    ...(relatedLinks.length ? { sameAs: relatedLinks } : {}),
  }

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.summary || site.description}
        url={url}
        type="article"
        keywords={projectKeywords}
        publishedTime={publishedTime}
        modifiedTime={publishedTime}
        jsonLd={projectJsonLd}
      />

      <section
        style={space ? { minHeight: `${space}px` } : undefined}
        className="flex items-start py-4 sm:py-6"
      >
        <div className="w-full rounded-2xl bg-[#f8fafb] dark:bg-[#15212a] p-4 sm:p-6 md:p-7 shadow-[0_14px_34px_rgba(53,80,90,0.18)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.35)]">
          <article className="project-prose prose prose-neutral dark:prose-invert max-w-none w-full">
            <div className="not-prose mb-4 flex flex-wrap items-center gap-2">
              <Link
                to="/projects"
                className="h-8 w-8 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                aria-label="Back to projects"
                title="Back to projects"
              >
                <CornerUpLeft className="w-4 h-4" />
                <span className="sr-only">Back to projects</span>
              </Link>

              {meta.links.repo && (
                <a
                  href={meta.links.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  aria-label="Open GitHub repository"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              )}

              {meta.links.demo && (
                <a
                  href={meta.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  aria-label="Open live demo"
                  title="Live demo"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="sr-only">Live demo</span>
                </a>
              )}
            </div>

            <header className="not-prose mb-8">
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#8b9aa1] dark:text-[#7f94a1]">
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })
                  .format(new Date(meta.date))
                  .toUpperCase()}
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1 break-words">
                {meta.title}
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{meta.summary}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {meta.categories.map((category) => (
                  <span
                    key={`cat-${category}`}
                    className="text-xs px-2 py-1 rounded-full bg-[#edf1f3] text-[#5d727b] dark:bg-[#23333d] dark:text-[#c6d4dc]"
                  >
                    {category}
                  </span>
                ))}
                {meta.tags.map((tag) => (
                  <span
                    key={`tag-${tag}`}
                    className="text-xs px-2 py-1 rounded-full bg-[#edf1f3] text-[#5d727b] dark:bg-[#23333d] dark:text-[#c6d4dc]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <MDXProvider>{MDX ? <MDX /> : <div>Loading...</div>}</MDXProvider>
          </article>
        </div>
      </section>
    </>
  )
}
