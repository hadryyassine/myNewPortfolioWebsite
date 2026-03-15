import { motion as Motion } from 'framer-motion'
import { formatExperienceDuration } from '../utils/experienceDuration'

function splitTitleAndQualifier(title = '') {
  const match = title.match(/^(.*?)(\s*\([^()]+\))$/)

  if (!match) {
    return { title, qualifier: '' }
  }

  return {
    title: match[1].trim(),
    qualifier: match[2].trim(),
  }
}

export default function Timeline({ items = [] }) {
  return (
    <div>
      <ul>
        {items.map((it, i) => {
          const { title, qualifier } = splitTitleAndQualifier(it.title)

          return (
            <Motion.li
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className={`flex gap-4 ${i < items.length - 1 ? 'pb-9' : ''}`}
            >
              <div className="flex w-[10px] shrink-0 flex-col items-center">
                <span className="mt-[4px] h-[10px] w-[10px] rounded-full border-2 border-[var(--color-border-secondary)] bg-transparent" />
                {i < items.length - 1 && (
                  <span className="mt-1.5 w-px flex-1 bg-[var(--color-border-tertiary)]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 text-[12px] text-[var(--color-text-tertiary)]">
                  {it.start} — {it.end}
                  {it.start && it.end && (
                    <span className="text-[var(--color-text-secondary)]">
                      {' '}
                      · {formatExperienceDuration(it.start, it.end)}
                    </span>
                  )}
                </div>
                <div className="mb-1 text-[15px] font-medium text-[var(--color-text-primary)]">
                  {title}
                  {qualifier && (
                    <span className="ml-1 text-[13px] font-normal text-[var(--color-text-tertiary)]">
                      {qualifier}
                    </span>
                  )}
                </div>
                <div className="mb-3 text-[13px] text-[var(--color-text-secondary)]">{it.org}</div>
                {it.description && (
                  <p className="mb-4 text-[13px] leading-[1.6] text-[var(--color-text-secondary)]">
                    {it.description}
                  </p>
                )}
                {Array.isArray(it.tags) && it.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {it.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border-[0.5px] border-[var(--color-border-secondary)] bg-[var(--color-background-secondary)] px-[10px] py-1 text-[11px] text-[var(--color-text-secondary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Motion.li>
          )
        })}
      </ul>
    </div>
  )
}
