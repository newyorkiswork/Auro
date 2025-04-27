"use client"

import { useDataDisplay } from "@/context/data-display-context"
import { TicketsDisplay } from "@/components/displays/tickets-display"
import { UsersDisplay } from "@/components/displays/users-display"
import { LocationsDisplay } from "@/components/displays/locations-display"
import { SystemStatusDisplay } from "@/components/displays/system-status-display"
import { PerformanceDisplay } from "@/components/displays/performance-display"
import { LogsDisplay } from "@/components/displays/logs-display"
import { UserDetailDisplay } from "@/components/displays/user-detail-display"
import { TicketDetailDisplay } from "@/components/displays/ticket-detail-display"
import { LocationDetailDisplay } from "@/components/displays/location-detail-display"

export function DataDisplay() {
  const { displayType, displayData } = useDataDisplay()

  if (!displayType || !displayData) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 8h7" />
            <path d="M8 12h8" />
            <path d="M11 16h5" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium">No Data Selected</h3>
        <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
          Ask Operator to show you information about tickets, users, locations, system status, or performance metrics.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-6">
      {displayType === "tickets" && <TicketsDisplay tickets={displayData} />}
      {displayType === "users" && <UsersDisplay users={displayData} />}
      {displayType === "locations" && <LocationsDisplay locations={displayData} />}
      {displayType === "system" && <SystemStatusDisplay systemStatus={displayData} />}
      {displayType === "performance" && <PerformanceDisplay metrics={displayData} />}
      {displayType === "logs" && <LogsDisplay logs={displayData} />}
      {displayType === "user-detail" && <UserDetailDisplay user={displayData} />}
      {displayType === "ticket-detail" && <TicketDetailDisplay ticket={displayData} />}
      {displayType === "location-detail" && <LocationDetailDisplay location={displayData} />}
    </div>
  )
}
