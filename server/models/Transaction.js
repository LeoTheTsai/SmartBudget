// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], default: 'expense' },
  recurring: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  note: { type: String, default: '' } // ✅ Add this line
});

module.exports = mongoose.model('Transaction', TransactionSchema);
