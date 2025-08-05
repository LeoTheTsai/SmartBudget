const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  const { amount, category, recurring, date, type, note } = req.body;

  try {
    const newTx = new Transaction({
      amount,
      category,
      note,
      recurring: !!recurring,
      date: date || new Date(),
      type: type === 'income' ? 'income' : 'expense' // default to 'expense'
    });

    const saved = await newTx.save();
    res.json(saved);
  } catch (err) {
    console.error('Failed to save transaction:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// PATCH /api/transactions/:id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updated = await Transaction.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
    res.json(updated);
  } catch (err) {
    console.error('Failed to update transaction:', err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

//DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Failed to delete transaction:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
