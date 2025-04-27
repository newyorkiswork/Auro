"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  WashingMachine,
  ShoppingBag,
  Package,
  Settings,
  User,
  Truck,
  X,
  Menu,
  Mic,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useVoice } from "@/context/voice-context"
import { VoiceModal } from "@/components/voice-modal"

interface MenuItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function MenuItem({ href, icon, label, isActive }: MenuItemProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} className="block">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-12 w-12 rounded-full", isActive && "bg-primary/10 text-primary")}
              aria-label={label}
            >
              {icon}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function FloatingMenu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const { openVoiceModal } = useVoice()
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

  const menuItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={24} />, label: "Dashboard" },
    { href: "/machines", icon: <WashingMachine size={24} />, label: "Find Machines" },
    { href: "/deals", icon: <ShoppingBag size={24} />, label: "Deals" },
    { href: "/supplies", icon: <Package size={24} />, label: "Supplies" },
    { href: "/orders", icon: <Truck size={24} />, label: "Orders" },
    { href: "/settings", icon: <Settings size={24} />, label: "Settings" },
    { href: "/profile", icon: <User size={24} />, label: "Profile" },
  ]

  const handleOpenVoiceModal = () => {
    setIsVoiceModalOpen(true)
    openVoiceModal()
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end space-y-4">
          {isOpen && (
            <div className="flex flex-col items-center space-y-2 rounded-full bg-background p-2 shadow-lg">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={pathname === item.href}
                />
              ))}
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleOpenVoiceModal}
                      aria-label="Voice Assistant"
                    >
                      <Mic size={24} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Voice Assistant</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          <Button
            variant={isOpen ? "default" : "outline"}
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Voice Modal */}
      <VoiceModal open={isVoiceModalOpen} onOpenChange={setIsVoiceModalOpen} />
    </>
  )
}
