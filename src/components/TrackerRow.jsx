import { calcRow, fmt } from '../hooks/useStorage'

const inputBase =
  'w-full text-sm px-3 py-2 rounded border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 text-left focus:outline-none focus:border-gray-400 dark:focus:border-zinc-400 appearance-none'

export default function TrackerRow({ row, threshold, onUpdate, onRemove, addLabel, removeLabel, updateLabel, toggleLabelShower }) {
  const calcCell = 'px-2 py-2 text-center text-sm'

  const labels = row.labels || []
  const totalDay = labels.reduce((sum, lbl) => {
    const { dayUse } = calcRow(lbl)
    return sum + (dayUse !== null ? dayUse : 0)
  }, 0)
  const totalNight = labels.reduce((sum, lbl) => {
    const { netNight } = calcRow(lbl)
    return sum + (netNight !== null ? netNight : 0)
  }, 0)

  return (
    <>
      {labels.map((lbl, i) => {
        const { dayUse, showerUse, netNight } = calcRow(lbl)
        const isLeak = netNight !== null && netNight > threshold
        const isNeg = dayUse !== null && dayUse < 0
        const rowBg = lbl.shower ? 'bg-blue-50/40 dark:bg-blue-950/30' : 'bg-white dark:bg-zinc-900'

        return (
          <tr key={`${row.id}-${i}`} className={`${rowBg} hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors`}>
            {i === 0 && (
              <td className="px-3 py-2" rowSpan={labels.length}>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => onUpdate(row.id, 'date', e.target.value)}
                  className={`${inputBase} min-w-[160px] max-w-[170px]`}
                />
              </td>
            )}

            {/* Label name */}
            <td className="px-3 py-2">
              <input
                type="text"
                value={lbl.name}
                placeholder="Pipe / room"
                onChange={(e) => updateLabel(row.id, i, 'name', e.target.value)}
                className={`${inputBase} min-w-[150px] max-w-[165px]`}
              />
            </td>

            {/* Day start */}
            <td className="px-2 py-2">
              <input
                type="number"
                step="0.0001"
                value={lbl.dayStart}
                placeholder="0.0000"
                onChange={(e) => updateLabel(row.id, i, 'dayStart', e.target.value)}
                className={`${inputBase} min-w-[110px]`}
              />
            </td>

            {/* Day end */}
            <td className="px-2 py-2">
              <input
                type="number"
                step="0.0001"
                value={lbl.dayEnd}
                placeholder="0.0000"
                onChange={(e) => updateLabel(row.id, i, 'dayEnd', e.target.value)}
                className={`${inputBase} min-w-[110px]`}
              />
            </td>

            {/* Day use (calculated) */}
            <td className={`${calcCell} ${isNeg ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-zinc-400'}`}>
              {fmt(dayUse)}
            </td>

            {/* Night start */}
            <td className="px-2 py-2">
              <input
                type="number"
                step="0.0001"
                value={lbl.nightStart}
                placeholder="0.0000"
                onChange={(e) => updateLabel(row.id, i, 'nightStart', e.target.value)}
                className={`${inputBase} min-w-[110px]`}
              />
            </td>

            {/* Night end */}
            <td className="px-2 py-2">
              <input
                type="number"
                step="0.0001"
                value={lbl.nightEnd}
                placeholder="0.0000"
                onChange={(e) => updateLabel(row.id, i, 'nightEnd', e.target.value)}
                className={`${inputBase} min-w-[110px]`}
              />
            </td>

            {/* Shower checkbox */}
            <td className="px-1 py-1 text-center">
              <input
                type="checkbox"
                checked={lbl.shower}
                title="Night shower between 2–4 AM"
                onChange={(e) => toggleLabelShower(row.id, i, e.target.checked)}
                className="w-3.5 h-3.5 cursor-pointer accent-blue-500"
              />
            </td>

            {/* Shower start */}
            <td className="px-2 py-2">
              <input
                type="number"
                step="0.0001"
                value={lbl.showerStart}
                placeholder="0.0000"
                disabled={!lbl.shower}
                onChange={(e) => updateLabel(row.id, i, 'showerStart', e.target.value)}
                className={`${inputBase} disabled:opacity-20 disabled:cursor-not-allowed min-w-[110px]`}
              />
            </td>

            {/* Shower end */}
            <td className="px-2 py-2">
              <input
                type="number"
                step="0.0001"
                value={lbl.showerEnd}
                placeholder="0.0000"
                disabled={!lbl.shower}
                onChange={(e) => updateLabel(row.id, i, 'showerEnd', e.target.value)}
                className={`${inputBase} disabled:opacity-20 disabled:cursor-not-allowed min-w-[110px]`}
              />
            </td>

            {/* Shower use (calculated) */}
            <td className={`${calcCell} text-gray-500 dark:text-zinc-400`}>
              {lbl.shower && showerUse !== null ? fmt(showerUse) : '—'}
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
              {labels.length > 1 ? (
                <button
                  onClick={() => removeLabel(row.id, i)}
                  title="Delete label"
                  aria-label="Delete label"
                  className="text-xs px-1.5 py-1 rounded border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  ✕
                </button>
              ) : (
                <button
                  onClick={() => onRemove(row.id)}
                  title="Delete row"
                  aria-label="Delete row"
                  className="text-xs px-1.5 py-1 rounded border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  ✕
                </button>
              )}
            </td>
          </tr>
        )
      })}
      {/* Add label action row */}
      <tr className="bg-white dark:bg-zinc-900">
        <td colSpan={12} className="px-2 py-1">
          <button onClick={() => addLabel(row.id)} className="text-sm px-3 py-1.5 rounded border border-gray-200 dark:border-zinc-600 text-gray-700 dark:text-zinc-300">+ Add label</button>
        </td>
      </tr>
    </>
  )
}
