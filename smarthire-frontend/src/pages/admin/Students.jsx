import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FullWidthListLayout from '../../layouts/FullWidthListLayout.jsx'
import DataTable from '../../components/DataTable.jsx'
import StatusPill from '../../components/StatusPill.jsx'
import { students } from '../../lib/mockData.js'

export default function Students() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [branch, setBranch] = useState('')

  const filtered = students.filter((s) => {
    const matchesQuery = `${s.name} ${s.branch}`.toLowerCase().includes(query.toLowerCase())
    const matchesBranch = !branch || s.branch === branch
    return matchesQuery && matchesBranch
  })

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'branch', label: 'Branch', sortable: true },
    { key: 'college', label: 'College' },
    { key: 'cgpa', label: 'CGPA', sortable: true },
    { key: 'applications', label: 'Applications' },
    { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} size="sm" /> },
  ]

  return (
    <FullWidthListLayout
      role="admin"
      userName="Admin"
      onLogout={() => navigate('/login')}
      title="Students"
      subtitle="All registered students across branches."
      filters={
        <div className="flex gap-3">
          <input
            className="input max-w-xs"
            placeholder="Search students by name or branch..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="input max-w-[160px]" value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="MCA">MCA</option>
            <option value="ECE">ECE</option>
          </select>
        </div>
      }
    >
      <DataTable columns={columns} rows={filtered} />
    </FullWidthListLayout>
  )
}
