// src/App.jsx
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import useDarkMode from './hooks/useDarkMode'
import Header from './components/Header'
import SiteLoader from './components/SiteLoader'
import Home from './pages/Home'
import Blog from './pages/Blog'
import UnderConstruction from './pages/UnderConstruction'
import NotFound from './pages/NotFound'
import { getRemainingBootDelay, preloadImage, runWhenIdle } from './utils/performance'

const Post = lazy(() => import('./pages/Post'))
const ProjectPost = lazy(() => import('./pages/ProjectPost'))

function RouteLoader() {
  return (
    <div className="py-12">
      <SiteLoader compact />
    </div>
  )
}

function Layout() {
  const [isDark, setIsDark] = useDarkMode(false)
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()
  const isHome = location.pathname === '/'
  const isBlogList = location.pathname === '/blog'
  const isBlogDetail = location.pathname.startsWith('/blog/') && location.pathname !== '/blog'
  const isProjectsList = location.pathname === '/projects'
  const isProjectDetail =
    location.pathname.startsWith('/projects/') && location.pathname !== '/projects'
  const isResourcesList = location.pathname === '/resources'
  const toggleTheme = () => setIsDark((v) => !v)

  return (
    <div
      className={
        isHome
          ? isDark
            ? 'min-h-svh bg-[#121b24] text-neutral-100'
            : 'min-h-svh bg-[#e7f0f4] text-neutral-800'
          : isBlogList
            ? isDark
              ? 'min-h-svh bg-[#121b24] text-neutral-100'
              : 'min-h-svh bg-[#e7f0f4] text-neutral-800'
          : isBlogDetail
            ? isDark
              ? 'min-h-svh bg-[#121b24] text-neutral-100'
              : 'min-h-svh bg-[#e7f0f4] text-neutral-800'
          : isProjectsList
            ? isDark
              ? 'min-h-svh bg-[#121b24] text-neutral-100'
              : 'min-h-svh bg-[#e7f0f4] text-neutral-800'
          : isProjectDetail
            ? isDark
              ? 'min-h-svh bg-[#121b24] text-neutral-100'
              : 'min-h-svh bg-[#e7f0f4] text-neutral-800'
          : isResourcesList
            ? isDark
              ? 'min-h-svh bg-[#121b24] text-neutral-100'
              : 'min-h-svh bg-[#e7f0f4] text-neutral-800'
          : 'min-h-svh bg-white text-neutral-800 dark:bg-neutral-950 dark:text-neutral-100'
      }
    >

      {!isHome && (
        <div id="site-header">
          <Header isDark={isDark} onToggleTheme={toggleTheme} />
        </div>
      )}

      <main
        className={`${isHome ? 'px-2 sm:px-3 md:px-4' : 'max-w-5xl mx-auto px-4'} ${isHome ? 'relative z-[1]' : ''}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <Motion.div
            key={location.pathname}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <Outlet context={{ isDark, onToggleTheme: toggleTheme }} />
          </Motion.div>
        </AnimatePresence>
      </main>

      <footer
        id="site-footer"
        className={
          isHome
            ? `pt-1 pb-3 text-xs text-center ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`
            : 'max-w-5xl mx-auto px-4 py-10 text-sm text-neutral-500 dark:text-neutral-400'
        }
      >
        © {new Date().getFullYear()} Yassine Hadry. All rights reserved.
      </footer>
    </div>
  )
}



export default function App() {
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    const startedAt = Date.now()
    let timeoutId
    let cancelIdleWarmup = () => {}

    const primeImages = ['/profile.jpg', '/logo-yh.png', '/logo-yh-white.png']
    cancelIdleWarmup = runWhenIdle(() => {
      primeImages.forEach(preloadImage)
    })

    const finishBoot = () => {
      const remaining = getRemainingBootDelay(startedAt)
      timeoutId = window.setTimeout(() => setIsBooting(false), remaining)
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', finishBoot, { once: true })
    } else finishBoot()

    return () => {
      document.removeEventListener('DOMContentLoaded', finishBoot)
      cancelIdleWarmup()
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [])

  if (isBooting) return <SiteLoader />

  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route
              path="/projects"
              element={<UnderConstruction section="Projects" path="/projects" />}
            />
            <Route
              path="/resources"
              element={<UnderConstruction section="Resources" path="/resources" />}
            />
            <Route path="/blog/:slug" element={<Post />} />
            <Route path="/projects/:slug" element={<ProjectPost />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
