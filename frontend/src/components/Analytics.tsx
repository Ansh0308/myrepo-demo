import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { analyticsApi } from '../api';
import { OverviewStats, DailyProgress } from '../types';

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewData, progressData] = await Promise.all([
        analyticsApi.getOverview(period),
        analyticsApi.getDailyProgress(period === 'week' ? 7 : 30),
      ]);
      setOverview(overviewData);
      setDailyProgress(progressData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#22c55e'];

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
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('week')}
            className={`
              px-4 py-2 rounded-xl font-medium transition-all
              ${period === 'week'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'glass-card text-gray-700 dark:text-gray-300'
              }
            `}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`
              px-4 py-2 rounded-xl font-medium transition-all
              ${period === 'month'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'glass-card text-gray-700 dark:text-gray-300'
              }
            `}
          >
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Habits</h3>
          </div>
          <p className="text-4xl font-bold text-gray-800 dark:text-white">
            {overview?.totalHabits || 0}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Completions</h3>
          </div>
          <p className="text-4xl font-bold text-gray-800 dark:text-white">
            {overview?.totalCompletions || 0}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Avg / Day</h3>
          </div>
          <p className="text-4xl font-bold text-gray-800 dark:text-white">
            {overview && dailyProgress.length > 0
              ? Math.round(overview.totalCompletions / dailyProgress.length * 10) / 10
              : 0
            }
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Daily Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            <Line
              type="monotone"
              dataKey="completions"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {overview && overview.categoryBreakdown.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overview.categoryBreakdown}
                  dataKey="completions"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {overview.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              Category Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overview.categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="completions" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
