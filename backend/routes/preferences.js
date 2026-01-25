const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserPreferences');

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    let preferences = await UserPreferences.findOne({ userId });
    
    if (!preferences) {
      preferences = new UserPreferences({ userId });
      await preferences.save();
    }
    
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching preferences', error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user';
    
    let preferences = await UserPreferences.findOne({ userId });
    
    if (preferences) {
      Object.assign(preferences, req.body);
      preferences.updatedAt = new Date();
      await preferences.save();
    } else {
      preferences = new UserPreferences({ ...req.body, userId });
      await preferences.save();
    }
    
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
});

module.exports = router;
