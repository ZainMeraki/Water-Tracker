import { useState, useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'water-tracker-data-v2'

export function useStorage() {
  const [rows, setRows] = useState([])
  const [nextId, setNextId] = useState(1)
  const [threshold, setThreshold] = useState(0.005)
  const [status, setStatus] = useState('loading') // 'loading' | 'saved' | 'saving' | 'error'
  const [lastSaved, setLastSaved] = useState(null)
  const saveTimer = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const d = JSON.parse(raw)
        // Support migrating old row shape (flat fields) to new shape with labels
        const loadedRows = (d.rows || []).map(r => {
          if (r.labels && Array.isArray(r.labels)) return r
          // migrate old-style row -> single-label row
          const lbl = {
            name: r.label || '',
            dayStart: r.dayStart ?? '', dayEnd: r.dayEnd ?? '',
            nightStart: r.nightStart ?? '', nightEnd: r.nightEnd ?? '',
            shower: r.shower ?? false, showerStart: r.showerStart ?? '', showerEnd: r.showerEnd ?? ''
          }
          return { id: r.id, date: r.date ?? '', labels: [lbl] }
        })
        setRows(loadedRows)
        setNextId(d.nextId || (loadedRows?.length ? Math.max(...loadedRows.map(r => r.id)) + 1 : 1))
        setThreshold(d.threshold ?? 0.005)
      } else {
        const firstRow = makeRow(1)
        setRows([firstRow])
        setNextId(2)
      }
      setStatus('saved')
    } catch {
      setStatus('error')
    }
    initialized.current = true
  }, [])

  const scheduleSave = useCallback((newRows, newNextId, newThreshold) => {
    if (!initialized.current) return
    setStatus('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
        rows: newRows,
        nextId: newNextId,
        threshold: newThreshold,
        }))
        setStatus('saved')
        setLastSaved(new Date())
      } catch {
        setStatus('error')
      }
    }, 700)
  }, [])

  const updateRows = useCallback((updater) => {
    setRows(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      setNextId(nid => {
        setThreshold(thr => {
          scheduleSave(next, nid, thr)
          return thr
        })
        return nid
      })
      return next
    })
  }, [scheduleSave])

  const updateThreshold = useCallback((val) => {
    setThreshold(val)
    setRows(prev => {
      setNextId(nid => {
        scheduleSave(prev, nid, val)
        return nid
      })
      return prev
    })
  }, [scheduleSave])

  const addRow = useCallback(() => {
    setNextId(prev => {
      const id = prev
      const newRow = makeRow(id)
      setRows(r => {
        const next = [...r, newRow]
        setThreshold(thr => {
          scheduleSave(next, id + 1, thr)
          return thr
        })
        return next
      })
      return id + 1
    })
  }, [scheduleSave])

  const addLabel = useCallback((rowId) => {
    updateRows(prev => prev.map(r => r.id === rowId ? { ...r, labels: [...r.labels, makeLabel()] } : r))
  }, [updateRows])

  const removeLabel = useCallback((rowId, labelIndex) => {
    updateRows(prev => prev.map(r => r.id === rowId ? { ...r, labels: r.labels.filter((_, i) => i !== labelIndex) } : r))
  }, [updateRows])

  const updateLabel = useCallback((rowId, labelIndex, field, value) => {
    updateRows(prev => prev.map(r => {
      if (r.id !== rowId) return r
      const labels = r.labels.map((lbl, i) => i === labelIndex ? { ...lbl, [field]: value } : lbl)
      return { ...r, labels }
    }))
  }, [updateRows])

  const toggleLabelShower = useCallback((rowId, labelIndex, checked) => {
    updateRows(prev => prev.map(r => {
      if (r.id !== rowId) return r
      const labels = r.labels.map((lbl, i) => i === labelIndex ? { ...lbl, shower: checked, showerStart: checked ? lbl.showerStart : '', showerEnd: checked ? lbl.showerEnd : '' } : lbl)
      return { ...r, labels }
    }))
  }, [updateRows])

  const removeRow = useCallback((id) => {
    updateRows(prev => prev.filter(r => r.id !== id))
  }, [updateRows])

  const updateRow = useCallback((id, field, value) => {
    updateRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }, [updateRows])

  const toggleShower = useCallback((id, checked) => {
    updateRows(prev => prev.map(r =>
      r.id === id
        ? { ...r, shower: checked, showerStart: checked ? r.showerStart : '', showerEnd: checked ? r.showerEnd : '' }
        : r
    ))
  }, [updateRows])

  return {
    rows, nextId, threshold,
    status, lastSaved,
    addRow, removeRow, updateRow, toggleShower,
    addLabel, removeLabel, updateLabel, toggleLabelShower,
    updateThreshold,
  }
}

export function makeLabel() {
  return { name: '', dayStart: '', dayEnd: '', nightStart: '', nightEnd: '', shower: false, showerStart: '', showerEnd: '' }
}

export function makeRow(id) {
  return { id, date: '', labels: [ makeLabel() ] }
}

export function calcRow(r) {
  const ds = parseFloat(r.dayStart), de = parseFloat(r.dayEnd)
  const ns = parseFloat(r.nightStart), ne = parseFloat(r.nightEnd)
  const ss = parseFloat(r.showerStart), se = parseFloat(r.showerEnd)
  const dayUse = (!isNaN(ds) && !isNaN(de)) ? de - ds : null
  const showerUse = (r.shower && !isNaN(ss) && !isNaN(se)) ? se - ss : 0
  const nightTotal = (!isNaN(ns) && !isNaN(ne)) ? ne - ns : null
  const netNight = nightTotal !== null ? nightTotal - showerUse : null
  return {
    dayUse,
    showerUse: r.shower ? showerUse : null,
    netNight,
  }
}

export function fmt(v) {
  if (v === null || v === undefined || isNaN(v) || v === '') return '—'
  return Number(v).toFixed(4)
}
