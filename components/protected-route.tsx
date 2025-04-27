"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/context/user-context"
import { debugLog } from "@/lib/debug"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [debugVisible, setDebugVisible] = useState(true)

  useEffect(() => {
    debugLog("ProtectedRoute", "useEffect", {
      isAuthenticated,
      isLoading,
      pathname,
      user: user ? { id: user.id, isAuthenticated: user.isAuthenticated } : null,
    })

    if (!isLoading && !isAuthenticated && !pathname.startsWith("/auth")) {
      debugLog("ProtectedRoute", "redirecting", { from: pathname, to: "/auth/login" })
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router, pathname, user])

  // Debug display
  const renderDebugInfo = () => {
    if (!debugVisible) return null

    return (
      <div className="fixed bottom-0 right-0 z-50 m-4 max-w-sm border border-yellow-500 bg-yellow-50 p-4 text-xs shadow-lg">
        <div className="flex justify-between">
          <h3 className="font-bold">Protected Route Debug:</h3>
          <button onClick={() => setDebugVisible(false)} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="mt-2">
          <p>
            <strong>Path:</strong> {pathname}
          </p>
          <p>
            <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
          </p>
          <p>
            <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
          </p>
          <p>
            <strong>User:</strong> {user ? user.id : "None"}
          </p>
          <p>
            <strong>Auth Bypass:</strong> {pathname.startsWith("/auth") ? "Yes" : "No"}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        {renderDebugInfo()}
      </div>
    )
  }

  if (!isAuthenticated && !pathname.startsWith("/auth")) {
    debugLog("ProtectedRoute", "render", "Not authenticated, returning null")
    return renderDebugInfo()
  }

  return (
    <>
      {children}
      {renderDebugInfo()}
    </>
  )
}
