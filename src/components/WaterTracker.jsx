import { useStorage, calcRow, fmt } from '../hooks/useStorage'
import TrackerRow from './TrackerRow'
import SummaryCards from './SummaryCards'
import { exportCSV } from './exportCSV'

const statusDot = {
  loading: 'bg-gray-400',
  saving:  'bg-amber-400',
  saved:   'bg-green-500',
  error:   'bg-red-500',
}

const statusText = {
  loading: 'Loading...',
  saving:  'Saving...',
  saved:   'Saved',
  error:   'Could not save',
}

export default function WaterTracker({ dark, setDark }) {
  const {
    rows, threshold,
    status, lastSaved,
    addRow, removeRow, updateRow, toggleShower,
    addLabel, removeLabel, updateLabel, toggleLabelShower,
    updateThreshold,
  } = useStorage()

  const combinedDay = rows.reduce((sum, row) => {
    return sum + (row.labels || []).reduce((daySum, lbl) => {
      const { dayUse } = calcRow(lbl)
      return daySum + (dayUse !== null ? dayUse : 0)
    }, 0)
  }, 0)

  const combinedNight = rows.reduce((sum, row) => {
    return sum + (row.labels || []).reduce((nightSum, lbl) => {
      const { netNight } = calcRow(lbl)
      return nightSum + (netNight !== null ? netNight : 0)
    }, 0)
  }, 0)

  return (
    <div className="p-4 sm:p-6">
      <div className="w-full mx-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-4 sm:p-5 max-w-full">

        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full inline-block ${statusDot[status]}`} />
            <span className="text-xs text-gray-400 dark:text-zinc-500">
              {statusText[status]}
              {status === 'saved' && lastSaved && (
                <> — {lastSaved.toLocaleTimeString()}</>
              )}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {dark ? '☀ Light' : '☾ Dark'}
            </button>
            <button
              onClick={() => exportCSV(rows, threshold)}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              ↓ Export CSV
            </button>
            <button
              onClick={addRow}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-85 transition-opacity"
            >
              + Add day
            </button>
          </div>
        </div>

        {/* Threshold control */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label className="text-xs text-gray-500 dark:text-zinc-400">
            Leak threshold (m³ / night):
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={threshold}
            onChange={(e) => updateThreshold(parseFloat(e.target.value) || 0)}
            className="w-24 text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 focus:outline-none focus:border-gray-400 dark:focus:border-zinc-400"
          />
          <span className="text-xs text-gray-400 dark:text-zinc-500">
            Net above this is flagged ⚠
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700 table-scroll">
          <table className="w-full text-sm border-collapse" style={{ tableLayout: 'fixed', minWidth: '1240px' }}>
            <colgroup>
              <col style={{ width: '170px' }} />
              <col style={{ width: '240px' }} />
              <col style={{ width: '120px' }} /><col style={{ width: '120px' }} /><col style={{ width: '100px' }} />
              <col style={{ width: '120px' }} /><col style={{ width: '120px' }} /><col style={{ width: '90px' }} />
              <col style={{ width: '120px' }} /><col style={{ width: '120px' }} /><col style={{ width: '100px' }} /><col style={{ width: '110px' }} />
              <col style={{ width: '70px' }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                <th rowSpan={2} className="text-left px-3 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">
                  Date
                </th>
                <th rowSpan={2} className="text-left px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">
                  Label
                </th>
                <th colSpan={3} className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">
                  Day
                </th>
                <th colSpan={7} className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">
                  Night
                </th>
                <th rowSpan={2} className="border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0" />
              </tr>
              <tr className="bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-b-2 border-gray-300 dark:border-zinc-600">
                <th className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">Start m³</th>
                <th className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">End m³</th>
                <th className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">Net Day</th>
                <th className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">Start m³</th>
                <th className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">End m³</th>
                <th className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0" title="Shower between 2–4 AM?">Shower?</th>
                <th className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">Shower start</th>
                <th className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">Shower end</th>
                <th className="text-center px-2 py-3 font-medium border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">Shwer m³</th>
                <th className="text-center px-2 py-3 font-medium border-b border-gray-200 dark:border-zinc-700">Net night</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-8 text-gray-400 dark:text-zinc-500">
                    No entries yet — click "+ Add day" to start.
                  </td>
                </tr>
              ) : (
                <>
                  {rows.map((row, i) => (
                    <TrackerRow
                      key={row.id}
                      row={row}
                      threshold={threshold}
                      onUpdate={updateRow}
                      onToggleShower={toggleShower}
                      onRemove={removeRow}
                      addLabel={addLabel}
                      removeLabel={removeLabel}
                      updateLabel={updateLabel}
                      toggleLabelShower={toggleLabelShower}
                      isLastCombined={i === rows.length - 1}
                    />
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary cards */}
        <SummaryCards rows={rows} threshold={threshold} />

        {/* Footnote */}
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-4 leading-relaxed">
          Day use = end − start &nbsp;|&nbsp;
          Shower use = shower end − shower start &nbsp;|&nbsp;
          Net night = (night end − night start) − shower use (night) &nbsp;|&nbsp;
          Data saves automatically to your browser and persists across reloads &nbsp;|&nbsp;
          Export CSV opens in Excel, Numbers, or Google Sheets
        </p>

      </div>
    </div>
  )
}
