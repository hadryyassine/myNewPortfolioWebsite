import fs from 'node:fs'

const postPath = 'src/blog/deploying-without-crying-deployment-strategies-for-peaceful-nights.mdx'
const slideComponentPath = 'src/components/SlideDeck.jsx'

function fail(message) {
  console.error(`FAIL: ${message}`)
  process.exit(1)
}

if (!fs.existsSync(postPath)) fail(`Missing ${postPath}`)
if (!fs.existsSync(slideComponentPath)) fail(`Missing ${slideComponentPath}`)

const post = fs.readFileSync(postPath, 'utf8')

const requiredStrings = [
  'date: 2026-02-26',
  'Deploying Without Crying: Deployment Strategies for Peaceful Nights',
  "import SlideDeck from '../components/SlideDeck'",
  '<SlideDeck',
  'youtube.com/embed/AXqXPerHiok',
  'Big Bang',
  'Rolling',
  'Blue/Green',
  'Canary',
  'Feature Toggle',
  'https://github.com/hadryyassine/Deploying-without-crying-demos',
  "style={{ height: 'clamp(420px, 70vh, 760px)' }}",
]

for (const snippet of requiredStrings) {
  if (!post.includes(snippet)) fail(`Post missing required content: ${snippet}`)
}

const slideDeck = fs.readFileSync(slideComponentPath, 'utf8')
if (!slideDeck.includes('const slideAspectRatio = 16 / 9')) {
  fail('SlideDeck missing locked slide aspect ratio')
}
if (!slideDeck.includes('style={{ aspectRatio: slideAspectRatio }}')) {
  fail('SlideDeck missing aspect-ratio wrapper for exact slide sizing')
}

console.log('PASS: deployment blog verification checks passed')
