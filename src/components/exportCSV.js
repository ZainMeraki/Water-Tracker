import { calcRow } from '../hooks/useStorage'

export function exportCSV(rows, threshold) {
  const headers = [
    'Date',
    'Label',
    'Day start (m³)',
    'Day end (m³)',
    'Day use (m³)',
    'Night start (m³)',
    'Night end (m³)',
    'Night shower?',
    'Shower start (m³)',
    'Shower end (m³)',
    'Shower use (m³)',
    'Net night (m³)',
    'Flag',
  ]

  const esc = (v) => '"' + String(v).replace(/"/g, '""') + '"'

  const lines = [headers.map(esc).join(',')]

  rows.forEach((r) => {
    ;(r.labels || []).forEach(lbl => {
      const { dayUse, showerUse, netNight } = calcRow(lbl)
      const flag = netNight !== null && netNight > threshold ? 'POSSIBLE LEAK' : ''
      lines.push([
        r.date || '',
        lbl.name || '',
        lbl.dayStart || '',
        lbl.dayEnd || '',
        dayUse !== null ? dayUse.toFixed(4) : '',
        lbl.nightStart || '',
        lbl.nightEnd || '',
        lbl.shower ? 'Yes' : 'No',
        lbl.shower ? (lbl.showerStart || '') : '',
        lbl.shower ? (lbl.showerEnd || '') : '',
        lbl.shower && showerUse !== null ? showerUse.toFixed(4) : '',
        netNight !== null ? netNight.toFixed(4) : '',
        flag,
      ].map(esc).join(','))
    })
  })

  const blob = new Blob([lines.join('\r\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `water-usage-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
