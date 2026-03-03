import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'

const prettyCodeOptions = {
  theme: {
    light: 'github-dark',
    dark: 'github-dark',
  },
  keepBackground: false,
  defaultLang: 'txt',
  onVisitLine(node) {
    if (node.children.length === 0) node.children = [{ type: 'text', value: ' ' }]
  },
}

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
    }),
    react(),
  ],
})
