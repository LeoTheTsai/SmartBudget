const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const fiveDaysAgo = new Date()
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)

    const notifications = await Notification.find({
      createdAt: { $gte: fiveDaysAgo }
    }).sort({ createdAt: -1 })

    res.json(notifications)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// Create a notification
router.post('/', async (req, res) => {
  const { message, type, read } = req.body
  const newNotif = new Notification({ message, type, read })
  await newNotif.save()
  res.json(newNotif)
})

// Mark as read
router.patch('/:id/read', async (req, res) => {
  const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
  res.json(updated)
})

router.patch('/toggle/:id', async (req, res) => {
  const { id } = req.params
  const { read } = req.body
  try {
    const updated = await Notification.findByIdAndUpdate(id, { read }, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' })
  }
})

// PATCH: Mark all as read
router.patch('/mark-read', async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    const updated = await Notification.find();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

module.exports = router
