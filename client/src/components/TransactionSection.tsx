import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, Pagination, TextField, Tooltip, IconButton, Fade, Checkbox
} from '@mui/material'
import { Edit, Save, Close, Delete } from '@mui/icons-material'
import { Transaction } from '../types/Transaction'
import { useState } from 'react'

interface Props {
  transactions: Transaction[]
  filteredTransactions: any[]
  paginatedTransactions: any[]
  page: number
  setPage: (value: number) => void
  categoryFilter: string
  setCategoryFilter: (value: string) => void
  monthFilter: string
  setMonthFilter: (value: string) => void
  yearFilter: string
  setYearFilter: (value: string) => void
  uniqueCategories: string[]
  uniqueMonths: string[]
  uniqueYears: string[]
  rowsPerPage: number
  setTransactions: (transactions: Transaction[]) => void
  selectedIds: string[]
  onSelectTransaction: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onDeleteSingle: (id: string) => void
}

const TransactionsSection = ({
  transactions,
  filteredTransactions,
  paginatedTransactions,
  page,
  setPage,
  categoryFilter,
  setCategoryFilter,
  monthFilter,
  setMonthFilter,
  yearFilter,
  setYearFilter,
  uniqueCategories,
  uniqueMonths,
  uniqueYears,
  rowsPerPage,
  setTransactions,
  selectedIds,
  onSelectTransaction,
  onSelectAll,
  onDeleteSingle,
}: Props) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedNote, setEditedNote] = useState<string>('')
  const [showSavedMsg, setShowSavedMsg] = useState<string | null>(null)
  const MAX_NOTE_LENGTH = 120

  const handleSave = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: editedNote })
      })
      setTransactions(
        transactions.map(t => t._id === id ? { ...t, note: editedNote } : t)
      )
      setShowSavedMsg(id)
      setTimeout(() => setShowSavedMsg(null), 1500)
    } catch (err) {
      console.error('Failed to save note:', err)
    } finally {
      setEditingIndex(null)
      setEditedNote('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave(id)
    } else if (e.key === 'Escape') {
      setEditingIndex(null)
      setEditedNote('')
    }
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
        <Typography variant="subtitle2">Filter by:</Typography>
        <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} size="small">
          {uniqueCategories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
        <Select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} size="small">
          {uniqueMonths.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </Select>
        <Select value={yearFilter} onChange={e => setYearFilter(e.target.value)} size="small">
          {uniqueYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
        </Select>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={paginatedTransactions.length > 0 && paginatedTransactions.every(t => selectedIds.includes(t._id))}
                  indeterminate={paginatedTransactions.some(t => selectedIds.includes(t._id)) && !paginatedTransactions.every(t => selectedIds.includes(t._id))}
                  onChange={e => onSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Recurring</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((t, i) => (
              <TableRow key={t._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(t._id)}
                    onChange={e => onSelectTransaction(t._id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>${t.amount}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                <TableCell>{t.recurring ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {/* ...existing note editing code... */}
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => onDeleteSingle(t._id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mb={4}>
        <Pagination
          count={Math.ceil(filteredTransactions.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  )
}

export default TransactionsSection
