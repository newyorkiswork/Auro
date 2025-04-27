"use client"

import { useState } from "react"
import { useDataDisplay } from "@/context/data-display-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Clock, Search } from "lucide-react"

export function TicketsDisplay({ tickets }: { tickets: any[] }) {
  const { setDisplayType, setDisplayData } = useDataDisplay()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Open</span>
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="warning" className="flex items-center gap-1 bg-amber-500 text-white hover:bg-amber-500">
            <Clock className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="success" className="flex items-center gap-1 bg-green-500 text-white hover:bg-green-500">
            <CheckCircle className="h-3 w-3" />
            <span>Resolved</span>
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    // Apply status filter
    if (statusFilter !== "all" && ticket.status !== statusFilter) {
      return false
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        ticket.id.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.userName.toLowerCase().includes(query) ||
        ticket.location.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleViewTicket = (ticket: any) => {
    setDisplayType("ticket-detail")
    setDisplayData(ticket)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        <Button>Create Ticket</Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{ticket.userName}</TableCell>
                  <TableCell>{ticket.location || "N/A"}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewTicket(ticket)}>
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
