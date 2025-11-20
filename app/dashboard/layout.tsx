'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/signin')
  }

  const navItems = [
    { href: '/dashboard/tasks', label: 'Tasks' },
    { href: '/dashboard/add-task', label: 'Add Task' },
    { href: '/dashboard/task-status', label: 'Task Status' },
    { href: '/dashboard/profile', label: 'Profile' },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-primary-dark">
        {/* Desktop Navbar */}
        <nav className="hidden md:flex bg-primary-gray/95 backdrop-blur-md border-b border-primary-lightGray/50 px-4 lg:px-6 py-4 items-center sticky top-0 z-30 relative shadow-xl">
          {/* Logo - Top Left */}
          <Link href="/dashboard/tasks" className="flex items-center space-x-2 flex-shrink-0 group">
            <div className="bg-gradient-to-br from-primary-yellow to-yellow-400 w-9 h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
              <span className="text-primary-dark font-bold text-lg lg:text-xl">T</span>
            </div>
            <h1 className="text-white text-lg lg:text-xl font-semibold group-hover:text-primary-yellow transition-colors duration-200">Taskify</h1>
          </Link>

          {/* Navigation Items - Centered */}
          <div className="flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-yellow to-yellow-400 text-primary-dark font-semibold shadow-lg shadow-primary-yellow/30'
                      : 'text-gray-300 hover:text-white hover:bg-primary-lightGray/50 hover:shadow-md'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* User Info & Logout - Far Right */}
          <div className="flex items-center space-x-3 lg:space-x-4 flex-shrink-0 ml-auto">
            <span className="text-gray-300 text-sm lg:text-base hidden lg:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 lg:px-4 py-2 bg-primary-lightGray/80 backdrop-blur-sm text-white rounded-lg hover:bg-primary-lightGray hover:shadow-lg transition-all duration-200 text-sm lg:text-base border border-primary-lightGray/50"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Mobile Header */}
        <div className="md:hidden bg-primary-gray/95 backdrop-blur-md border-b border-primary-lightGray/50 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xl">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-yellow to-yellow-400 w-9 h-9 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-primary-dark font-bold text-lg">T</span>
            </div>
            <h1 className="text-white text-lg font-semibold">Taskify</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2 hover:bg-primary-lightGray/50 rounded-lg transition-all duration-200 hover:shadow-md"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`md:hidden fixed top-0 left-0 h-full w-64 bg-primary-gray/95 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out shadow-2xl border-r border-primary-lightGray/50 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <div className="bg-primary-yellow w-9 h-9 rounded-lg flex items-center justify-center">
                  <span className="text-primary-dark font-bold text-lg">T</span>
                </div>
                <h1 className="text-white text-lg font-semibold">Taskify</h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white p-2 hover:bg-primary-lightGray rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-yellow to-yellow-400 text-primary-dark font-semibold shadow-lg shadow-primary-yellow/30'
                        : 'text-gray-300 hover:text-white hover:bg-primary-lightGray/50 hover:shadow-md'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="pt-4 border-t border-primary-lightGray">
              <div className="px-4 py-2 text-gray-300 text-sm mb-3">
                {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-primary-lightGray/80 backdrop-blur-sm text-white rounded-lg hover:bg-primary-lightGray hover:shadow-lg transition-all duration-200 font-medium border border-primary-lightGray/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}

