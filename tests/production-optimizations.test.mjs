import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(path, 'utf8')
}

test('skills icons are not lazy-loaded in the home skills panel', () => {
  const homeSource = read('src/pages/Home.jsx')

  assert.doesNotMatch(homeSource, /loading="lazy"/)
})

test('blog cards avoid transition-all for smoother rendering', () => {
  const blogSource = read('src/pages/Blog.jsx')

  assert.doesNotMatch(blogSource, /transition-all/)
})

test('app boot flow no longer waits for full window load', () => {
  const appSource = read('src/App.jsx')

  assert.doesNotMatch(appSource, /window\.addEventListener\('load'/)
  assert.doesNotMatch(appSource, /document\.readyState === 'complete'/)
})

test('deployment blog uses a lightweight YouTube component instead of a direct iframe', () => {
  const postSource = read('src/blog/deploying-without-crying-deployment-strategies-for-peaceful-nights.mdx')

  assert.match(postSource, /import LiteYouTubeEmbed from '\.\.\/components\/LiteYouTubeEmbed'/)
  assert.doesNotMatch(postSource, /<iframe/)
  assert.match(postSource, /<LiteYouTubeEmbed/)
})

test('slide deck has an explicit lightweight activation state', () => {
  const slideDeckSource = read('src/components/SlideDeck.jsx')

  assert.match(slideDeckSource, /Load slides/)
  assert.match(slideDeckSource, /const \[isActivated, setIsActivated\]/)
})

test('blog post assets use webp images for lighter production payloads', () => {
  const startupPostSource = read('src/blog/how-can-15-years-old-kids-launch-a-startup.mdx')
  const deploymentPostSource = read(
    'src/blog/deploying-without-crying-deployment-strategies-for-peaceful-nights.mdx'
  )

  assert.match(startupPostSource, /startup-kids-journey-1\.webp/)
  assert.match(startupPostSource, /startup-kids-journey-2\.webp/)
  assert.match(deploymentPostSource, /imageExtension=\{"webp"\}/)
})

test('optimized webp blog assets exist on disk', () => {
  assert.ok(fs.existsSync('public/blog/startup-kids-journey-1.webp'))
  assert.ok(fs.existsSync('public/blog/startup-kids-journey-2.webp'))
  assert.ok(fs.existsSync('public/blog/slides-blog-deployment-without-crying/slide-01.webp'))
  assert.ok(fs.existsSync('public/blog/slides-blog-deployment-without-crying/slide-26.webp'))
})

test('unused jpg and jpeg blog copies are removed after webp migration', () => {
  assert.equal(fs.existsSync('public/blog/startup-kids-journey-1.jpeg'), false)
  assert.equal(fs.existsSync('public/blog/startup-kids-journey-2.jpeg'), false)
  assert.equal(fs.existsSync('public/blog/slides-blog-deployment-without-crying/slide-01.jpg'), false)
  assert.equal(fs.existsSync('public/blog/slides-blog-deployment-without-crying/slide-26.jpg'), false)
})
