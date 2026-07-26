'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, SortAsc, CheckSquare } from 'lucide-react';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Task, TaskFilters } from '../../types';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Socket.io real-time updates
  useEffect(() => {
    if (!user) return;
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    socketRef.current = socket;
    socket.emit('join-room', user._id);

    socket.on('task-created', (task: Task) => {
      setTasks((prev) => [task, ...prev]);
      toast('New task created!', { icon: '✅' });
    });

    socket.on('task-updated', (updated: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    });

    socket.on('task-deleted', (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => { socket.disconnect(); };
  }, [user]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCreate = async (data: Partial<Task>) => {
    setIsSubmitting(true);
    try {
      await api.post('/tasks', data);
      toast.success('Task created!');
      setIsModalOpen(false);
      fetchTasks();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      await api.put(`/tasks/${editingTask._id}`, data);
      toast.success('Task updated!');
      setEditingTask(null);
      setIsModalOpen(false);
      fetchTasks();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${deletingTask._id}`);
      toast.success('Task deleted');
      setDeletingTask(null);
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={filters.priority || 'All'}
              onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
              className="py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status filter */}
          <select
            value={filters.status || 'All'}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              className="py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
              <div className="flex gap-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <CheckSquare className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {filters.search || filters.status !== 'All' || filters.priority !== 'All'
              ? 'No tasks match your filters'
              : 'No tasks yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            {filters.search ? 'Try a different search term or clear filters.' : 'Create your first task to get started.'}
          </p>
          {!filters.search && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Plus className="w-4 h-4" /> Create Task
            </button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEditModal}
                onDelete={setDeletingTask}
                onStatusChange={handleStatusChange}
                delay={i * 0.04}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
