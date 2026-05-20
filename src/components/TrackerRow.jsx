import { calcRow, fmt } from '../hooks/useStorage'

const inputBase =
  'w-full text-sm px-3 py-2 rounded border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 text-left focus:outline-none focus:border-gray-400 dark:focus:border-zinc-400 appearance-none'

export default function TrackerRow({ row, threshold, onUpdate, onRemove, addLabel, removeLabel, updateLabel, toggleLabelShower, isLastCombined }) {
  const cellBorder = 'border-r border-gray-200 dark:border-zinc-700 last:border-r-0'
  const calcCell = `px-2 py-2 text-center text-sm ${cellBorder}`

  const combinedBorder = !isLastCombined ? 'border-b-[2px] border-gray-300 dark:border-zinc-600' : ''

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
              <td className={`px-3 py-2 ${cellBorder}`} rowSpan={labels.length}>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => onUpdate(row.id, 'date', e.target.value)}
                  className={`${inputBase} min-w-[160px] max-w-[170px]`}
                />
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500 dark:text-zinc-400">
                  <label className="space-y-1">
                    <span className="block">Day start</span>
                    <input
                      type="time"
                      value={row.dayStartTime || ''}
                      onChange={(e) => onUpdate(row.id, 'dayStartTime', e.target.value)}
                      className={`${inputBase} py-1`}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block">Day end</span>
                    <input
                      type="time"
                      value={row.dayEndTime || ''}
                      onChange={(e) => onUpdate(row.id, 'dayEndTime', e.target.value)}
                      className={`${inputBase} py-1`}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block">Night start</span>
                    <input
                      type="time"
                      value={row.nightStartTime || ''}
                      onChange={(e) => onUpdate(row.id, 'nightStartTime', e.target.value)}
                      className={`${inputBase} py-1`}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block">Night end</span>
                    <input
                      type="time"
                      value={row.nightEndTime || ''}
                      onChange={(e) => onUpdate(row.id, 'nightEndTime', e.target.value)}
                      className={`${inputBase} py-1`}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => addLabel(row.id)}
                  className="mt-3 w-full text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  + Add label
                </button>
              </td>
            )}

            {/* Label name */}
            <td className={`px-3 py-2 ${cellBorder}`}>
              <input
                type="text"
                value={lbl.name}
                placeholder="Pipe / room"
                onChange={(e) => updateLabel(row.id, i, 'name', e.target.value)}
                className={`${inputBase} min-w-[150px] max-w-[165px]`}
              />
            </td>

            {/* Day start */}
            <td className={`px-2 py-2 ${cellBorder}`}>
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
            <td className={`px-2 py-2 ${cellBorder}`}>
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
            <td className={`px-2 py-2 ${cellBorder}`}>
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
            <td className={`px-2 py-2 ${cellBorder}`}>
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
            <td className={`px-1 py-1 text-center ${cellBorder}`}>
              <input
                type="checkbox"
                checked={lbl.shower}
                title="Night shower between 2–4 AM"
                onChange={(e) => toggleLabelShower(row.id, i, e.target.checked)}
                className="w-3.5 h-3.5 cursor-pointer accent-blue-500"
              />
            </td>

            {/* Shower start */}
            <td className={`px-2 py-2 ${cellBorder}`}>
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
            <td className={`px-2 py-2 ${cellBorder}`}>
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
            <td className={`px-1 py-1 text-center ${cellBorder}`}>
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
      <tr className="bg-gray-50 dark:bg-zinc-950 border-t-[2px] border-gray-300 dark:border-zinc-600">
        <td className={`px-3 py-2 text-sm font-semibold text-gray-700 dark:text-zinc-300 ${combinedBorder}`} colSpan={2}>
          Combined Totals:
        </td>
        <td className={`px-1 py-2 ${combinedBorder}`} />
        <td className={`px-1 py-2 ${combinedBorder}`} />
        <td className={`px-1 py-2 text-center text-sm font-semibold text-gray-900 dark:text-zinc-100 ${combinedBorder}`}>
          {fmt(totalDay)}
        </td>
        <td className={`px-1 py-2 ${combinedBorder}`} />
        <td className={`px-1 py-2 ${combinedBorder}`} />
        <td className={`px-1 py-2 ${combinedBorder}`} />
        <td className={`px-1 py-2 ${combinedBorder}`} />
        <td className={`px-1 py-2 ${combinedBorder}`} />
        <td className={`px-1 py-2 ${combinedBorder}`} />
        <td className={`px-1 py-2 text-center text-sm font-semibold text-gray-900 dark:text-zinc-100 ${combinedBorder}`}>
          {fmt(totalNight)}
        </td>
        <td className={`px-1 py-2 ${combinedBorder}`} />
      </tr>
    </>
  )
}
