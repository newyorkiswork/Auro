"use client"

import { useState } from "react"
import { useDataDisplay } from "@/context/data-display-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Mail, Phone, Calendar, Clock, Package, ShoppingBag, TicketIcon } from "lucide-react"

export function UserDetailDisplay({ user }: { user: any }) {
  const { setDisplayType, setDisplayData } = useDataDisplay()
  const [isEditing, setIsEditing] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "premium":
        return <Badge className="bg-purple-500 hover:bg-purple-500">Premium</Badge>
      case "free":
        return <Badge variant="secondary">Free</Badge>
      default:
        return <Badge>{subscription}</Badge>
    }
  }

  const handleBackToList = () => {
    setDisplayType("users")
    setDisplayData(null) // This will be set by the users display component
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">User Profile</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit User"}
          </Button>
          {isEditing && <Button>Save Changes</Button>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.id}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Last active {new Date(user.lastActive).toLocaleDateString()}</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(user.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subscription</span>
                  {getSubscriptionBadge(user.subscription)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Overview of user's platform usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <ShoppingBag className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-2xl font-bold">{user.bookings}</span>
                  <span className="text-sm text-muted-foreground">Bookings</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Package className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-2xl font-bold">{user.orders}</span>
                  <span className="text-sm text-muted-foreground">Orders</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <TicketIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-2xl font-bold">{user.tickets}</span>
                  <span className="text-sm text-muted-foreground">Support Tickets</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="preferences">
            <TabsList>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Health Preferences</CardTitle>
                  <CardDescription>User's laundry product preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.healthPreferences.map((pref: string) => (
                      <Badge key={pref} variant="outline" className="capitalize">
                        {pref.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Security settings and access logs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Security information would be displayed here in a real implementation.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Payment methods and billing history</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Billing information would be displayed here in a real implementation.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
