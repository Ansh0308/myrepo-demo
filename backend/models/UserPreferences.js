const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: 'default-user'
  },
  darkMode: {
    type: Boolean,
    default: false
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  weekStartsOn: {
    type: Number,
    default: 0,
    min: 0,
    max: 6
  },
  defaultView: {
    type: String,
    enum: ['grid', 'list', 'calendar'],
    default: 'grid'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
