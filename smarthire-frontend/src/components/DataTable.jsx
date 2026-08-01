import { useState } from 'react'

/**
 * columns: [{ key, label, sortable }]
 * rows: [{ ...data }]
 * Alternating row bg. Sortable headers with up/down arrow. Hover: bg shifts one step darker.
 */
export default function DataTable({ columns, rows, onRowClick }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
        return sortDir === 'asc' ? cmp : -cmp
      })
    : rows

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="overflow-x-auto rounded-card border" style={{ borderColor: 'var(--border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && toggleSort(col.key)}
                className={`text-left px-4 py-3 font-medium text-xs uppercase tracking-wide ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                style={{ color: 'var(--muted)' }}
              >
                {col.label} {col.sortable && sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
              style={{
                background: i % 2 === 1 ? 'color-mix(in srgb, var(--border) 25%, transparent)' : 'transparent',
              }}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>No data to show.</div>
      )}
    </div>
  )
}
