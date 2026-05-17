import { calcRow, fmt } from '../hooks/useStorage'

const inputBase =
  'w-full text-xs px-1.5 py-1 rounded border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 text-center focus:outline-none focus:border-gray-400 dark:focus:border-zinc-400'

export default function TrackerRow({ row, threshold, onUpdate, onToggleShower, onRemove }) {
  const { dayUse, showerUse, netNight } = calcRow(row)
  const isLeak = netNight !== null && netNight > threshold
  const isNeg = dayUse !== null && dayUse < 0

  const rowBg = row.shower
    ? 'bg-blue-50/40 dark:bg-blue-950/30'
    : 'bg-white dark:bg-zinc-900'

  const calcCell = 'px-1 py-1.5 text-center text-xs'

  return (
    <tr className={`${rowBg} hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors`}>
      {/* Date */}
      <td className="px-2 py-1">
        <input
          type="date"
          value={row.date}
          onChange={(e) => onUpdate(row.id, 'date', e.target.value)}
          className={inputBase}
        />
      </td>

      {/* Day start */}
      <td className="px-1 py-1">
        <input
          type="number"
          step="0.0001"
          value={row.dayStart}
          placeholder="0.0000"
          onChange={(e) => onUpdate(row.id, 'dayStart', e.target.value)}
          className={inputBase}
        />
      </td>

      {/* Day end */}
      <td className="px-1 py-1">
        <input
          type="number"
          step="0.0001"
          value={row.dayEnd}
          placeholder="0.0000"
          onChange={(e) => onUpdate(row.id, 'dayEnd', e.target.value)}
          className={inputBase}
        />
      </td>

      {/* Day use (calculated) */}
      <td className={`${calcCell} ${isNeg ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-zinc-400'}`}>
        {fmt(dayUse)}
      </td>

      {/* Night start */}
      <td className="px-1 py-1">
        <input
          type="number"
          step="0.0001"
          value={row.nightStart}
          placeholder="0.0000"
          onChange={(e) => onUpdate(row.id, 'nightStart', e.target.value)}
          className={inputBase}
        />
      </td>

      {/* Night end */}
      <td className="px-1 py-1">
        <input
          type="number"
          step="0.0001"
          value={row.nightEnd}
          placeholder="0.0000"
          onChange={(e) => onUpdate(row.id, 'nightEnd', e.target.value)}
          className={inputBase}
        />
      </td>

      {/* Shower checkbox */}
      <td className="px-1 py-1 text-center">
        <input
          type="checkbox"
          checked={row.shower}
          title="Night shower between 2–4 AM"
          onChange={(e) => onToggleShower(row.id, e.target.checked)}
          className="w-3.5 h-3.5 cursor-pointer accent-blue-500"
        />
      </td>

      {/* Shower start */}
      <td className="px-1 py-1">
        <input
          type="number"
          step="0.0001"
          value={row.showerStart}
          placeholder="0.0000"
          disabled={!row.shower}
          onChange={(e) => onUpdate(row.id, 'showerStart', e.target.value)}
          className={`${inputBase} disabled:opacity-20 disabled:cursor-not-allowed`}
        />
      </td>

      {/* Shower end */}
      <td className="px-1 py-1">
        <input
          type="number"
          step="0.0001"
          value={row.showerEnd}
          placeholder="0.0000"
          disabled={!row.shower}
          onChange={(e) => onUpdate(row.id, 'showerEnd', e.target.value)}
          className={`${inputBase} disabled:opacity-20 disabled:cursor-not-allowed`}
        />
      </td>

      {/* Shower use (calculated) */}
      <td className={`${calcCell} text-gray-500 dark:text-zinc-400`}>
        {row.shower && showerUse !== null ? fmt(showerUse) : '—'}
      </td>

      {/* Net night (calculated) */}
      <td
        className={`${calcCell} font-medium ${
          isLeak
            ? 'text-amber-700 dark:text-amber-300'
            : netNight !== null
            ? 'text-green-700 dark:text-green-400'
            : 'text-gray-400 dark:text-zinc-500'
        }`}
        title={isLeak ? 'Above leak threshold — possible leak' : ''}
      >
        {fmt(netNight)}{isLeak ? ' ⚠' : ''}
      </td>

      {/* Delete */}
      <td className="px-1 py-1 text-center">
        <button
          onClick={() => onRemove(row.id)}
          title="Delete row"
          aria-label="Delete row"
          className="text-xs px-1.5 py-1 rounded border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
          ✕
        </button>
      </td>
    </tr>
  )
}
