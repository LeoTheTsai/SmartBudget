const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()
const JWT_SECRET = 'your_secret_key' // Replace with env variable in production

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, monthlyBudget } = req.body
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ error: 'User already exists' })

  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ name, email, password: hashed, monthlyBudget })
  await user.save()

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' })
  res.json({ token, user: { id: user._id, name, email, monthlyBudget } })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ error: 'Invalid credentials' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' })
  res.json({ token, user: { id: user._id, name: user.name, email, monthlyBudget: user.monthlyBudget } })
})

module.exports = router