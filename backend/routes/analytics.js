const express = require('express');
const router = express.Router();
const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, eachDayOfInterval, differenceInDays } = require('date-fns');

router.get('/streaks/:habitId', async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.query.userId || 'default-user';
    
    const logs = await HabitLog.find({ 
      habitId, 
      userId, 
      completed: true 
    }).sort({ date: 1 });
    
    if (logs.length === 0) {
      return res.json({ currentStreak: 0, bestStreak: 0 });
    }
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;
    
    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(today, 1));
    
    for (let i = 1; i < logs.length; i++) {
      const prevDate = startOfDay(new Date(logs[i - 1].date));
      const currDate = startOfDay(new Date(logs[i].date));
      const daysDiff = differenceInDays(currDate, prevDate);
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    bestStreak = Math.max(bestStreak, tempStreak);
    
    const lastLogDate = startOfDay(new Date(logs[logs.length - 1].date));
    if (lastLogDate.getTime() === today.getTime() || lastLogDate.getTime() === yesterday.getTime()) {
      currentStreak = tempStreak;
    }
    
    res.json({ currentStreak, bestStreak, totalCompletions: logs.length });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating streaks', error: error.message });
  }
});

router.get('/completion-rate/:habitId', async (req, res) => {
  try {
    const { habitId } = req.params;
    const { period = 'month' } = req.query;
    const userId = req.query.userId || 'default-user';
    
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    const now = new Date();
    let startDate, endDate;
    
    if (period === 'week') {
      startDate = startOfWeek(now);
      endDate = endOfWeek(now);
    } else if (period === 'month') {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    } else {
      startDate = startOfDay(subDays(now, 30));
      endDate = endOfDay(now);
    }
    
    const logs = await HabitLog.find({
      habitId,
      userId,
      completed: true,
      date: { $gte: startDate, $lte: endDate }
    });
    
    const daysInPeriod = differenceInDays(endDate, startDate) + 1;
    const completionRate = (logs.length / daysInPeriod) * 100;
    
    res.json({
      completionRate: Math.round(completionRate * 10) / 10,
      completedDays: logs.length,
      totalDays: daysInPeriod
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating completion rate', error: error.message });
  }
});

router.get('/overview', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const { period = 'month' } = req.query;
    
    const now = new Date();
    let startDate;
    
    if (period === 'week') {
      startDate = startOfWeek(now);
    } else if (period === 'month') {
      startDate = startOfMonth(now);
    } else {
      startDate = startOfDay(subDays(now, 30));
    }
    
    const habits = await Habit.find({ userId });
    const logs = await HabitLog.find({
      userId,
      completed: true,
      date: { $gte: startDate }
    });
    
    const categoryStats = {};
    for (const habit of habits) {
      const habitLogs = logs.filter(log => log.habitId.toString() === habit._id.toString());
      if (!categoryStats[habit.category]) {
        categoryStats[habit.category] = {
          category: habit.category,
          completions: 0,
          habits: 0
        };
      }
      categoryStats[habit.category].completions += habitLogs.length;
      categoryStats[habit.category].habits++;
    }
    
    res.json({
      totalHabits: habits.length,
      totalCompletions: logs.length,
      categoryBreakdown: Object.values(categoryStats)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overview', error: error.message });
  }
});

router.get('/daily-progress', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const { days = 30 } = req.query;
    
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, parseInt(days) - 1));
    
    const logs = await HabitLog.find({
      userId,
      completed: true,
      date: { $gte: startDate, $lte: endDate }
    });
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const dailyData = dateRange.map(date => {
      const dateKey = startOfDay(date);
      const count = logs.filter(log => {
        const logDate = startOfDay(new Date(log.date));
        return logDate.getTime() === dateKey.getTime();
      }).length;
      
      return {
        date: dateKey.toISOString().split('T')[0],
        completions: count
      };
    });
    
    res.json(dailyData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily progress', error: error.message });
  }
});

module.exports = router;
