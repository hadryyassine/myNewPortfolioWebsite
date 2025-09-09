import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import MDXProvider from '../components/MDXProvider'
import { posts } from '../blog/posts'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const modules = import.meta.glob('../blog/**/*.mdx')

export default function Post() {
  const { slug } = useParams()
  const meta = useMemo(() => posts.find((p) => p.slug === slug), [slug])
  const [MDX, setMDX] = useState(null)
  const space = useViewportSpace()

  useEffect(() => {
    const key = Object.keys(modules).find((k) => k.includes(`${slug}.mdx`))
    if (key) modules[key]().then((m) => setMDX(() => m.default))
  }, [slug])

  if (!meta) {
    return (
      <section className="py-20 text-center text-neutral-500">Post not found.</section>
    )
  }

  const url = `${site.baseUrl}${meta.url}`

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.summary || site.description}
        url={url}
        type="article"
      />

      {/* Center article vertically when short; allow natural flow when long */}
      <section
        style={space ? { minHeight: `${space}px` } : undefined}
        className="flex items-center"
      >
        <article className="prose prose-neutral dark:prose-invert max-w-none w-full">
          {/* Back to Blog */}
          <div className="not-prose mb-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              aria-label="Back to blog"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
          <header className="not-prose mb-6">
            <div className="text-sm text-neutral-500">
              {new Date(meta.date).toDateString()}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mt-1">{meta.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {meta.categories.map((c) => (
                <span
                  key={c}
                  className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800"
                >
                  {c}
                </span>
              ))}
            </div>
          </header>

          <MDXProvider>{MDX ? <MDX /> : <div>Loading…</div>}</MDXProvider>
        </article>
      </section>
    </>
  )
}
