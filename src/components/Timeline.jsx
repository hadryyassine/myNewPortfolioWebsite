import { motion } from 'framer-motion'

export default function Timeline({ items = [] }) {
  return (
    <div className="relative">
      <div className="absolute left-[8px] top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />
      <ul className="space-y-6">
        {items.map((it, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            className="pl-6 relative"
          >
            <span className="absolute left-0 top-2 w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950" />
            <div className="text-xs text-neutral-500">
              {it.start} — {it.end}
            </div>
            <div className="mt-0.5 font-medium">
              {it.title} • <span className="text-neutral-600 dark:text-neutral-400">{it.org}</span>
            </div>
            {it.description && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{it.description}</p>
            )}
            {Array.isArray(it.tags) && it.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {it.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
