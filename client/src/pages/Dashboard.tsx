import {
  Container, Grid, Paper, Typography, Button, Dialog,
  TextField, Select, MenuItem, Stack,
  LinearProgress, Box, Checkbox, FormControlLabel,
  DialogTitle, DialogContent, DialogActions, Slide, useMediaQuery, IconButton
} from '@mui/material'
import { useState, useEffect, forwardRef } from 'react'
import SpendingDonutChart from '../components/SpendingDonutChart'
import SpendingTrendChart from '../components/SpendingTrendChart'
import AlertBanner from '../components/AlertBanner'
import { useNotifications } from '../context/NotificationContext'
import TransactionsSection from '../components/TransactionSection'
import { motion } from 'framer-motion'
import { Transaction } from '../types/Transaction'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { updateMonthlyBudget } from '../utils/api'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Dashboard = (): JSX.Element => {
  const { refresh: refreshNotifications } = useNotifications()
  const [modalOpen, setModalOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({ amount: '', category: '', recurring: false, type: 'expense', note: '' })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [monthFilter, setMonthFilter] = useState(localStorage.getItem('monthFilter') || 'All')
  const [yearFilter, setYearFilter] = useState(localStorage.getItem('yearFilter') || 'All')
  const [page, setPage] = useState(1)
  const [showBudgetAlert, setShowBudgetAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, monthlyBudget = 0, updateBudget } = useAuth()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<'single' | 'multi'>('multi')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const rowsPerPage = 10

  // Editable budget dialog state
  const [editBudgetOpen, setEditBudgetOpen] = useState(false)
  const [editBudgetValue, setEditBudgetValue] = useState(monthlyBudget.toString())

  // Selection state for multi-delete
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const totalSpent = transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0)
  const budgetUsed = Math.min((totalSpent / monthlyBudget) * 100, 100)
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0)

  // Recent Transactions Widget
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  useEffect(() => {
    if (loading) return // skip until data is ready

    const notifyBudgetExceeded = async () => {
      const prev = localStorage.getItem('budgetNotifiedAmount')
      const previousNotified = prev ? parseFloat(prev) : null

      if (totalSpent <= monthlyBudget) {
        if (previousNotified !== null) {
          localStorage.removeItem('budgetNotifiedAmount')
        }
        return
      }

      if (previousNotified !== null && totalSpent <= previousNotified) return

      try {
        await fetch('http://localhost:5000/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Budget exceeded by $${(totalSpent - monthlyBudget).toFixed(2)}`,
            type: 'warning',
            read: false
          })
        })

        setShowBudgetAlert(true)
        setAlertMessage('Your spending has exceeded the monthly budget.')
        localStorage.setItem('budgetNotifiedAmount', totalSpent.toString())
        refreshNotifications()
      } catch (err) {
        console.error('Failed to send budget notification:', err)
      }
    }

    notifyBudgetExceeded()
  }, [totalSpent, loading])

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      })
      const added = await res.json()
      setTransactions(prev => [added, ...prev])
      handleModalClose()
      setNewTransaction({ amount: '', category: '', recurring: false, note: '', type: 'expense' })
    } catch (err) {
      console.error('Add failed', err)
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/transactions')
        const data = await res.json()
        const today = new Date()

        const autoGenerated = data.flatMap((t: any) => {
          if (t.recurring) {
            const txDate = new Date(t.date)
            const monthsDiff = (today.getFullYear() - txDate.getFullYear()) * 12 + (today.getMonth() - txDate.getMonth())
            const instances = []
            for (let i = 1; i <= monthsDiff; i++) {
              const cloned = { ...t, date: new Date(txDate.getFullYear(), txDate.getMonth() + i, txDate.getDate()) }
              instances.push(cloned)
            }
            return [t, ...instances]
          }
          return t
        })

        setTransactions(autoGenerated)
      } catch (err) {
        console.error('Error fetching:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date)
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear().toString()
    return (categoryFilter === 'All' || t.category === categoryFilter) &&
           (monthFilter === 'All' || month === monthFilter) &&
           (yearFilter === 'All' || year === yearFilter)
  })

  const paginatedTransactions = filteredTransactions.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const uniqueCategories = ['All', ...new Set(transactions.map(t => t.category))]
  const uniqueMonths = ['All', ...new Set(transactions.map(t => new Date(t.date).toLocaleString('default', { month: 'short' }))) ]
  const uniqueYears = ['All', ...new Set(transactions.map(t => new Date(t.date).getFullYear().toString()))]

  useEffect(() => {
    localStorage.setItem('monthFilter', monthFilter)
  }, [monthFilter])

  useEffect(() => {
    localStorage.setItem('yearFilter', yearFilter)
  }, [yearFilter])

  // Handlers for editing budget
  const handleEditBudgetOpen = () => {
    setEditBudgetValue(monthlyBudget.toString())
    setEditBudgetOpen(true)
  }
  const handleEditBudgetClose = () => setEditBudgetOpen(false)
  const handleEditBudgetSave = () => {
    const val = parseFloat(editBudgetValue)
    if (!isNaN(val) && val >= 0) {
      updateBudget(val)
      updateMonthlyBudget(val, user)
      setEditBudgetOpen(false)
    }
  }

  // Open dialog for multi-delete
  const handleDeleteSelectedDialog = () => {
    setDeleteType('multi')
    setDeleteDialogOpen(true)
  }
  // Open dialog for single delete
  const handleDeleteSingleDialog = (id: string) => {
    setDeleteType('single')
    setDeleteTargetId(id)
    setDeleteDialogOpen(true)
  }

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (deleteType === 'multi') {
      await Promise.all(
        selectedIds.map(id =>
          fetch(`http://localhost:5000/api/transactions/${id}`, { method: 'DELETE' })
        )
      )
      setTransactions(prev => prev.filter(t => !selectedIds.includes(t._id || t.id)))
      setSelectedIds([])
    } else if (deleteType === 'single' && deleteTargetId) {
      await fetch(`http://localhost:5000/api/transactions/${deleteTargetId}`, { method: 'DELETE' })
      setTransactions(prev => prev.filter(t => (t._id || t.id) !== deleteTargetId))
      setSelectedIds(prev => prev.filter(_id => _id !== deleteTargetId))
    }
    setDeleteDialogOpen(false)
    setDeleteTargetId(null)
  }

  // --- Delete Transaction Logic ---
  const handleSelectTransaction = (id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(_id => _id !== id)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedTransactions.map(t => t._id || t.id))
    } else {
      setSelectedIds([])
    }
  }

  return (
    <>
      {showBudgetAlert && <AlertBanner severity="warning" message={alertMessage} />}
      <Box sx={{ flexGrow: 1, p: { xs: 1, md: 3 } }}>
        <Grid container spacing={3} mb={2} alignItems="stretch">
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">Budget Usage</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="text.primary">${totalSpent.toFixed(2)} / ${monthlyBudget.toFixed(2)}</Typography>
                    <Typography variant="body2" color="text.secondary">{budgetUsed.toFixed(0)}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={budgetUsed} sx={{ mt: 1 }} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">Total Income</Typography>
                  <Typography variant="h5" color="success.main">${totalIncome.toFixed(2)}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">Total Expenses</Typography>
                  <Typography variant="h5" color="error.main">${totalExpenses.toFixed(2)}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, position: 'relative' }}>
                  <Typography variant="subtitle2" color="text.secondary">Monthly Budget</Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h5" color="primary.main">${monthlyBudget.toFixed(2)}</Typography>
                    <IconButton size="small" sx={{ ml: 1 }} onClick={handleEditBudgetOpen}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">Remaining</Typography>
                  <Typography variant="h5" color="warning.main">${(monthlyBudget - totalSpent).toFixed(2)}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Transactions Widget */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" mb={1}>Recent Transactions</Typography>
              {recentTransactions.length === 0 ? (
                <Typography color="text.secondary">No recent transactions.</Typography>
              ) : (
                <Stack spacing={1}>
                  {recentTransactions.map(txn => (
                    <Box key={txn.id} display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: 80 }}>{txn.category}</Typography>
                      <Typography variant="body2" color={txn.type === 'income' ? 'success.main' : 'error.main'}>
                        {txn.type === 'income' ? '+' : '-'}${parseFloat(txn.amount).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(txn.date).toLocaleDateString()}</Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
        
        {/* Multi-delete controls */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
          <Typography variant={isMobile ? "subtitle1" : "h6"}>Transactions</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {selectedIds.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteSelectedDialog}
                sx={{ mr: 1 }}
              >
                Delete Selected ({selectedIds.length})
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalOpen}
              sx={{
                borderRadius: 2,
                minWidth: { xs: 36, md: 120 },
                px: { xs: 1, md: 3 },
                fontSize: { xs: 12, md: 16 }
              }}
            >
              Add Transaction
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <TransactionsSection
            transactions={transactions}
            filteredTransactions={filteredTransactions}
            paginatedTransactions={paginatedTransactions}
            page={page}
            setPage={setPage}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
            uniqueCategories={uniqueCategories}
            uniqueMonths={uniqueMonths}
            uniqueYears={uniqueYears}
            rowsPerPage={rowsPerPage}
            setTransactions={setTransactions}
            selectedIds={selectedIds}
            onSelectTransaction={handleSelectTransaction}
            onSelectAll={handleSelectAll}
            onDeleteSingle={handleDeleteSingleDialog}
          />
        </Box>
      </Box>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteType === 'multi'
              ? `Are you sure you want to delete ${selectedIds.length} selected transaction(s)?`
              : 'Are you sure you want to delete this transaction?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Budget Dialog */}
      <Dialog open={editBudgetOpen} onClose={handleEditBudgetClose} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Monthly Budget</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              label="Monthly Budget"
              type="number"
              value={editBudgetValue}
              onChange={e => setEditBudgetValue(e.target.value)}
              fullWidth
              autoFocus
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditBudgetClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditBudgetSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Transition}
        fullScreen={isMobile}
      >
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Amount" type="number" value={newTransaction.amount} onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })} fullWidth required />
            <TextField label="Category" value={newTransaction.category} onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })} fullWidth required />
            <Select value={newTransaction.type} onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value })} fullWidth>
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </Select>
            <FormControlLabel control={<Checkbox checked={newTransaction.recurring} onChange={e => setNewTransaction({ ...newTransaction, recurring: e.target.checked })} />} label="Recurring" />
            <TextField label="Note (optional)" multiline rows={2} inputProps={{ maxLength: 120 }} helperText={`${newTransaction.note?.length || 0}/120`} value={newTransaction.note || ''} onChange={e => setNewTransaction({ ...newTransaction, note: e.target.value })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
   </>
  )
}
export default Dashboard