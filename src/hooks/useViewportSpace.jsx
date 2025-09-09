import { useEffect, useState } from 'react'

export default function useViewportSpace() {
  const [px, setPx] = useState(null)

  useEffect(() => {
    const calc = () => {
      const h = document.getElementById('site-header')?.offsetHeight || 0
      const f = document.getElementById('site-footer')?.offsetHeight || 0
      const vh = window.innerHeight
      setPx(Math.max(vh - h - f, 0))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  return px
}
