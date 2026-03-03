const modules = import.meta.glob('./**/*.mdx', { eager: true })

function toSlug(path) {
  return path
    .replace(/^\.\/|\.mdx$/g, '')
    .replace(/^\//, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

export const projects = Object.entries(modules)
  .map(([path, mod]) => {
    const fm = mod.frontmatter || {}
    const slug = toSlug(path.replace('./', ''))
    return {
      slug,
      url: `/projects/${slug}`,
      title: fm.title ?? 'Untitled Project',
      date: fm.date ?? '1970-01-01',
      categories: fm.categories ?? [],
      tags: fm.tags ?? [],
      summary: fm.summary ?? '',
      draft: fm.draft ?? false,
      component: mod.default,
      links: {
        repo: fm.repo ?? '',
        demo: fm.demo ?? '',
      },
    }
  })
  .filter((project) => !project.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export const allProjectCategories = Array.from(
  projects.reduce((set, project) => {
    project.categories.forEach((category) => set.add(category))
    return set
  }, new Set())
).sort()

export const allProjectTags = Array.from(
  projects.reduce((set, project) => {
    project.tags.forEach((tag) => set.add(tag))
    return set
  }, new Set())
).sort()
