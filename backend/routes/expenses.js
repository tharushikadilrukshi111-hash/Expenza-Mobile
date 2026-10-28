const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get expenses for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    res.json({ expenses, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add expense
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const newExpense = new Expense({
      userId: req.userId,
      title,
      amount,
      category
    });
    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;