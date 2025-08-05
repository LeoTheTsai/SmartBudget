import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material'
import TrendChart from './TrendChart'
import { Transaction } from '../types/Transaction'

interface Props {
  transactions: Transaction[]
}

const SpendingTrendChart = ({ transactions }: Props) => {
  const [selectedYear, setSelectedYear] = useState('all')
  const [showIncome, setShowIncome] = useState(true)
  const [showSpending, setShowSpending] = useState(true)

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  // Derive available years
  const availableYears = useMemo(() => {
    const years = new Set<string>()
    transactions.forEach(t => {
      const year = new Date(t.date).getFullYear().toString()
      years.add(year)
    })
    return Array.from(years).sort()
  }, [transactions])

  const filteredTxns = useMemo(() => {
    return selectedYear === 'all'
      ? transactions
      : transactions.filter(t => new Date(t.date).getFullYear().toString() === selectedYear)
  }, [transactions, selectedYear])

  const [labels, setLabels] = useState<string[]>([])
  const [spendingData, setSpendingData] = useState<number[]>([])
  const [incomeData, setIncomeData] = useState<number[]>([])

  useEffect(() => {
    const monthlySpending = new Map<string, number>()
    const monthlyIncome = new Map<string, number>()

    for (const t of filteredTxns) {
      const d = new Date(t.date)
      const label = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
      const amount = parseFloat(t.amount.toString())

      if (t.type === 'income') {
        monthlyIncome.set(label, (monthlyIncome.get(label) || 0) + amount)
      } else {
        monthlySpending.set(label, (monthlySpending.get(label) || 0) + amount)
      }
    }

    const allLabels = Array.from(new Set([...monthlySpending.keys(), ...monthlyIncome.keys()])).sort()
    setLabels(allLabels)
    setSpendingData(allLabels.map(l => monthlySpending.get(l) || 0))
    setIncomeData(allLabels.map(l => monthlyIncome.get(l) || 0))
  }, [filteredTxns])

  const totalIncome = incomeData.reduce((a, b) => a + b, 0)
  const totalSpending = spendingData.reduce((a, b) => a + b, 0)

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" alignItems="center" mb={2}>
        <Typography variant="h6">Spending vs Income Trend</Typography>

        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <Select size="small" value={selectedYear} onChange={(e: SelectChangeEvent) => setSelectedYear(e.target.value)}>
            <MenuItem value="all">All Years</MenuItem>
            {availableYears.map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>

          <FormControlLabel
            control={<Checkbox checked={showSpending} onChange={() => setShowSpending(!showSpending)} />}
            label="Show Spending"
          />
          <FormControlLabel
            control={<Checkbox checked={showIncome} onChange={() => setShowIncome(!showIncome)} />}
            label="Show Income"
          />
        </Box>
      </Box>

      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          Total Spending: <strong>{currencyFormatter.format(totalSpending)}</strong>
          {'  |  '}
          Total Income: <strong>{currencyFormatter.format(totalIncome)}</strong>
        </Typography>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <TrendChart
          labels={labels}
          title=""
          datasets={[
            ...(showSpending
              ? [
                  {
                    label: 'Spending',
                    data: spendingData,
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                    fill: true
                  }
                ]
              : []),
            ...(showIncome
              ? [
                  {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    fill: true
                  }
                ]
              : [])
          ]}
          currencyFormatter={currencyFormatter}
        />
      </Box>
    </Box>
  )
}

export default SpendingTrendChart
