const modules = import.meta.glob('./**/*.mdx', { eager: true })

function estimateReadingTime(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(3, Math.round(words / 180))
  return `${minutes} min read`
}

function toSlug(path) {
  return path
    .replace(/^\.\/|\.mdx$/g, '')
    .replace(/^\//, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

export const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const fm = mod.frontmatter || {}
    return {
      slug: toSlug(path.replace('./', '')),
      url: '/blog/' + toSlug(path.replace('./', '')),
      title: fm.title ?? 'Untitled',
      date: fm.date ?? '1970-01-01',
      categories: fm.categories ?? [],
      keywords: fm.keywords ?? [],
      summary: fm.summary ?? '',
      readingTime: fm.readingTime ?? estimateReadingTime(fm.summary ?? ''),
      draft: fm.draft ?? false,
      component: mod.default, 
    }
  })
  .filter((p) => !p.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export const allCategories = Array.from(
  posts.reduce((set, p) => {
    p.categories.forEach((c) => set.add(c))
    return set
  }, new Set())
).sort()
