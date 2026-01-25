const express = require('express');
const router = express.Router();
const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

router.get('/', async (req, res) => {
  try {
    const { habitId, startDate, endDate, userId } = req.query;
    const query = { userId: userId || 'default-user' };
    
    if (habitId) {
      query.habitId = habitId;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const logs = await HabitLog.find(query).populate('habitId').sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { habitId, date, completed, note, userId } = req.body;
    
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    const logDate = startOfDay(new Date(date));
    
    let log = await HabitLog.findOne({ habitId, date: logDate });
    
    if (log) {
      log.completed = completed !== undefined ? completed : log.completed;
      log.note = note !== undefined ? note : log.note;
      await log.save();
    } else {
      log = new HabitLog({
        habitId,
        date: logDate,
        completed: completed !== undefined ? completed : true,
        note: note || '',
        userId: userId || 'default-user'
      });
      await log.save();
    }
    
    const populatedLog = await HabitLog.findById(log._id).populate('habitId');
    res.json(populatedLog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating/updating log', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedLog = await HabitLog.findByIdAndDelete(req.params.id);
    if (!deletedLog) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting log', error: error.message });
  }
});

router.delete('/habit/:habitId/date/:date', async (req, res) => {
  try {
    const { habitId, date } = req.params;
    const logDate = startOfDay(new Date(date));
    
    const deletedLog = await HabitLog.findOneAndDelete({ habitId, date: logDate });
    if (!deletedLog) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting log', error: error.message });
  }
});

module.exports = router;
