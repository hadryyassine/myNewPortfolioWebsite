export default function SiteLoader() {
  const isDark =
    typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark'

  return (
    <div
      className={`site-loader-screen${isDark ? ' is-dark' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading website"
    >
      <div className="site-loader-center">
        <img
          src={isDark ? '/logo-yh-white.png' : '/logo-yh.png'}
          alt="Yassine Hadry logo"
          width={72}
          height={62}
          fetchPriority="high"
          className="site-loader-logo"
        />
        <div className="site-loader-bar" aria-hidden="true" />
      </div>
    </div>
  )
}
