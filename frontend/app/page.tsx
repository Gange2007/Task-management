'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle, Zap, Shield, BarChart3, Users, Bell,
  ArrowRight, Star, ChevronRight, Layers, Clock, Target
} from 'lucide-react';

const features = [
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Task Management',
    description: 'Create, organize, and track tasks with priority levels, categories, and due dates.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Kanban Board',
    description: 'Drag and drop tasks across Pending, In Progress, and Completed columns.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Analytics & Charts',
    description: 'Track your productivity with visual charts and weekly completion statistics.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Updates',
    description: 'Instant UI updates powered by Socket.io — no page refreshes needed.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure Auth',
    description: 'JWT-based authentication with bcrypt password hashing for maximum security.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Smart Notifications',
    description: 'Get notified when task deadlines approach or tasks are updated.',
    color: 'from-rose-500 to-pink-500',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds and set up your personalized workspace.',
    icon: <Users className="w-8 h-8" />,
  },
  {
    number: '02',
    title: 'Add Your Tasks',
    description: 'Create tasks with priorities, categories, and due dates to stay organized.',
    icon: <Target className="w-8 h-8" />,
  },
  {
    number: '03',
    title: 'Track & Complete',
    description: 'Monitor progress on your dashboard and celebrate completed work.',
    icon: <Clock className="w-8 h-8" />,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4" />
            <span>The ultimate task management solution</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6"
          >
            Organize your work,{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              amplify results
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            TaskFlow helps you manage tasks, track progress, and hit your goals — all in a clean, modern interface built for focus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-300 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
            >
              Sign in
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 text-gray-600 dark:text-gray-400"
          >
            {[
              { value: 'Kanban Board', label: 'Drag & Drop' },
              { value: 'Real-Time', label: 'Live Updates' },
              { value: 'Charts', label: 'Analytics' },
              { value: 'Secure', label: 'JWT Auth' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="relative max-w-5xl mx-auto mt-16"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-900 to-gray-900">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 ml-3">
                <div className="w-48 h-5 rounded bg-gray-700 mx-auto" />
              </div>
            </div>
            {/* Fake dashboard UI */}
            <div className="p-6 grid grid-cols-4 gap-4">
              {[
                { label: 'Total Tasks', value: '24', color: 'from-blue-500 to-cyan-500' },
                { label: 'Completed', value: '16', color: 'from-green-500 to-emerald-500' },
                { label: 'In Progress', value: '5', color: 'from-orange-500 to-amber-500' },
                { label: 'High Priority', value: '3', color: 'from-red-500 to-rose-500' },
              ].map((card) => (
                <div key={card.label} className="rounded-xl p-4 bg-white/5 border border-white/10">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                    {card.value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{card.label}</div>
                  <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${card.color} opacity-50`} />
                </div>
              ))}
              <div className="col-span-4 grid grid-cols-3 gap-3 mt-2">
                {['Pending', 'In Progress', 'Completed'].map((col, i) => (
                  <div key={col} className="rounded-lg p-3 bg-white/5 border border-white/10">
                    <div className="text-xs font-semibold text-gray-400 mb-2">{col}</div>
                    {[...Array(i === 2 ? 2 : 3)].map((_, j) => (
                      <div key={j} className="mb-2 rounded-lg p-2 bg-white/5">
                        <div className="h-2 bg-gray-600 rounded w-3/4 mb-1" />
                        <div className="h-2 bg-gray-700 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Floating glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to stay{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                productive
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              TaskFlow combines all the tools you need in one seamless experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get started in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3 simple steps
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              From sign up to organized in minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900" />
                )}
                <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-6 shadow-lg">
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">{step.number}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-16 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to supercharge your productivity?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join TaskFlow today and take control of your work.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-blue-600 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
            >
              Start for free
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">TaskFlow</span>
        </div>
        <p>© {new Date().getFullYear()} TaskFlow. Built with Next.js, Express & MongoDB.</p>
      </footer>
    </div>
  );
}
