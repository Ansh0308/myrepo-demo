const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  icon: {
    type: String,
    default: '🎯'
  },
  category: {
    type: String,
    required: true,
    enum: ['Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Social', 'Creative', 'Finance', 'Other'],
    default: 'Other'
  },
  frequency: {
    type: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily'
    },
    customDays: [{
      type: Number,
      min: 0,
      max: 6
    }],
    targetPerWeek: {
      type: Number,
      min: 1,
      max: 7
    }
  },
  reminderEnabled: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: String,
    default: '09:00'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    default: 'default-user'
  }
});

module.exports = mongoose.model('Habit', habitSchema);
