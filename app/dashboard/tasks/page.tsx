'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Task {
  _id: string
  title: string
  description: string
  status: string
  createdAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTasks()
  }, [statusFilter, search])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (statusFilter) params.status = statusFilter
      if (search) params.search = search
      
      const response = await api.get('/api/tasks', { params })
      setTasks(response.data.tasks)
    } catch (error: any) {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await api.delete(`/api/tasks/${id}`)
      toast.success('Task deleted successfully')
      fetchTasks()
    } catch (error: any) {
      toast.error('Failed to delete task')
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      await api.put(`/api/tasks/${task._id}`, { 
        title: task.title, 
        description: task.description, 
        status: newStatus 
      })
      toast.success(`Task marked as ${newStatus === 'completed' ? 'completed' : 'pending'}`)
      fetchTasks()
    } catch (error: any) {
      toast.error('Failed to update task status')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Tasks</h1>
        <button
          onClick={() => router.push('/dashboard/add-task')}
          className="w-full sm:w-auto bg-gradient-to-r from-primary-yellow to-yellow-400 text-primary-dark px-4 sm:px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-primary-yellow/50 hover:scale-105 active:scale-95"
        >
          Add Task
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-primary-lightGray/80 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:shadow-lg focus:shadow-primary-yellow/30 shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base border border-primary-lightGray/50"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-primary-lightGray/80 backdrop-blur-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:shadow-lg focus:shadow-primary-yellow/30 shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base sm:w-auto w-full border border-primary-lightGray/50"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-gray-400 text-center py-12 bg-primary-lightGray/80 backdrop-blur-sm rounded-xl shadow-2xl border border-primary-lightGray/50 hover:shadow-primary-yellow/10 transition-all duration-300">
          <p className="text-lg mb-2 font-semibold">No tasks found</p>
          <p className="text-sm">Create your first task to get started!</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gradient-to-br from-primary-lightGray/90 to-primary-lightGray/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-opacity-100 transition-all duration-300 border border-primary-lightGray/50 shadow-xl hover:shadow-2xl hover:shadow-primary-yellow/20 hover:border-primary-yellow/40 hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => handleToggleComplete(task)}
                      className="w-5 h-5 rounded border-2 border-gray-400 bg-transparent text-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-offset-2 cursor-pointer accent-primary-yellow shadow-md hover:shadow-lg transition-all duration-200"
                    />
                    <h3 className={`text-white text-lg sm:text-xl font-semibold break-words ${
                      task.status === 'completed' ? 'line-through opacity-60' : ''
                    }`}>
                      {task.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3 text-sm sm:text-base break-words">
                    {task.description || 'No description'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize shadow-md ${
                        task.status === 'completed'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-green-500/20'
                          : task.status === 'in-progress'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-blue-500/20'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-yellow-500/20'
                      }`}
                    >
                      {task.status.replace('-', ' ')}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => router.push(`/dashboard/add-task?id=${task._id}`)}
                    className="flex-1 sm:flex-none bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500/30 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95 backdrop-blur-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="flex-1 sm:flex-none bg-red-500/20 text-red-400 border border-red-500/30 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95 backdrop-blur-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

