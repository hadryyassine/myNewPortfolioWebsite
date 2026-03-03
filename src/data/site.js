// src/data/site.js
const siteUrlFromEnv = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '')

const site = {
  name: 'Yassine Hadry',
  title: 'Yassine Hadry — Software Engineer',
  description:
    'Software Engineer focused on DevOps/OCI. Clean, calm systems. Writing about Kubernetes, CI/CD, and engineering.',
  baseUrl: siteUrlFromEnv || 'http://localhost:5173',
  locale: 'en_US',
  authorName: 'Yassine Hadry',
  authorUrl: 'https://www.linkedin.com/in/yassine-hadry/',
  twitter: '@YassineHadry1',
  ogImage: '/og.png',
}

export default site
