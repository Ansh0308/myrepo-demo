import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Habit, HabitFormData, Category } from '../types';
import { habitsApi } from '../api';
import HabitCard from './HabitCard';
import HabitModal from './HabitModal';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredHabits(habits);
    } else {
      setFilteredHabits(habits.filter(h => h.category === selectedCategory));
    }
  }, [habits, selectedCategory]);

  const loadHabits = async () => {
    setLoading(true);
    try {
      const data = await habitsApi.getAll();
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (data: HabitFormData) => {
    try {
      await habitsApi.create(data);
      toast.success('Habit created successfully!');
      loadHabits();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
      throw error;
    }
  };

  const handleUpdateHabit = async (data: HabitFormData) => {
    if (!editingHabit) return;
    
    try {
      await habitsApi.update(editingHabit._id, data);
      toast.success('Habit updated successfully!');
      loadHabits();
      setEditingHabit(undefined);
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
      throw error;
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit? All associated data will be lost.')) {
      return;
    }
    
    try {
      await habitsApi.delete(habitId);
      toast.success('Habit deleted successfully');
      loadHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingHabit(undefined), 300);
  };

  const categories: (Category | 'All')[] = [
    'All', 'Health', 'Fitness', 'Learning', 'Productivity',
    'Mindfulness', 'Social', 'Creative', 'Finance', 'Other'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Habits
        </h2>
        <button
          onClick={() => {
            setEditingHabit(undefined);
            setIsModalOpen(true);
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-105 transition-transform shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Habit</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all
                ${selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'glass-card text-gray-700 dark:text-gray-300 hover:scale-105'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredHabits.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No habits yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {selectedCategory === 'All'
              ? "Start building better habits by creating your first one!"
              : `No habits in the ${selectedCategory} category yet.`
            }
          </p>
          <button
            onClick={() => {
              setEditingHabit(undefined);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-105 transition-transform shadow-lg"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map(habit => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
              onUpdate={loadHabits}
            />
          ))}
        </div>
      )}

      <HabitModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={editingHabit ? handleUpdateHabit : handleCreateHabit}
        habit={editingHabit}
      />
    </div>
  );
};

export default Dashboard;
