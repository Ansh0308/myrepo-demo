const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

router.get('/data', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    
    const habits = await Habit.find({ userId }).lean();
    const logs = await HabitLog.find({ userId }).lean();
    
    const exportData = {
      exportDate: new Date().toISOString(),
      habits,
      logs
    };
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting data', error: error.message });
  }
});

router.post('/import', async (req, res) => {
  try {
    const { habits, logs } = req.body;
    const userId = req.body.userId || 'default-user';
    
    if (!habits || !Array.isArray(habits)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }
    
    const importedHabits = [];
    const habitIdMap = {};
    
    for (const habitData of habits) {
      const oldId = habitData._id;
      delete habitData._id;
      habitData.userId = userId;
      
      const habit = new Habit(habitData);
      await habit.save();
      
      importedHabits.push(habit);
      habitIdMap[oldId] = habit._id;
    }
    
    if (logs && Array.isArray(logs)) {
      for (const logData of logs) {
        delete logData._id;
        logData.userId = userId;
        
        if (habitIdMap[logData.habitId]) {
          logData.habitId = habitIdMap[logData.habitId];
          
          const existingLog = await HabitLog.findOne({
            habitId: logData.habitId,
            date: new Date(logData.date)
          });
          
          if (!existingLog) {
            const log = new HabitLog(logData);
            await log.save();
          }
        }
      }
    }
    
    res.json({ 
      message: 'Data imported successfully', 
      importedCount: importedHabits.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error importing data', error: error.message });
  }
});

module.exports = router;
