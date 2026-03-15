import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(path, 'utf8')
}

test('env files use the new production domain', () => {
  const envSource = read('.env')
  const envExampleSource = read('.env.example')

  assert.match(envSource, /VITE_SITE_URL=https:\/\/hadryyassine\.dev/)
  assert.match(envExampleSource, /VITE_SITE_URL=https:\/\/hadryyassine\.dev/)
})

test('slide deck removes the large inactive explainer while keeping activation labels', () => {
  const slideDeckSource = read('src/components/SlideDeck.jsx')

  assert.match(slideDeckSource, /Interactive deck/)
  assert.match(slideDeckSource, /Load slides/)
  assert.doesNotMatch(
    slideDeckSource,
    /Open the slide deck only when you want it, so the article feels faster on first load\./
  )
})

test('info dialog uses the updated header and content spacing', () => {
  const homeSource = read('src/pages/Home.jsx')

  assert.match(homeSource, /px-7 pt-6 pb-5/)
  assert.match(homeSource, /border-b-\[0\.5px\] border-b-\[var\(--color-border-tertiary\)\]/)
  assert.match(homeSource, /max-h-\[min\(70vh,calc\(100vh-160px\)\)\] overflow-y-auto px-7 pt-7 pb-8/)
  assert.match(homeSource, /text-\[17px\] font-medium/)
})

test('timeline uses the expanded entry spacing and connector styling', () => {
  const timelineSource = read('src/components/Timeline.jsx')

  assert.match(timelineSource, /gap-4/)
  assert.match(timelineSource, /pb-9/)
  assert.match(timelineSource, /h-\[10px\] w-\[10px\] rounded-full border-2 border-\[var\(--color-border-secondary\)\] bg-transparent/)
  assert.match(timelineSource, /mt-1\.5 w-px flex-1 bg-\[var\(--color-border-tertiary\)\]/)
  assert.match(timelineSource, /mb-2 text-\[12px\] text-\[var\(--color-text-tertiary\)\]/)
  assert.match(timelineSource, /mb-1 text-\[15px\] font-medium text-\[var\(--color-text-primary\)\]/)
  assert.match(timelineSource, /mb-3 text-\[13px\] text-\[var\(--color-text-secondary\)\]/)
  assert.match(timelineSource, /mb-4 text-\[13px\] leading-\[1\.6\] text-\[var\(--color-text-secondary\)\]/)
  assert.match(timelineSource, /gap-1\.5/)
  assert.match(timelineSource, /rounded-full border-\[0\.5px\] border-\[var\(--color-border-secondary\)\] bg-\[var\(--color-background-secondary\)\]/)
})
