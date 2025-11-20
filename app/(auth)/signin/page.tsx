'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login, user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard/tasks')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      toast.success('Signed in successfully!')
      router.push('/dashboard/tasks')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-primary-gray rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl w-full">
      {/* Logo and App Name */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="bg-primary-yellow w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mr-3">
          <span className="text-primary-dark font-bold text-xl sm:text-2xl">T</span>
        </div>
        <h1 className="text-white text-xl sm:text-2xl font-semibold">Taskify</h1>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 sm:mb-8 gap-2">
        <Link
          href="/signin"
          className="flex-1 bg-primary-yellow text-primary-dark py-2.5 sm:py-3 px-4 rounded-lg text-center font-medium shadow-lg shadow-black/30 text-sm sm:text-base"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="flex-1 bg-primary-lightGray text-white py-2.5 sm:py-3 px-4 rounded-lg text-center font-medium hover:bg-primary-lightGray/80 transition-colors text-sm sm:text-base"
        >
          Sign Up
        </Link>
      </div>

      {/* Heading */}
      <h2 className="text-white text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8">
        Welcome back
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-primary-lightGray text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-primary-lightGray text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow text-sm sm:text-base"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-yellow text-primary-dark py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

