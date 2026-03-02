import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const blogDir = path.join(root, 'src', 'blog')
const projectsDir = path.join(root, 'src', 'projects')

const baseUrl = (process.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/+$/, '')

function formatDate(input) {
  return new Date(input).toISOString().split('T')[0]
}

async function readMdxSlugs(dirPath, prefix, { excludeIndex = new Set() } = {}) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => entry.name)
    .filter((name) => !excludeIndex.has(name))

  const routes = []

  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    const raw = await fs.readFile(fullPath, 'utf8')
    // Skip draft blog posts when frontmatter contains "draft: true".
    if (/^\s*draft:\s*true\s*$/m.test(raw)) continue

    const stat = await fs.stat(fullPath)
    const slug = file.replace(/\.mdx$/, '')
    routes.push({
      loc: `${baseUrl}${prefix}/${slug}`,
      lastmod: formatDate(stat.mtime),
    })
  }

  return routes
}

async function generateSitemap() {
  const staticRoutes = [
    { loc: `${baseUrl}/`, priority: '1.0' },
    { loc: `${baseUrl}/blog`, priority: '0.8' },
  ]

  const blogRoutes = await readMdxSlugs(blogDir, '/blog', {
    excludeIndex: new Set(['posts.mdx']),
  })

  const projectRoutes = await readMdxSlugs(projectsDir, '/projects')

  const allRoutes = [
    ...staticRoutes.map((route) => ({
      ...route,
      lastmod: formatDate(Date.now()),
      changefreq: 'weekly',
    })),
    ...blogRoutes.map((route) => ({ ...route, priority: '0.7', changefreq: 'monthly' })),
    ...projectRoutes.map((route) => ({ ...route, priority: '0.6', changefreq: 'monthly' })),
  ]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allRoutes.map(
      (route) =>
        [
          '  <url>',
          `    <loc>${route.loc}</loc>`,
          `    <lastmod>${route.lastmod}</lastmod>`,
          `    <changefreq>${route.changefreq}</changefreq>`,
          `    <priority>${route.priority}</priority>`,
          '  </url>',
        ].join('\n')
    ),
    '</urlset>',
    '',
  ].join('\n')

  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')
}

async function generateRobots() {
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n')

  await fs.writeFile(path.join(publicDir, 'robots.txt'), robots, 'utf8')
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true })
  await generateSitemap()
  await generateRobots()
  console.log(`Generated SEO files with base URL: ${baseUrl}`)
}

main().catch((error) => {
  console.error('Failed to generate SEO files:', error)
  process.exit(1)
})
