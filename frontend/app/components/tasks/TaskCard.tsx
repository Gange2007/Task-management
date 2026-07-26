'use client';

import { motion } from 'framer-motion';
import { Calendar, Edit3, Trash2, Tag, Clock } from 'lucide-react';
import { Task } from '../../types';
import { format, isAfter, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange?: (task: Task, status: Task['status']) => void;
  delay?: number;
  draggable?: boolean;
}

const priorityConfig = {
  Low: { class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
  Medium: { class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
  High: { class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
};

const statusConfig = {
  'Pending': 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, delay = 0, draggable }: TaskCardProps) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Completed';
  const isDueSoon = task.dueDate && !isOverdue && !isPast(new Date(task.dueDate)) &&
    isAfter(new Date(task.dueDate), new Date()) &&
    new Date(task.dueDate).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -1 }}
      className={`group bg-white dark:bg-gray-800 rounded-2xl p-4 border transition-all hover:shadow-md cursor-pointer ${
        task.status === 'Completed'
          ? 'border-green-100 dark:border-green-900/30'
          : isOverdue
          ? 'border-red-200 dark:border-red-900/30'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {onStatusChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextStatus: Record<Task['status'], Task['status']> = {
                  'Pending': 'In Progress',
                  'In Progress': 'Completed',
                  'Completed': 'Pending',
                };
                onStatusChange(task, nextStatus[task.status]);
              }}
              className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                task.status === 'Completed'
                  ? 'bg-green-500 border-green-500'
                  : task.status === 'In Progress'
                  ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              {task.status === 'Completed' && (
                <svg className="w-2.5 h-2.5 mx-auto text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10 3L5 8.5 2.5 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          )}
          <p className={`text-sm font-semibold leading-snug ${
            task.status === 'Completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[task.priority].class}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[task.priority].dot}`} />
          {task.priority}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[task.status]}`}>
          {task.status}
        </span>
        {task.category && task.category !== 'General' && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 font-medium">
            <Tag className="w-3 h-3" />
            {task.category}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(task.createdAt), 'MMM d')}
        </span>
        {task.dueDate && (
          <span className={`flex items-center gap-1 font-medium ${
            isOverdue ? 'text-red-500' : isDueSoon ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
          }`}>
            <Calendar className="w-3 h-3" />
            {isOverdue ? '⚠ Overdue · ' : isDueSoon ? '⏰ Due soon · ' : ''}
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>
    </motion.div>
  );
}
