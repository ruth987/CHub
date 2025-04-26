"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  accessToken: string 
  id: string
  name: string
  email: string
  image?: string
  isAnonymous?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginAnonymously: (displayName: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Replace with your auth check logic
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (_email: string, _password: string) => {
    console.log("login", _email, _password)
  }

  const loginAnonymously = async (_displayName: string) => {
    console.log("loginAnonymously", _displayName)
  }

  const signup = async (_email: string, _password: string, _name: string) => {
    console.log("signup", _email, _password, _name)
  }

  const logout = async () => {
    console.log("logout")
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        loginAnonymously, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}