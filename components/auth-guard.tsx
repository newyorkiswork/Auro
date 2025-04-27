"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated and not on an auth page, redirect to login
      if (!isAuthenticated && !pathname.startsWith("/auth")) {
        console.log("AuthGuard: Redirecting to login", { pathname })
        router.push("/auth/login")
      } else {
        setIsReady(true)
      }
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Show loading state
  if (isLoading || !isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // If authenticated or on an auth page, render children
  if (isAuthenticated || pathname.startsWith("/auth")) {
    return <>{children}</>
  }

  // Otherwise, render nothing (should redirect)
  return null
}
