"use client"

import type React from "react"
import { Header } from "@/components/header"
import { DemoBanner } from "@/components/demo-banner"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  )
}
