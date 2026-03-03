import React from 'react'
import { MDXProvider as Provider } from '@mdx-js/react'

const components = {
  // Shiki formatting is handled at compile-time by rehype-pretty-code.
}

export default function MDXProvider({ children }) {
  return <Provider components={components}>{children}</Provider>
}
