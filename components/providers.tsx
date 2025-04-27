"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/context/auth-context"
import { DataDisplayProvider } from "@/context/data-display-context"
import { ChatProvider } from "@/context/chat-context"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <DataDisplayProvider>
          <ChatProvider>{children}</ChatProvider>
        </DataDisplayProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
