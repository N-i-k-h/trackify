'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [originalName, setOriginalName] = useState('')
  const [originalEmail, setOriginalEmail] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile')
      const profile = response.data.profile
      setName(profile.name)
      setEmail(profile.email)
      setOriginalName(profile.name)
      setOriginalEmail(profile.email)
    } catch (error) {
      toast.error('Failed to fetch profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setOriginalName(name)
    setOriginalEmail(email)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setName(originalName)
    setEmail(originalEmail)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    setLoading(true)
    try {
      const response = await api.put('/api/profile', { name, email })
      updateUser({ name, email })
      setOriginalName(name)
      setOriginalEmail(email)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (profileLoading) {
    return <div className="text-white">Loading profile...</div>
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 drop-shadow-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Profile</h1>

      <div className="max-w-2xl">
        <div className="bg-gradient-to-br from-primary-lightGray/90 to-primary-lightGray/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl border border-primary-lightGray/50 hover:shadow-primary-yellow/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-primary-yellow to-yellow-400 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 shadow-xl ring-4 ring-primary-yellow/20 hover:ring-primary-yellow/40 transition-all duration-300">
                <span className="text-primary-dark font-bold text-lg sm:text-2xl">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-white text-lg sm:text-xl font-semibold break-words">{user?.name}</h2>
                <p className="text-gray-400 text-sm sm:text-base break-words">{user?.email}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 sm:px-6 py-2 rounded-xl font-semibold hover:bg-blue-500/30 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 text-sm sm:text-base hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-primary-lightGray/90 to-primary-lightGray/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-2xl border border-primary-lightGray/50 hover:shadow-primary-yellow/10 transition-all duration-300">
          <div className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className={`w-full bg-primary-gray/80 backdrop-blur-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:shadow-lg focus:shadow-primary-yellow/30 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base border border-primary-lightGray/50 ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className={`w-full bg-primary-gray/80 backdrop-blur-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:shadow-lg focus:shadow-primary-yellow/30 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base border border-primary-lightGray/50 ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                required
              />
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-primary-yellow to-yellow-400 text-primary-dark px-6 py-3 rounded-xl font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-primary-yellow/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-105 active:scale-95 shadow-lg"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 sm:flex-none bg-primary-gray/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-105 active:scale-95 shadow-md border border-primary-lightGray/50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

