const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

// Get all users (Admin)
router.get('/', auth, role(['admin']), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Add user (Admin)
router.post('/', auth, role(['admin']), async (req, res) => {
  const { name, email, password, role: userRole } = req.body;
  try {
    const user = new User({ name, email, password, role: userRole });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update user (Admin)
router.put('/:id', auth, role(['admin']), async (req, res) => {
  const { name, email, role: userRole } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, role: userRole }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user (Admin)
router.delete('/:id', auth, role(['admin']), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;