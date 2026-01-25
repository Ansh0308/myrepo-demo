import React, { useState, useRef } from 'react';
import { Download, Upload, Bell, Trash2 } from 'lucide-react';
import { exportApi, habitsApi, logsApi } from '../api';
import { downloadJSON, readJSONFile } from '../utils/exportUtils';
import { requestNotificationPermission } from '../utils/notifications';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(Notification.permission === 'granted');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const data = await exportApi.exportData();
      const filename = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(data, filename);
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJSONFile(file);
      
      if (!data.habits || !Array.isArray(data.habits)) {
        throw new Error('Invalid file format');
      }

      await exportApi.importData(data);
      toast.success(`Successfully imported ${data.habits.length} habits!`);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data. Please check the file format.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    
    if (granted) {
      toast.success('Notifications enabled!');
    } else {
      toast.error('Notifications denied');
    }
  };

  const handleClearAllData = async () => {
    if (!confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
      return;
    }

    if (!confirm('This will permanently delete all your habits and logs. Are you absolutely sure?')) {
      return;
    }

    try {
      const habits = await habitsApi.getAll();
      await Promise.all(habits.map(habit => habitsApi.delete(habit._id)));
      toast.success('All data cleared');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h2>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Notifications
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Browser Notifications
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get reminded about your habits
            </p>
          </div>
          <button
            onClick={handleEnableNotifications}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2
              ${notificationsEnabled
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'glass-card text-gray-700 dark:text-gray-300 hover:scale-105'
              }
            `}
          >
            <Bell className="w-5 h-5" />
            <span>{notificationsEnabled ? 'Enabled' : 'Enable'}</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Export Data
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download all your habits and logs as JSON
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:scale-105 transition-transform shadow-lg flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Import Data
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Restore from a previous backup
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:scale-105 transition-transform shadow-lg flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Import</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border-2 border-red-500/30">
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Clear All Data
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Permanently delete all habits and logs
            </p>
          </div>
          <button
            onClick={handleClearAllData}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:scale-105 transition-transform shadow-lg flex items-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          About
        </h3>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Description:</strong> A beautiful habit tracker with glassmorphism design</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Built with React, TypeScript, Node.js, Express, and MongoDB
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
