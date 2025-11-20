'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'

function AddTaskForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const taskId = searchParams.get('id')
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (taskId) {
      fetchTask()
    }
  }, [taskId])

  const fetchTask = async () => {
    try {
      const response = await api.get('/api/tasks')
      const task = response.data.tasks.find((t: any) => t._id === taskId)
      if (task) {
        setTitle(task.title)
        setDescription(task.description)
        setStatus(task.status)
      }
    } catch (error) {
      toast.error('Failed to fetch task')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Task title is required')
      return
    }

    setLoading(true)
    try {
      if (taskId) {
        await api.put(`/api/tasks/${taskId}`, { title, description, status })
        toast.success('Task updated successfully!')
      } else {
        await api.post('/api/tasks', { title, description, status })
        toast.success('Task created successfully!')
      }
      router.push('/dashboard/tasks')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 drop-shadow-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        {taskId ? 'Edit Task' : 'Add Task'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-gradient-to-br from-primary-lightGray/90 to-primary-lightGray/70 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-2xl border border-primary-lightGray/50 space-y-5 sm:space-y-6">
          <div>
            <label className="block text-white mb-2 font-medium text-sm sm:text-base">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full bg-primary-gray/80 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:shadow-lg focus:shadow-primary-yellow/30 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base border border-primary-lightGray/50"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-medium text-sm sm:text-base">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={6}
              className="w-full bg-primary-gray/80 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:shadow-lg focus:shadow-primary-yellow/30 shadow-md hover:shadow-lg transition-all duration-200 resize-none text-sm sm:text-base border border-primary-lightGray/50"
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-medium text-sm sm:text-base">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-primary-gray/80 backdrop-blur-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:shadow-lg focus:shadow-primary-yellow/30 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base border border-primary-lightGray/50"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none bg-gradient-to-r from-primary-yellow to-yellow-400 text-primary-dark px-6 py-3 rounded-xl font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-primary-yellow/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:scale-105 active:scale-95"
            >
              {loading ? 'Saving...' : taskId ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/tasks')}
              className="flex-1 sm:flex-none bg-primary-gray/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:scale-105 active:scale-95 border border-primary-lightGray/50"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function AddTaskPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <AddTaskForm />
    </Suspense>
  )
}

