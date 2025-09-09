import React from 'react'
import { MDXProvider as Provider } from '@mdx-js/react'
import CodeBlock from './CodeBlock'

// Wrap MDX's `pre > code` and hand it to our highlighter
function Pre(props) {
  const child = Array.isArray(props.children) ? props.children[0] : props.children
  const className = child?.props?.className || ''
  const code = (child?.props?.children ?? '').toString()
  if (child?.type === 'code') {
    return <CodeBlock className={className}>{code}</CodeBlock>
  }
  return <pre {...props} />
}

const components = {
  pre: Pre,          // handle fenced code blocks
  // (optional) leave inline code to Tailwind Typography; remove `code:` mapping
}

export default function MDXProvider({ children }) {
  return <Provider components={components}>{children}</Provider>
}
