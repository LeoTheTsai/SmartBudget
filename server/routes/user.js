const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/user/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/user/:id
router.patch('/:id', async (req, res) => {
  const { name, monthlyBudget } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, monthlyBudget },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


// PATCH /api/user/:id/budget
router.patch('/:id/budget', async (req, res) => {
    const { monthlyBudget } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { monthlyBudget },
        { new: true }
        );
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        console.error('Failed to update user budget:', err);
        res.status(500).json({ error: 'Failed to update user budget' });
    }
});


module.exports = router;
