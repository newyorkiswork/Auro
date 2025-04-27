"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useUser } from "@/context/user-context"

export interface Supply {
  id: string
  name: string
  category: string
  level: number
  lastUpdated: string
  estimatedDaysRemaining?: number
  autoReorderThreshold?: number
  autoReorderEnabled?: boolean
  image: string
}

interface SuppliesContextType {
  supplies: Supply[]
  updateSupplyLevel: (id: string, level: number) => void
  toggleAutoReorder: (id: string) => void
  reorderSupply: (id: string) => Promise<boolean>
  searchSupplies: (query: string) => Supply[]
}

// Mock supplies data
const MOCK_SUPPLIES: Supply[] = [
  {
    id: "supply-1",
    name: "Laundry Detergent",
    category: "Cleaning",
    level: 35,
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDaysRemaining: 7,
    autoReorderThreshold: 20,
    autoReorderEnabled: true,
    image: "/placeholder.svg?height=200&width=200&query=laundry+detergent+bottle",
  },
  {
    id: "supply-2",
    name: "Fabric Softener",
    category: "Cleaning",
    level: 60,
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDaysRemaining: 14,
    autoReorderThreshold: 15,
    autoReorderEnabled: false,
    image: "/placeholder.svg?height=200&width=200&query=fabric+softener+bottle",
  },
  {
    id: "supply-3",
    name: "Stain Remover",
    category: "Cleaning",
    level: 15,
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDaysRemaining: 3,
    autoReorderThreshold: 10,
    autoReorderEnabled: true,
    image: "/fabric-stain-remover-close-up.png",
  },
  {
    id: "supply-4",
    name: "Dryer Sheets",
    category: "Drying",
    level: 80,
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDaysRemaining: 21,
    autoReorderThreshold: 20,
    autoReorderEnabled: false,
    image: "/placeholder.svg?height=200&width=200&query=dryer+sheets+box",
  },
  {
    id: "supply-5",
    name: "Bleach",
    category: "Cleaning",
    level: 45,
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDaysRemaining: 12,
    autoReorderThreshold: 15,
    autoReorderEnabled: true,
    image: "/placeholder.svg?height=200&width=200&query=bleach+bottle",
  },
]

const SuppliesContext = createContext<SuppliesContextType>({
  supplies: [],
  updateSupplyLevel: () => {},
  toggleAutoReorder: () => {},
  reorderSupply: async () => false,
  searchSupplies: () => [],
})

export function SuppliesProvider({ children }: { children: ReactNode }) {
  const [supplies, setSupplies] = useState<Supply[]>([])
  const { user } = useUser()

  // Load data from localStorage on mount
  useEffect(() => {
    const storedSupplies = localStorage.getItem("auro_supplies")

    if (storedSupplies) {
      setSupplies(JSON.parse(storedSupplies))
    } else {
      setSupplies(MOCK_SUPPLIES)
    }
  }, [])

  // Update localStorage when data changes
  useEffect(() => {
    localStorage.setItem("auro_supplies", JSON.stringify(supplies))
  }, [supplies])

  // DEMO: For premium users, automatically calculate estimated days remaining
  useEffect(() => {
    if (user?.subscription === "premium") {
      // This is a simplified calculation for demo purposes
      const updatedSupplies = supplies.map((supply) => {
        // Calculate days remaining based on level and a usage rate
        // This is a very simplified calculation for demo purposes
        const usageRatePerDay = 100 / 30 // 100% used in 30 days
        const estimatedDaysRemaining = Math.round(supply.level / usageRatePerDay)

        return {
          ...supply,
          estimatedDaysRemaining,
        }
      })

      setSupplies(updatedSupplies)
    }
  }, [user?.subscription])

  const updateSupplyLevel = (id: string, level: number) => {
    setSupplies((prevSupplies) =>
      prevSupplies.map((supply) =>
        supply.id === id
          ? {
              ...supply,
              level,
              lastUpdated: new Date().toISOString(),
            }
          : supply,
      ),
    )
  }

  const toggleAutoReorder = (id: string) => {
    setSupplies((prevSupplies) =>
      prevSupplies.map((supply) =>
        supply.id === id
          ? {
              ...supply,
              autoReorderEnabled: !supply.autoReorderEnabled,
            }
          : supply,
      ),
    )
  }

  const reorderSupply = async (id: string): Promise<boolean> => {
    // DEMO: Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // DEMO: Reset supply level to 100%
    setSupplies((prevSupplies) =>
      prevSupplies.map((supply) =>
        supply.id === id
          ? {
              ...supply,
              level: 100,
              lastUpdated: new Date().toISOString(),
            }
          : supply,
      ),
    )

    return true
  }

  const searchSupplies = (query: string): Supply[] => {
    if (!query.trim()) return supplies

    const searchTerms = query.toLowerCase().split(" ")

    return supplies.filter((supply) => {
      const searchableText = [supply.name, supply.category].join(" ").toLowerCase()

      return searchTerms.every((term) => searchableText.includes(term))
    })
  }

  return (
    <SuppliesContext.Provider
      value={{
        supplies,
        updateSupplyLevel,
        toggleAutoReorder,
        reorderSupply,
        searchSupplies,
      }}
    >
      {children}
    </SuppliesContext.Provider>
  )
}

export const useSupplies = () => useContext(SuppliesContext)
