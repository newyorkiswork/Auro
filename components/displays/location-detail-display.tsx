"use client"

import { useState } from "react"
import { useDataDisplay } from "@/context/data-display-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle, CheckCircle, Wrench, DollarSign, Calendar } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export function LocationDetailDisplay({ location }: { location: any }) {
  const { setDisplayType, setDisplayData } = useDataDisplay()
  const [isEditing, setIsEditing] = useState(false)

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

  const handleBackToList = () => {
    setDisplayType("locations")
    setDisplayData(null) // This will be set by the locations display component
  }

  // Data for machine status chart
  const machineStatusData = [
    { name: "Operational", value: location.machines.operational },
    { name: "Out of Order", value: location.machines.outOfOrder },
  ]

  // Colors for charts
  const COLORS = ["#4ade80", "#f87171"]

  // Data for revenue chart
  const revenueData = [
    { name: "Daily", value: location.revenue.daily },
    { name: "Weekly", value: location.revenue.weekly / 7 }, // Average daily from weekly
    { name: "Monthly", value: location.revenue.monthly / 30 }, // Average daily from monthly
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{location.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Location"}
          </Button>
          {isEditing && <Button>Save Changes</Button>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Location Info</CardTitle>
              {getStatusBadge(location.status)}
            </div>
            <CardDescription>{location.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Address</div>
                <div>{location.address}</div>
              </div>

              <div>
                <div className="text-sm font-medium">Hours</div>
                <div>{location.hours}</div>
              </div>

              <div>
                <div className="text-sm font-medium">Payment Systems</div>
                <div className="flex flex-wrap gap-1">
                  {location.paymentSystems.map((system: string) => (
                    <Badge key={system} variant="outline">
                      {system}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Last Maintenance</div>
                <div>{new Date(location.lastMaintenance).toLocaleDateString()}</div>
              </div>

              <div>
                <div className="text-sm font-medium">Utilization</div>
                <div className="flex items-center gap-2">
                  <Progress value={location.utilization} className="h-2 flex-1" />
                  <span className="text-sm">{location.utilization}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Machine Status</CardTitle>
              <CardDescription>
                {location.machines.operational} of {location.machines.total} machines operational
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="h-40 w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={machineStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {machineStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-2xl font-bold">{location.machines.washers}</div>
                      <div className="text-sm text-muted-foreground">Washers</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-2xl font-bold">{location.machines.dryers}</div>
                      <div className="text-sm text-muted-foreground">Dryers</div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="mb-2 text-sm font-medium">Machine Health</div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(location.machines.operational / location.machines.total) * 100}
                        className="h-2 flex-1"
                      />
                      <span className="text-sm">
                        {((location.machines.operational / location.machines.total) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="revenue">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Daily, weekly, and monthly revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">{location.revenue.daily.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Daily</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">{location.revenue.weekly.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Weekly</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">{location.revenue.monthly.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Monthly</div>
                    </div>
                  </div>

                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                        <Bar dataKey="value" fill="#8884d8" name="Average Daily Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                  <CardDescription>Recent and scheduled maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Last Maintenance</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{new Date(location.lastMaintenance).toLocaleDateString()}</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Regular maintenance check of all machines and payment systems.
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Next Scheduled Maintenance</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        <Badge variant="outline">Scheduled</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Regular bi-weekly maintenance check.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>Open tickets for this location</CardDescription>
                </CardHeader>
                <CardContent>
                  {location.openTickets === 0 ? (
                    <div className="rounded-lg border p-6 text-center">
                      <p className="text-muted-foreground">No open tickets for this location.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">Machine out of order</span>
                          <Badge variant="destructive">High Priority</Badge>
                        </div>
                        <p className="mb-2 text-sm">Washer #3 is not starting despite payment.</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Reported 2 hours ago</span>
                          <Button variant="ghost" size="sm">
                            View Ticket
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
