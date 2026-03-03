import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'

export default function Header({ isDark, onToggleTheme }) {
  return (
    <header className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between gap-3">
      <Link to="/" aria-label="Yassine Hadry home">
        <img
          src={isDark ? '/logo-yh-white.png' : '/logo-yh.png'}
          alt="Yassine Hadry"
          width={36}
          height={31}
          loading="eager"
          decoding="async"
          className="h-7 sm:h-8 w-auto object-contain"
        />
      </Link>

      <nav className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs sm:text-sm
            ${isActive ? 'border-[#6f9ca2]/55 bg-[#6f9ca2]/18 text-[#27454e] dark:text-[#e2edf1]' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/blog"
          className={({ isActive }) =>
            `px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs sm:text-sm
            ${isActive ? 'border-[#6f9ca2]/55 bg-[#6f9ca2]/18 text-[#27454e] dark:text-[#e2edf1]' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`
          }
        >
          Blog
        </NavLink>

        <NavLink
          to="/resources"
          className={({ isActive }) =>
            `px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs sm:text-sm
            ${isActive ? 'border-[#6f9ca2]/55 bg-[#6f9ca2]/18 text-[#27454e] dark:text-[#e2edf1]' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`
          }
        >
          Resources
        </NavLink>

        <button
          onClick={onToggleTheme}
          className="h-8 w-8 rounded-full border border-brand/30 bg-brand/10 hover:bg-brand/20 flex items-center justify-center"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </nav>
    </header>
  )
}
