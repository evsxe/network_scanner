"use client"

import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"

export default function ProfilePage({ onBack }: { onBack: () => void }) {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-100">Profile</h1>
        <p className="text-gray-400">User profile and settings</p>
      </header>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-300 mr-4">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-100">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Account Information</h3>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-md p-2.5">
                  <p className="text-xs font-medium text-gray-400">User ID</p>
                  <p className="text-sm text-gray-200">{user.id}</p>
                </div>
                <div className="bg-gray-700 rounded-md p-2.5">
                  <p className="text-xs font-medium text-gray-400">Role</p>
                  <p className="text-sm text-gray-200">{user.role}</p>
                </div>
                <div className="bg-gray-700 rounded-md p-2.5">
                  <p className="text-xs font-medium text-gray-400">Account Created</p>
                  <p className="text-sm text-gray-200">January 15, 2023</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Activity</h3>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-md p-2.5">
                  <p className="text-sm text-gray-200">Login from 192.168.1.105</p>
                  <p className="text-xs text-gray-400">Today at {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="bg-gray-700 rounded-md p-2.5">
                  <p className="text-sm text-gray-200">Password changed</p>
                  <p className="text-xs text-gray-400">3 days ago</p>
                </div>
                <div className="bg-gray-700 rounded-md p-2.5">
                  <p className="text-sm text-gray-200">New scan started</p>
                  <p className="text-xs text-gray-400">1 week ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <Button onClick={logout} className="bg-red-600 hover:bg-red-700">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
