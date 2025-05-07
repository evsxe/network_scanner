"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authenticateUser, logoutUser } from "./auth-api"
import { isAuthenticated } from "./api-config"

type User = {
  id: string
  username: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authenticated, setAuthenticated] = useState<boolean>(false)

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const authStatus = isAuthenticated()

    if (storedUser && authStatus) {
      setUser(JSON.parse(storedUser))
      setAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const success = await authenticateUser({ username: email, password })

      if (success) {
        // Create a user object from the email
        const mockUser = {
          id: "usr_" + Math.random().toString(36).substring(2, 11),
          username: email.split("@")[0],
          email: email,
          role: "admin",
        }

        setUser(mockUser)
        setAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    logoutUser()
    setUser(null)
    setAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
