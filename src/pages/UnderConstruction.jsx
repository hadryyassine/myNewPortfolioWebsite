import { Hammer } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'

export default function UnderConstruction({ section = 'This page', path = '/' }) {
  const outletContext = useOutletContext() || {}
  const isDark = outletContext.isDark || false
  const space = useViewportSpace()

  const cardClass = isDark
    ? 'home-float-card-dark relative mx-auto w-full max-w-3xl rounded-[30px] p-6 sm:p-10'
    : 'home-float-card relative mx-auto w-full max-w-3xl rounded-[30px] p-6 sm:p-10'

  const titleClass = isDark ? 'text-[#eef4f8]' : 'text-[#1f2f35]'
  const bodyClass = isDark ? 'text-[#a9bac5]' : 'text-[#5f7580]'
  const ctaClass = isDark
    ? 'inline-flex items-center rounded-full border border-[#2f3b44] bg-[#1b242b] px-5 py-2.5 text-[#cad6de] transition-colors hover:bg-[#232f38]'
    : 'inline-flex items-center rounded-full border border-[#d7d9d6] bg-[#f1f2ee] px-5 py-2.5 text-[#314148] transition-colors hover:bg-[#e9ece7]'

  return (
    <>
      <SEO title={` (Under Construction)`} url={``} noindex />

      <section
        style={space ? { minHeight: `${space}px` } : undefined}
        className="flex items-center justify-center py-4 sm:py-6"
      >
        <div className={cardClass}>
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                isDark ? 'bg-[#22303a] text-[#dce7ee]' : 'bg-[#eef3f5] text-[#3f5661]'
              }`}
            >
              <Hammer className="h-8 w-8" />
            </div>

            <h1 className={`mt-5 text-3xl font-semibold tracking-tight sm:text-4xl ${titleClass}`}>
              {section} is under construction
            </h1>

            <p className={`mt-3 max-w-lg leading-relaxed ${bodyClass}`}>
              I&apos;m working on this section and will publish it soon. Thanks for your patience.
            </p>

            <Link to="/" className={`mt-7 ${ctaClass}`}>
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
