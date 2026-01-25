import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Habit, HabitLog } from '../types';
import { habitsApi, logsApi } from '../api';
import toast from 'react-hot-toast';

const CalendarView: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [habitsData, logsData] = await Promise.all([
        habitsApi.getAll(),
        logsApi.getAll({
          startDate: format(startOfMonth(currentMonth), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(currentMonth), 'yyyy-MM-dd'),
        }),
      ]);
      setHabits(habitsData);
      setLogs(logsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getLogsForDate = (date: Date) => {
    return logs.filter(log => isSameDay(new Date(log.date), date) && log.completed);
  };

  const handleToggleLog = async (habitId: string, date: Date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const existingLog = logs.find(
        log => log.habitId === habitId && isSameDay(new Date(log.date), date)
      );

      if (existingLog) {
        await logsApi.deleteByHabitAndDate(habitId, dateStr);
        setLogs(logs.filter(log => log._id !== existingLog._id));
        toast.success('Log removed');
      } else {
        const newLog = await logsApi.create({ habitId, date: dateStr, completed: true });
        setLogs([...logs, newLog]);
        toast.success('Log added');
      }
    } catch (error) {
      console.error('Error toggling log:', error);
      toast.error('Failed to update log');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Calendar</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl glass-card hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <span className="text-xl font-semibold text-gray-800 dark:text-white min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl glass-card hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {monthDays.map(day => {
            const dayLogs = getLogsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`
                  aspect-square glass-card rounded-xl p-2 transition-all hover:scale-105
                  ${isToday ? 'ring-2 ring-indigo-500' : ''}
                  ${isSelected ? 'glass-card-strong scale-105' : ''}
                `}
              >
                <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                  {format(day, 'd')}
                </div>
                {dayLogs.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {dayLogs.slice(0, 3).map((log, idx) => {
                      const habit = habits.find(h => h._id === log.habitId);
                      return (
                        <div
                          key={idx}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: habit?.color || '#6366f1' }}
                        />
                      );
                    })}
                    {dayLogs.length > 3 && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        +{dayLogs.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="glass-card rounded-2xl p-6 animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {habits.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No habits yet. Create one to get started!</p>
          ) : (
            <div className="space-y-3">
              {habits.map(habit => {
                const isLogged = logs.some(
                  log => log.habitId === habit._id && isSameDay(new Date(log.date), selectedDate) && log.completed
                );
                
                return (
                  <button
                    key={habit._id}
                    onClick={() => handleToggleLog(habit._id, selectedDate)}
                    className={`
                      w-full p-4 rounded-xl transition-all flex items-center justify-between
                      ${isLogged
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                        : 'glass-card text-gray-800 dark:text-white hover:scale-105'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <span className="font-medium">{habit.name}</span>
                    </div>
                    {isLogged && (
                      <span className="text-sm">✓ Completed</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
