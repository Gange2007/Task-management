'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare, Clock, CheckCircle2, AlertTriangle,
  Plus, TrendingUp, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatsCard from '../components/dashboard/StatsCard';
import api from '../lib/api';
import { TaskStats, WeeklyData, Task } from '../types';
import { format } from 'date-fns';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0, inProgress: 0, highPriority: 0 });
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/tasks/stats'),
        api.get('/tasks?limit=5'),
      ]);
      setStats(statsRes.data.stats);
      setWeeklyData(statsRes.data.weeklyData);
      setRecentTasks(tasksRes.data.tasks);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
    { name: 'Pending', value: stats.pending, color: '#94a3b8' },
  ].filter((d) => d.value > 0);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const priorityColor = {
    High: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    Medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400',
    Low: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
  };

  const statusColor = {
    'Pending': 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300',
    'In Progress': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
    'Completed': 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Link
          href="/dashboard/tasks"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Task
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={CheckSquare}
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          gradient="from-green-500 to-emerald-500"
          change={`${completionRate}% completion rate`}
          delay={0.1}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          gradient="from-orange-500 to-amber-500"
          delay={0.2}
        />
        <StatsCard
          title="High Priority"
          value={stats.highPriority}
          icon={AlertTriangle}
          gradient="from-red-500 to-rose-500"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Productivity</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tasks created vs completed</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" /> Created
              </span>
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Completed
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barGap={4}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9', fontSize: '12px' }}
                cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
              />
              <Bar dataKey="created" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Created" />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Status</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Distribution overview</p>
          </div>

          {stats.total === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <TrendingUp className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">No tasks yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      {entry.name}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your latest task activity</p>
          </div>
          <Link href="/dashboard/tasks" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks yet. Create your first task!</p>
            <Link
              href="/dashboard/tasks"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentTasks.map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'Completed' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {task.category} • {format(new Date(task.createdAt), 'MMM d')}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[task.status]}`}>
                    {task.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
