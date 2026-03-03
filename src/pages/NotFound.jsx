import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'

export default function NotFound() {
  const space = useViewportSpace()

  return (
    <>
      <SEO
        title="404"
        description="The page you are looking for does not exist."
        url={`${site.baseUrl}/404`}
        noindex
      />

      <section
        style={space ? { minHeight: `${space}px` } : undefined}
        className="flex items-start sm:items-center py-4 sm:py-0"
      >
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 text-center">
          <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">Not Found</div>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">404</h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            This page does not exist or was moved.
          </p>

          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
