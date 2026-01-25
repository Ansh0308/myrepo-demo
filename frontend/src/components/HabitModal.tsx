import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Habit, HabitFormData, Category } from '../types';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HabitFormData) => Promise<void>;
  habit?: Habit;
}

const categories: Category[] = [
  'Health', 'Fitness', 'Learning', 'Productivity', 
  'Mindfulness', 'Social', 'Creative', 'Finance', 'Other'
];

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
];

const icons = [
  '🎯', '💪', '📚', '🏃', '🧘', '💤', '💧', '🥗', '🎨',
  '✍️', '🎵', '🎮', '📱', '💼', '🌱', '☀️', '🌙', '⭐',
  '🔥', '✨', '🎪', '🎭', '🎬', '📷', '🎸', '🎹'
];

const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onSave, habit }) => {
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    color: '#6366f1',
    icon: '🎯',
    category: 'Other',
    frequency: { type: 'daily' },
    reminderEnabled: false,
    reminderTime: '09:00',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description,
        color: habit.color,
        icon: habit.icon,
        category: habit.category,
        frequency: habit.frequency,
        reminderEnabled: habit.reminderEnabled,
        reminderTime: habit.reminderTime,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#6366f1',
        icon: '🎯',
        category: 'Other',
        frequency: { type: 'daily' },
        reminderEnabled: false,
        reminderTime: '09:00',
      });
    }
  }, [habit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving habit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative glass-card-strong rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {habit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
          >
            <X className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Habit Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-card text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Morning Meditation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-card text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Optional description..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="w-full px-4 py-3 rounded-xl glass-card text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-9 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`
                    p-3 rounded-xl text-2xl transition-all
                    ${formData.icon === icon
                      ? 'glass-card-strong scale-110 shadow-lg'
                      : 'glass-card hover:scale-110'
                    }
                  `}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-9 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`
                    w-10 h-10 rounded-xl transition-all
                    ${formData.color === color
                      ? 'scale-110 ring-4 ring-white dark:ring-gray-800'
                      : 'hover:scale-110'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency
            </label>
            <select
              value={formData.frequency.type}
              onChange={(e) => setFormData({
                ...formData,
                frequency: { type: e.target.value as 'daily' | 'weekly' | 'custom' }
              })}
              className="w-full px-4 py-3 rounded-xl glass-card text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="reminder"
              checked={formData.reminderEnabled}
              onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <label htmlFor="reminder" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Reminder
            </label>
            {formData.reminderEnabled && (
              <input
                type="time"
                value={formData.reminderTime}
                onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                className="px-4 py-2 rounded-xl glass-card text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl glass-card text-gray-700 dark:text-gray-300 font-medium hover:scale-105 transition-transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? 'Saving...' : (habit ? 'Update Habit' : 'Create Habit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
