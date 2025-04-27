"use client"

import { useState } from "react"
import { useDataDisplay } from "@/context/data-display-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertCircle, CheckCircle, Clock, Send } from "lucide-react"

export function TicketDetailDisplay({ ticket }: { ticket: any }) {
  const { setDisplayType, setDisplayData, updateDisplayData } = useDataDisplay()
  const [newComment, setNewComment] = useState("")
  const [newStatus, setNewStatus] = useState(ticket.status)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleBackToList = () => {
    setDisplayType("tickets")
    setDisplayData(null) // This will be set by the tickets display component
  }

  const handleStatusChange = (status: string) => {
    setNewStatus(status)
  }

  const handleUpdateStatus = () => {
    if (newStatus === ticket.status) return

    setIsSubmitting(true)

    // DEMO: Simulate API call delay
    setTimeout(() => {
      updateDisplayData((prevData: any) => ({
        ...prevData,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        comments: [
          ...prevData.comments,
          {
            id: `COMMENT-${Date.now()}`,
            userId: "ADMIN-001",
            userName: "Admin User",
            content: `Status updated from ${ticket.status} to ${newStatus}`,
            createdAt: new Date().toISOString(),
          },
        ],
      }))
      setIsSubmitting(false)
    }, 1000)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // DEMO: Simulate API call delay
    setTimeout(() => {
      updateDisplayData((prevData: any) => ({
        ...prevData,
        updatedAt: new Date().toISOString(),
        comments: [
          ...prevData.comments,
          {
            id: `COMMENT-${Date.now()}`,
            userId: "ADMIN-001",
            userName: "Admin User",
            content: newComment,
            createdAt: new Date().toISOString(),
          },
        ],
      }))
      setNewComment("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Ticket {ticket.id}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={newStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleUpdateStatus} disabled={newStatus === ticket.status || isSubmitting}>
            Update Status
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{ticket.subject}</CardTitle>
                  <CardDescription>Created on {new Date(ticket.createdAt).toLocaleString()}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.comments.map((comment: any) => (
                <div key={comment.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium">{comment.userName}</div>
                    <div className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
                </div>
              ))}

              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  className="flex items-center gap-2"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmitting}
                >
                  <Send className="h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">User</div>
                  <div className="flex items-center justify-between">
                    <span>{ticket.userName}</span>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="flex items-center justify-between">
                    <span>{ticket.location || "N/A"}</span>
                    {ticket.locationId && (
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Assigned To</div>
                  <div className="flex items-center justify-between">
                    <span>{ticket.assignedTo || "Unassigned"}</span>
                    <Button variant="ghost" size="sm">
                      Assign
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Last Updated</div>
                  <div>{new Date(ticket.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  Email User
                </Button>
                <Button className="w-full" variant="outline">
                  Schedule Maintenance
                </Button>
                <Button className="w-full" variant="outline">
                  Process Refund
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
