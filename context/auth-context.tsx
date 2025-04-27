"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define types
type User = {
  id: string
  name: string
  email: string
  phone: string
  subscription: "free" | "premium"
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (phone: string, code: string) => Promise<void>
  signOut: () => void
}

// Create default user
const DEFAULT_USER: User = {
  id: "user-123",
  name: "Demo User",
  email: "demo@example.com",
  phone: "+1234567890",
  subscription: "premium",
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER)
  const [isLoading, setIsLoading] = useState(false)

  // Auto-authenticate on load
  useEffect(() => {
    console.log("AuthProvider: Auto-authenticating user")
    setUser(DEFAULT_USER)
  }, [])

  // Sign in function (simplified, always succeeds)
  const signIn = async (phone: string, code: string) => {
    console.log("AuthProvider: Sign in", { phone, code })
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setUser(DEFAULT_USER)
    setIsLoading(false)
  }

  // Sign out function
  const signOut = () => {
    console.log("AuthProvider: Sign out")
    // In a real app, we would clear the user here
    // But for demo purposes, we'll keep the user authenticated
    // setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
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
