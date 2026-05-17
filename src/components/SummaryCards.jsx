import { calcRow } from '../hooks/useStorage'

export default function SummaryCards({ rows, threshold }) {
  let totalDay = 0, totalNight = 0, totalShower = 0, leakDays = 0, validNights = 0

  rows.forEach((r) => {
    const { dayUse, showerUse, netNight } = calcRow(r)
    if (dayUse !== null && dayUse >= 0) totalDay += dayUse
    if (netNight !== null) {
      totalNight += netNight
      validNights++
      if (netNight > threshold) leakDays++
    }
    if (showerUse !== null) totalShower += showerUse
  })

  const cards = [
    { label: 'Total day use', value: `${totalDay.toFixed(4)} m³`, warn: false },
    { label: 'Total net night', value: `${totalNight.toFixed(4)} m³`, warn: false },
    { label: 'Total shower use', value: `${totalShower.toFixed(4)} m³`, warn: false },
    {
      label: 'Nights above threshold',
      value: `${leakDays} / ${validNights}`,
      warn: leakDays > 0,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-lg p-3 ${
            c.warn
              ? 'bg-amber-50 dark:bg-amber-950'
              : 'bg-gray-100 dark:bg-zinc-800'
          }`}
        >
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">{c.label}</p>
          <p
            className={`text-lg font-medium ${
              c.warn
                ? 'text-amber-800 dark:text-amber-300'
                : 'text-gray-900 dark:text-zinc-100'
            }`}
          >
            {c.value}
          </p>
        </div>
      ))}
    </div>
  )
}
