"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Header } from "@/components/header"
import { ConversationalInterface } from "@/components/conversational-interface"
import { DataDisplay } from "@/components/data-display"

interface AdminLayoutProps {
  children?: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex w-full flex-col md:w-1/2 lg:w-2/5">
          <ConversationalInterface />
        </div>
        <div className="flex w-full flex-col md:w-1/2 lg:w-3/5">
          <DataDisplay />
        </div>
      </div>
    </div>
  )
}
