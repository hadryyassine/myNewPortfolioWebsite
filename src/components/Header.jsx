import { Link, NavLink } from 'react-router-dom'

export default function Header({ isDark, onToggleTheme }) {
  return (
    <header className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
      <Link to="/" className="text-lg sm:text-xl font-semibold tracking-tight">
        Yassine Hadry
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-lg border text-sm
            ${isActive ? 'border-brand/50 bg-brand/10' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`
          }
        >
          Blog
        </NavLink>

        <button
          onClick={onToggleTheme}
          className="px-3 py-1.5 rounded-lg text-sm border border-brand/30 bg-brand/10 hover:bg-brand/20"
          aria-label="Toggle dark mode"
        >
          {isDark ? 'Light' : 'Dark'}
        </button>
      </nav>
    </header>
  )
}
