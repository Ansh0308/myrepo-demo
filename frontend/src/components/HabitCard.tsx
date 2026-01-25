import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Flame, CheckCircle, Circle } from 'lucide-react';
import { Habit, StreakData } from '../types';
import { logsApi, analyticsApi } from '../api';
import { getTodayDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onUpdate: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete, onUpdate }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, bestStreak: 0, totalCompletions: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHabitData();
  }, [habit._id]);

  const loadHabitData = async () => {
    try {
      const today = getTodayDate();
      const logs = await logsApi.getAll({ habitId: habit._id, startDate: today, endDate: today });
      setIsCompleted(logs.length > 0 && logs[0].completed);
      
      const streaks = await analyticsApi.getStreaks(habit._id);
      setStreakData(streaks);
    } catch (error) {
      console.error('Error loading habit data:', error);
    }
  };

  const handleToggleComplete = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const today = getTodayDate();
      
      if (isCompleted) {
        await logsApi.deleteByHabitAndDate(habit._id, today);
        setIsCompleted(false);
        toast.success('Habit unchecked');
      } else {
        await logsApi.create({ habitId: habit._id, date: today, completed: true });
        setIsCompleted(true);
        toast.success('Habit completed! 🎉');
      }
      
      await loadHabitData();
      onUpdate();
    } catch (error) {
      toast.error('Failed to update habit');
      console.error('Error toggling habit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl relative overflow-hidden group"
      style={{
        borderLeft: `4px solid ${habit.color}`,
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `linear-gradient(135deg, ${habit.color} 0%, transparent 100%)`,
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <span className="text-4xl">{habit.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {habit.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {habit.category}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(habit)}
              className="p-2 rounded-lg glass-card hover:scale-110 transition-transform"
            >
              <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
            <button
              onClick={() => onDelete(habit._id)}
              className="p-2 rounded-lg glass-card hover:scale-110 transition-transform"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>

        {habit.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {habit.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {streakData.currentStreak}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">days</span>
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Best: {streakData.bestStreak}
            </div>
          </div>
          
          <div className="px-3 py-1 rounded-full glass-card text-xs font-medium text-gray-700 dark:text-gray-300">
            {habit.frequency.type}
          </div>
        </div>

        <button
          onClick={handleToggleComplete}
          disabled={loading}
          className={`
            w-full py-3 rounded-xl font-medium transition-all duration-300
            flex items-center justify-center space-x-2
            ${isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
              : 'glass-card text-gray-700 dark:text-gray-300 hover:scale-105'
            }
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Completed Today</span>
            </>
          ) : (
            <>
              <Circle className="w-5 h-5" />
              <span>Mark as Complete</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
