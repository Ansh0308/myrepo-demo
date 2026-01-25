const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching habits', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching habit', error: error.message });
  }
});

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').isIn(['Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Social', 'Creative', 'Finance', 'Other'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const habit = new Habit({
      ...req.body,
      userId: req.body.userId || 'default-user'
    });
    const savedHabit = await habit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Error creating habit', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Error updating habit', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedHabit = await Habit.findByIdAndDelete(req.params.id);
    if (!deletedHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    await HabitLog.deleteMany({ habitId: req.params.id });
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting habit', error: error.message });
  }
});

module.exports = router;
