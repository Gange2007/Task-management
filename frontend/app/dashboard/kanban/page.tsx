'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Layers } from 'lucide-react';
import TaskModal from '../../components/tasks/TaskModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Task } from '../../types';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const columns: { id: Task['status']; title: string; color: string; bg: string }[] = [
  { id: 'Pending', title: 'Pending', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700/50' },
  { id: 'In Progress', title: 'In Progress', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'Completed', title: 'Completed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
];

const priorityDot: Record<Task['priority'], string> = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get('/tasks?limit=100');
      setTasks(res.data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const tasksByStatus = (status: Task['status']) => tasks.filter((t) => t.status === status);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as Task['status'];
    const task = tasks.find((t) => t._id === draggableId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks((prev) => prev.map((t) => t._id === draggableId ? { ...t, status: newStatus } : t));

    try {
      await api.put(`/tasks/${draggableId}`, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
    } catch {
      // Revert on error
      setTasks((prev) => prev.map((t) => t._id === draggableId ? { ...t, status: task.status } : t));
      toast.error('Failed to update task');
    }
  };

  const handleCreate = async (data: Partial<Task>) => {
    setIsSubmitting(true);
    try {
      await api.post('/tasks', data);
      toast.success('Task created!');
      setIsModalOpen(false);
      fetchTasks();
    } catch {
      toast.error('Failed to create task');
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
    } catch {
      toast.error('Failed to update task');
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

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.id} className="w-72 flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-3 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Kanban Board
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Drag and drop tasks to update their status
          </p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-6 min-h-[calc(100vh-200px)]">
          {columns.map((col) => {
            const colTasks = tasksByStatus(col.id);
            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-shrink-0 w-72 flex flex-col"
              >
                {/* Column header */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl mb-3 ${col.bg}`}>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold text-sm ${col.color}`}>{col.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20 ${col.color}`}>
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setIsModalOpen(true);
                    }}
                    className={`p-1 rounded-lg hover:bg-white/40 dark:hover:bg-black/20 transition-colors ${col.color}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 rounded-2xl p-2 min-h-[400px] transition-colors ${
                        snapshot.isDraggingOver
                          ? 'bg-blue-50 dark:bg-blue-900/10 ring-2 ring-blue-300 dark:ring-blue-700'
                          : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-300 dark:text-gray-600">
                          <p className="text-xs">Drop tasks here</p>
                        </div>
                      )}

                      {colTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              className={`bg-white dark:bg-gray-800 rounded-xl p-3.5 border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing transition-all ${
                                snapshot.isDragging
                                  ? 'shadow-2xl ring-2 ring-blue-400 rotate-1 scale-105'
                                  : 'hover:shadow-md'
                              }`}
                            >
                              {/* Task content */}
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <p className={`text-sm font-semibold leading-snug flex-1 ${
                                  task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {task.title}
                                </p>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                    className="text-gray-400 hover:text-blue-500 transition-colors p-0.5"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => setDeletingTask(task)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {task.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2.5 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                                  task.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                  'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority]}`} />
                                  {task.priority}
                                </span>
                                {task.dueDate && (
                                  <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {new Date(task.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </motion.div>
            );
          })}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete Task"
        message={`Delete "${deletingTask?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
