"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { debugLog, debugError } from "@/lib/debug"

export type HealthPreference = "eco-friendly" | "hypoallergenic" | "fragrance-free" | "natural" | "standard"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  subscription: "free" | "premium"
  healthPreferences: HealthPreference[]
  isAuthenticated: boolean
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (phone: string, otp: string) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  setSubscription: (type: "free" | "premium") => void
  setHealthPreferences: (preferences: HealthPreference[]) => void
  debugState: () => any
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
  setSubscription: () => {},
  setHealthPreferences: () => {},
  debugState: () => ({}),
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  debugLog("UserProvider", "Initialize", { router: !!router })

  // Check for existing user in localStorage on mount
  useEffect(() => {
    debugLog("UserProvider", "useEffect[mount]", "Checking for stored user")
    try {
      const storedUser = localStorage.getItem("auro_user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        debugLog("UserProvider", "useEffect[mount]", { foundStoredUser: parsedUser })
        setUser(parsedUser)
      } else {
        debugLog("UserProvider", "useEffect[mount]", "No stored user found")
      }
    } catch (error) {
      debugError("UserProvider", "useEffect[mount]", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update localStorage when user changes
  useEffect(() => {
    debugLog("UserProvider", "useEffect[user]", { user })
    if (user) {
      try {
        localStorage.setItem("auro_user", JSON.stringify(user))
        debugLog("UserProvider", "useEffect[user]", "User saved to localStorage")
      } catch (error) {
        debugError("UserProvider", "useEffect[user]", error)
      }
    } else {
      localStorage.removeItem("auro_user")
      debugLog("UserProvider", "useEffect[user]", "User removed from localStorage")
    }
  }, [user])

  const login = async (phone: string, otp: string): Promise<boolean> => {
    debugLog("UserProvider", "login", { phone, otpLength: otp.length })

    // DEMO: Simulate API call delay
    setIsLoading(true)
    try {
      debugLog("UserProvider", "login", "Simulating API call")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // DEMO: Any valid-looking phone and OTP will work
      if (phone.length >= 10 && otp.length >= 4) {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: "Demo User",
          email: "demo@example.com",
          phone,
          subscription: "free",
          healthPreferences: ["standard"],
          isAuthenticated: true,
        }

        debugLog("UserProvider", "login", { success: true, newUser })
        setUser(newUser)

        // Force a delay before navigation to ensure state is updated
        setTimeout(() => {
          debugLog("UserProvider", "login", "Navigating to home page")
          router.push("/")
        }, 100)

        return true
      }

      debugLog("UserProvider", "login", { success: false, reason: "Invalid credentials" })
      return false
    } catch (error) {
      debugError("UserProvider", "login", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = useCallback(() => {
    debugLog("UserProvider", "logout", "Logging out user")
    setUser(null)
    localStorage.removeItem("auro_user")
    router.push("/auth/login")
  }, [router])

  const updateUser = useCallback(
    (data: Partial<User>) => {
      if (!user) {
        debugLog("UserProvider", "updateUser", "No user to update")
        return
      }
      debugLog("UserProvider", "updateUser", { data })
      setUser({ ...user, ...data })
    },
    [user],
  )

  const setSubscription = useCallback(
    (type: "free" | "premium") => {
      if (!user) {
        debugLog("UserProvider", "setSubscription", "No user to update")
        return
      }
      debugLog("UserProvider", "setSubscription", { type })
      setUser({ ...user, subscription: type })
    },
    [user],
  )

  const setHealthPreferences = useCallback(
    (preferences: HealthPreference[]) => {
      if (!user) {
        debugLog("UserProvider", "setHealthPreferences", "No user to update")
        return
      }
      debugLog("UserProvider", "setHealthPreferences", { preferences })
      setUser({ ...user, healthPreferences: preferences })
    },
    [user],
  )

  const debugState = useCallback(() => {
    return {
      user,
      isLoading,
      isAuthenticated: !!user?.isAuthenticated,
      hasRouter: !!router,
    }
  }, [user, isLoading, router])

  const contextValue = {
    user,
    isLoading,
    isAuthenticated: !!user?.isAuthenticated,
    login,
    logout,
    updateUser,
    setSubscription,
    setHealthPreferences,
    debugState,
  }

  debugLog("UserProvider", "render", {
    hasUser: !!user,
    isLoading,
    isAuthenticated: !!user?.isAuthenticated,
  })

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
