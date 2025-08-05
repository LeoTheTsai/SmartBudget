export interface Transaction {
  _id: string
  amount: string
  category: string
  date: string
  recurring: boolean
  note?: string
  type: 'income' | 'expense'
}
