// src/App.jsx
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect, useState } from 'react'
import useDarkMode from './hooks/useDarkMode'
import Header from './components/Header'
import ErrorBoundary from './components/ErrorBoundary'
import SiteLoader from './components/SiteLoader'
import Home from './pages/Home'
import Blog from './pages/Blog'
import UnderConstruction from './pages/UnderConstruction'
import NotFound from './pages/NotFound'
import { preloadImage, runWhenIdle } from './utils/performance'

const Post = lazy(() => import('./pages/Post'))
const ProjectPost = lazy(() => import('./pages/ProjectPost'))

function RouteLoader() {
  return <SiteLoader />
}

function Layout() {
  const [isDark, setIsDark] = useDarkMode(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const toggleTheme = () => setIsDark((v) => !v)

  return (
    <div
      className={
        isDark
          ? 'min-h-svh bg-[#121b24] text-neutral-100'
          : 'min-h-svh bg-[#e7f0f4] text-neutral-800'
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
        <ErrorBoundary>
          <Outlet context={{ isDark, onToggleTheme: toggleTheme }} />
        </ErrorBoundary>
      </main>

      <footer
        id="site-footer"
        className={
          isHome
            ? 'pt-1 pb-3 text-xs text-center text-neutral-500'
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
    const cancelIdleWarmup = runWhenIdle(() => {
      ['/profile.jpg', '/logo-yh.png', '/logo-yh-white.png'].forEach(preloadImage)
    })

    const finish = () => setIsBooting(false)

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', finish, { once: true })
    } else {
      finish()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', finish)
      cancelIdleWarmup()
    }
  }, [])

  if (isBooting) return <SiteLoader />

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}
