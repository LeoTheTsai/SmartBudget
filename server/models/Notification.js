const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  message: String,
  type: { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Notification', NotificationSchema)
