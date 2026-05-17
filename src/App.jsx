import { useEffect, useState } from 'react'
import WaterTracker from './components/WaterTracker'

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('wt-darkmode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('wt-darkmode', dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 transition-colors duration-200">
      <WaterTracker dark={dark} setDark={setDark} />
    </div>
  )
}
