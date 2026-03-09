import { motion as Motion, useReducedMotion } from 'framer-motion'
import { skillCategories } from '../data/experience'

export default function SkillCategoriesPanel({ isDark = false }) {
  const shouldReduceMotion = useReducedMotion()

  const categoryClass = isDark
    ? 'text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9eb2be]'
    : 'text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f7882]'

  const chipClass = isDark
    ? 'inline-flex items-center gap-2 rounded-md border border-[#2e3d47] bg-[#17242d] px-2.5 py-1.5 text-xs text-[#cfdbe3]'
    : 'inline-flex items-center gap-2 rounded-md border border-[#d7e1e6] bg-[#f6f9fb] px-2.5 py-1.5 text-xs text-[#324953]'

  const logoClass = isDark
    ? 'h-3.5 w-3.5 opacity-90 grayscale invert'
    : 'h-3.5 w-3.5 opacity-80 grayscale'

  const containerVariants = shouldReduceMotion
    ? {}
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.06,
            delayChildren: 0.02,
          },
        },
      }

  const rowVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 6 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
        },
      }

  return (
    <Motion.div
      className="space-y-4"
      variants={containerVariants}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="show"
    >
      {skillCategories.map((group) => (
        <Motion.section key={group.category} variants={rowVariants}>
          <h3 className={categoryClass}>{group.category}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span key={skill.name} className={chipClass}>
                <img
                  src={skill.logo}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  className={logoClass}
                />
                <span>{skill.name}</span>
              </span>
            ))}
          </div>
        </Motion.section>
      ))}
    </Motion.div>
  )
}
