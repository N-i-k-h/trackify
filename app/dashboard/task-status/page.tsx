'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Task {
  _id: string
  title: string
  description: string
  status: string
}

export default function TaskStatusPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks')
      setTasks(response.data.tasks)
    } catch (error) {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 drop-shadow-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Task Status</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-primary-lightGray/90 to-primary-lightGray/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-lightGray/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">Total Tasks</h3>
          <p className="text-white text-2xl sm:text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300">
          <h3 className="text-yellow-400 text-xs sm:text-sm mb-2 font-medium">Pending</h3>
          <p className="text-white text-2xl sm:text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
          <h3 className="text-blue-400 text-xs sm:text-sm mb-2 font-medium">In Progress</h3>
          <p className="text-white text-2xl sm:text-3xl font-bold">{stats.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
          <h3 className="text-green-400 text-xs sm:text-sm mb-2 font-medium">Completed</h3>
          <p className="text-white text-2xl sm:text-3xl font-bold">{stats.completed}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-br from-primary-lightGray/90 to-primary-lightGray/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-2xl border border-primary-lightGray/50">
        <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">Completion Rate</h3>
        <div className="w-full bg-primary-gray/80 backdrop-blur-sm rounded-full h-4 sm:h-5 shadow-inner">
          <div
            className="bg-gradient-to-r from-primary-yellow to-yellow-400 h-4 sm:h-5 rounded-full transition-all duration-500 shadow-lg shadow-primary-yellow/30"
            style={{
              width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
            }}
          />
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mt-3 font-medium">
          {stats.total > 0
            ? `${Math.round((stats.completed / stats.total) * 100)}% completed`
            : 'No tasks yet'}
        </p>
      </div>

      {/* Tasks by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">Pending ({stats.pending})</h3>
          <div className="space-y-2 sm:space-y-3">
            {tasks
              .filter((t) => t.status === 'pending')
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-gradient-to-br from-primary-lightGray/90 to-primary-lightGray/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-primary-lightGray/50 shadow-lg hover:shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <h4 className="text-white font-medium text-sm sm:text-base break-words">{task.title}</h4>
                </div>
              ))}
            {stats.pending === 0 && (
              <p className="text-gray-400 text-xs sm:text-sm bg-primary-lightGray/50 rounded-xl p-3 text-center">No pending tasks</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            In Progress ({stats.inProgress})
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {tasks
              .filter((t) => t.status === 'in-progress')
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-gradient-to-br from-primary-lightGray/90 to-primary-lightGray/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-primary-lightGray/50 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <h4 className="text-white font-medium text-sm sm:text-base break-words">{task.title}</h4>
                </div>
              ))}
            {stats.inProgress === 0 && (
              <p className="text-gray-400 text-xs sm:text-sm bg-primary-lightGray/50 rounded-xl p-3 text-center">No in-progress tasks</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            Completed ({stats.completed})
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {tasks
              .filter((t) => t.status === 'completed')
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-gradient-to-br from-primary-lightGray/90 to-primary-lightGray/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-primary-lightGray/50 shadow-lg hover:shadow-xl hover:shadow-green-500/10 hover:border-green-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <h4 className="text-white font-medium text-sm sm:text-base break-words line-through opacity-75">{task.title}</h4>
                </div>
              ))}
            {stats.completed === 0 && (
              <p className="text-gray-400 text-xs sm:text-sm bg-primary-lightGray/50 rounded-xl p-3 text-center">No completed tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

