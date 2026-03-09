import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'
import MDXProvider from '../components/MDXProvider'
import { posts } from '../blog/posts'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'
import { Link } from 'react-router-dom'
import { CornerUpLeft } from 'lucide-react'

function PostBodyPlaceholder() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-6 w-3/4 rounded-full bg-[#e6edf1] dark:bg-[#22323b]" />
      <div className="h-4 w-full rounded-full bg-[#edf3f6] dark:bg-[#1c2a33]" />
      <div className="h-4 w-11/12 rounded-full bg-[#edf3f6] dark:bg-[#1c2a33]" />
      <div className="h-4 w-5/6 rounded-full bg-[#edf3f6] dark:bg-[#1c2a33]" />
    </div>
  )
}

export default function Post() {
  const { slug } = useParams()
  const meta = useMemo(() => posts.find((p) => p.slug === slug), [slug])
  const space = useViewportSpace()
  const MDX = meta?.component || null

  if (!meta) {
    return (
      <section className="py-20 text-center text-neutral-500">Post not found.</section>
    )
  }

  const url = `${site.baseUrl}${meta.url}`
  const publishedTime = Number.isNaN(Date.parse(meta.date))
    ? undefined
    : new Date(meta.date).toISOString()
  const postKeywords = Array.isArray(meta.keywords)
    ? meta.keywords.filter(Boolean)
    : []
  const postJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.summary || site.description,
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      '@type': 'Person',
      name: site.authorName,
      url: site.authorUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    image: `${site.baseUrl}${site.ogImage}`,
    keywords: postKeywords.join(', '),
    articleSection: meta.categories,
  }

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.summary || site.description}
        url={url}
        type="article"
        keywords={postKeywords}
        publishedTime={publishedTime}
        modifiedTime={publishedTime}
        jsonLd={postJsonLd}
      />

      <section
        style={space ? { minHeight: `${space}px` } : undefined}
        className="flex items-start py-4 sm:py-6"
      >
        <div className="w-full rounded-2xl bg-[#f8fafb] dark:bg-[#15212a] p-4 sm:p-6 md:p-7 shadow-[0_14px_34px_rgba(53,80,90,0.18)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.35)]">
          <article className="project-prose prose prose-neutral dark:prose-invert max-w-none w-full">
            <div className="not-prose mb-4">
              <Link
                to="/blog"
                className="h-8 w-8 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                aria-label="Back to blog"
                title="Back to blog"
              >
                <CornerUpLeft className="w-4 h-4" />
                <span className="sr-only">Back to blog</span>
              </Link>
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
              <div className="mt-3 flex flex-wrap gap-2">
                {meta.categories.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-2 py-1 rounded-full bg-[#edf1f3] text-[#5d727b] dark:bg-[#23333d] dark:text-[#c6d4dc]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </header>
            <ErrorBoundary
              fallback={
                <div className="py-8 text-center text-neutral-500">
                  <p>This post could not be rendered.</p>
                </div>
              }
            >
              <MDXProvider>{MDX ? <MDX /> : <PostBodyPlaceholder />}</MDXProvider>
            </ErrorBoundary>
          </article>
        </div>
      </section>
    </>
  )
}
