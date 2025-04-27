"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-primary/10 p-2 text-center relative">
      <p className="text-sm font-medium">🚀 Demo Mode - Explore all features without signing in</p>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss"
      >
        <X size={14} />
      </Button>
    </div>
  )
}
