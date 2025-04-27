"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type DisplayType =
  | "tickets"
  | "users"
  | "system"
  | "performance"
  | "locations"
  | "user-detail"
  | "ticket-detail"
  | "location-detail"
  | null

interface DataDisplayContextType {
  displayType: DisplayType
  displayData: any
  setDisplayType: (type: DisplayType) => void
  setDisplayData: (data: any) => void
  updateDisplayData: (updater: (prevData: any) => any) => void
}

const DataDisplayContext = createContext<DataDisplayContextType>({
  displayType: null,
  displayData: null,
  setDisplayType: () => {},
  setDisplayData: () => {},
  updateDisplayData: () => {},
})

export function DataDisplayProvider({ children }: { children: ReactNode }) {
  const [displayType, setDisplayType] = useState<DisplayType>(null)
  const [displayData, setDisplayData] = useState<any>(null)

  const updateDisplayData = (updater: (prevData: any) => any) => {
    setDisplayData((prevData: any) => updater(prevData))
  }

  return (
    <DataDisplayContext.Provider
      value={{
        displayType,
        displayData,
        setDisplayType,
        setDisplayData,
        updateDisplayData,
      }}
    >
      {children}
    </DataDisplayContext.Provider>
  )
}

export const useDataDisplay = () => useContext(DataDisplayContext)
