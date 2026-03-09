import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(path, 'utf8')
}

test('app layout uses one shared theme class instead of route-specific duplicates', () => {
  const appSource = read('src/App.jsx')

  assert.doesNotMatch(appSource, /const isBlogList =/)
  assert.doesNotMatch(appSource, /const isBlogDetail =/)
  assert.doesNotMatch(appSource, /const isProjectsList =/)
  assert.doesNotMatch(appSource, /const isProjectDetail =/)
  assert.doesNotMatch(appSource, /const isResourcesList =/)
  assert.ok(appSource.includes('className={'))
  assert.ok(appSource.includes("isDark\n          ? 'min-h-svh bg-[#121b24] text-neutral-100'"))
  assert.ok(appSource.includes(": 'min-h-svh bg-[#e7f0f4] text-neutral-800'"))
  assert.match(appSource, /\? 'pt-1 pb-3 text-xs text-center text-neutral-500'/)
})

test('home page uses a shared theme map instead of separate dark and light trees', () => {
  const homeSource = read('src/pages/Home.jsx')

  assert.match(homeSource, /const homeTheme = \{/)
  assert.match(homeSource, /const t = isDark \? homeTheme\.dark : homeTheme\.light/)
  assert.doesNotMatch(homeSource, /if \(isDark\) \{/)
  assert.doesNotMatch(homeSource, /const lightPrimaryButton =/)
  assert.doesNotMatch(homeSource, /const lightSecondaryButton =/)
  assert.match(homeSource, /className=\{t\.navLink\}/)
  assert.match(homeSource, /className=\{t\.themeBtn\}/)
  assert.match(homeSource, /className=\{t\.primaryBtn\}/)
  assert.match(homeSource, /className=\{t\.secondaryBtn\}/)
  assert.match(homeSource, /className=\{\`mt-6 flex items-center justify-center gap-4 \$\{t\.socialGroup\}\`\}/)
})

test('app and post rendering are wrapped in shared error boundaries', () => {
  assert.ok(fs.existsSync('src/components/ErrorBoundary.jsx'))

  const boundarySource = read('src/components/ErrorBoundary.jsx')
  const appSource = read('src/App.jsx')
  const postSource = read('src/pages/Post.jsx')

  assert.match(boundarySource, /class ErrorBoundary extends Component/)
  assert.match(boundarySource, /static getDerivedStateFromError\(\)/)
  assert.match(boundarySource, /window\.location\.reload\(\)/)
  assert.match(appSource, /import ErrorBoundary from '\.\/components\/ErrorBoundary'/)
  assert.match(appSource, /<ErrorBoundary>\s*<BrowserRouter>/s)
  assert.match(appSource, /<ErrorBoundary>\s*<Outlet context=\{\{ isDark, onToggleTheme: toggleTheme \}\} \/>\s*<\/ErrorBoundary>/s)
  assert.match(postSource, /import ErrorBoundary from '\.\.\/components\/ErrorBoundary'/)
  assert.match(postSource, /<ErrorBoundary[\s\S]*<MDXProvider>\{MDX \? <MDX \/> : <PostBodyPlaceholder \/>\}<\/MDXProvider>[\s\S]*<\/ErrorBoundary>/)
  assert.match(postSource, /This post could not be rendered\./)
})

test('boot sequence does not enforce a minimum delay before showing content', () => {
  const appSource = read('src/App.jsx')
  const performanceSource = read('src/utils/performance.js')

  assert.match(performanceSource, /export const BOOT_MINIMUM_MS = 0/)
  assert.doesNotMatch(appSource, /getRemainingBootDelay/)
  assert.doesNotMatch(appSource, /window\.setTimeout\(\(\) => setIsBooting\(false\), remaining\)/)
  assert.match(appSource, /const finish = \(\) => setIsBooting\(false\)/)
  assert.match(appSource, /document\.addEventListener\('DOMContentLoaded', finish, \{ once: true \}\)/)
})

test('unused public photo png is removed from the repository', () => {
  assert.equal(fs.existsSync('public/photo.png'), false)
})

test('home float cards do not pin will-change outside active animation', () => {
  const cssSource = read('src/index.css')

  assert.match(cssSource, /\.home-float-card \{/)
  assert.match(cssSource, /\.home-float-card-dark \{/)
  assert.doesNotMatch(cssSource, /will-change: transform, opacity;/)
})

test('app uses the full site loader for real waits and no route entrance animation', () => {
  const appSource = read('src/App.jsx')

  assert.match(appSource, /function RouteLoader\(\)\s*\{\s*return <SiteLoader \/>\s*\}/s)
  assert.doesNotMatch(appSource, /AnimatePresence/)
  assert.doesNotMatch(appSource, /motion as Motion/)
  assert.doesNotMatch(appSource, /key=\{location\.pathname\}/)
  assert.doesNotMatch(appSource, /initial=\{shouldReduceMotion/)
  assert.doesNotMatch(appSource, /<Motion\.div/)
})

test('home page card renders without mount animation props', () => {
  const homeSource = read('src/pages/Home.jsx')

  assert.doesNotMatch(homeSource, /<Motion\.div[\s\S]*className=\{\`\$\{t\.card\} relative mx-auto w-full max-w-5xl rounded-\[30px\] p-4 sm:p-8 md:p-10`\}/)
  assert.doesNotMatch(homeSource, /initial=\{\{ opacity: 0, y: 8 \}\}/)
  assert.doesNotMatch(homeSource, /animate=\{\{ opacity: 1, y: 0 \}\}/)
  assert.doesNotMatch(homeSource, /transition=\{\{ duration: 0\.35 \}\}/)
})

test('blog page renders statically without mount and hover motion', () => {
  const blogSource = read('src/pages/Blog.jsx')

  assert.doesNotMatch(blogSource, /motion as Motion/)
  assert.doesNotMatch(blogSource, /useReducedMotion/)
  assert.doesNotMatch(blogSource, /const listAnimation =/)
  assert.doesNotMatch(blogSource, /const cardAnimation =/)
  assert.doesNotMatch(blogSource, /<Motion\.div/)
  assert.doesNotMatch(blogSource, /<Motion\.ul/)
  assert.doesNotMatch(blogSource, /<Motion\.li/)
  assert.doesNotMatch(blogSource, /whileHover=/)
  assert.doesNotMatch(blogSource, /layout="position"/)
  assert.doesNotMatch(blogSource, /transform-gpu will-change-transform/)
})
