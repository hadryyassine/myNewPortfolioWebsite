import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'

export default function CodeBlock({ className = '', children }) {
  const raw = typeof children === 'string' ? children : String(children || '')
  const code = raw.trim()
  const lang = className?.startsWith('language-')
    ? className.replace('language-', '')
    : null

  if (!lang) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-[0.9em]">
        {children}
      </code>
    )
  }

  const isDark = document.documentElement.classList.contains('dark')
  const theme = isDark ? themes.nightOwl : themes.github

  const copy = async () => { try { await navigator.clipboard.writeText(code) } catch {} }

  return (
    <div className="relative group not-prose">
      <button
        onClick={copy}
        className="absolute right-2 top-2 text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition"
        aria-label="Copy code"
      >
        Copy
      </button>

      <Highlight code={code} language={lang} theme={theme}>
        {({ className: cls, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`not-prose ${cls} overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-800 p-4`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
