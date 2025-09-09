// src/App.jsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import useDarkMode from './hooks/useDarkMode'
import Header from './components/Header'
import Home from './pages/Home'
import Blog from './pages/Blog'
import SEO from './components/SEO'         // ← add
import site from './data/site'             // ← add

const Post = lazy(() => import('./pages/Post'))

function Layout() {
  const [isDark, setIsDark] = useDarkMode(false)

  return (
    <div className="min-h-svh bg-white text-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
      <SEO title="" url={site.baseUrl} />

      <div id="site-header">
        <Header isDark={isDark} onToggleTheme={() => setIsDark((v) => !v)} />
      </div>

      {/* keep your original width container for pages */}
      <main className="max-w-5xl mx-auto px-4">
        <Outlet />
      </main>

      <footer
        id="site-footer"
        className="max-w-5xl mx-auto px-4 py-10 text-sm text-neutral-500 dark:text-neutral-400"
      >
        © {new Date().getFullYear()} Yassine Hadry. All rights reserved.
      </footer>
    </div>
  )
}



export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Post />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
