import { useState } from 'react'

interface Transaction {
  id: number
  amount: number
  category: string
  date: string
}

const Transactions = (): JSX.Element => {
  const [filter, setFilter] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, amount: 75.25, category: 'Groceries', date: '2025-07-30' },
    { id: 2, amount: 1200.0, category: 'Rent', date: '2025-07-01' },
    { id: 3, amount: 35.0, category: 'Transport', date: '2025-07-28' },
    { id: 4, amount: 18.5, category: 'Dining', date: '2025-07-29' }
  ])

  const [newTxn, setNewTxn] = useState({ amount: '', category: '' })

  const filtered = transactions.filter(txn =>
    txn.category.toLowerCase().includes(filter.toLowerCase())
  )

  const handleAddTransaction = () => {
    const newId = transactions.length + 1
    setTransactions([
      ...transactions,
      {
        id: newId,
        amount: parseFloat(newTxn.amount),
        category: newTxn.category,
        date: new Date().toISOString().split('T')[0]
      }
    ])
    setNewTxn({ amount: '', category: '' })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by category"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add Transaction</h2>
        <input
          type="text"
          placeholder="Amount"
          value={newTxn.amount}
          onChange={e => setNewTxn({ ...newTxn, amount: e.target.value })}
          className="border p-2 mr-2 w-32 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={newTxn.category}
          onChange={e => setNewTxn({ ...newTxn, category: e.target.value })}
          className="border p-2 mr-2 w-40 rounded"
        />
        <button
          onClick={handleAddTransaction}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {filtered.map(txn => (
          <li
            key={txn.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-lg font-semibold ${txn.amount > 500 ? 'text-red-600' : 'text-green-600'}`}>
                  ${txn.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{txn.category}</p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{txn.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Transactions