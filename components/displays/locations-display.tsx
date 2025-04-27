"use client"

import { useState } from "react"
import { useDataDisplay } from "@/context/data-display-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle, CheckCircle } from "lucide-react"

export function LocationsDisplay({ locations }: { locations: any[] }) {
  const { setDisplayType, setDisplayData } = useDataDisplay()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-500">
            <CheckCircle className="h-3 w-3" />
            <span>Operational</span>
          </Badge>
        )
      case "partial_outage":
        return (
          <Badge className="flex items-center gap-1 bg-amber-500 hover:bg-amber-500">
            <AlertTriangle className="h-3 w-3" />
            <span>Partial Outage</span>
          </Badge>
        )
      case "major_outage":
        return (
          <Badge className="flex items-center gap-1 bg-red-500 hover:bg-red-500">
            <AlertTriangle className="h-3 w-3" />
            <span>Major Outage</span>
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredLocations = locations.filter((location) => {
    // Apply status filter
    if (statusFilter !== "all" && location.status !== statusFilter) {
      return false
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        location.id.toLowerCase().includes(query) ||
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleViewLocation = (location: any) => {
    setDisplayType("location-detail")
    setDisplayData(location)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Laundromat Locations</h2>
        <Button>Add Location</Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="partial_outage">Partial Outage</SelectItem>
            <SelectItem value="major_outage">Major Outage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Machines</TableHead>
              <TableHead>Utilization</TableHead>
              <TableHead>Open Tickets</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No locations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.id}</TableCell>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{getStatusBadge(location.status)}</TableCell>
                  <TableCell>
                    {location.machines.operational}/{location.machines.total}
                  </TableCell>
                  <TableCell>{location.utilization}%</TableCell>
                  <TableCell>{location.openTickets}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewLocation(location)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
