"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function SystemStatusDisplay({ systemStatus }: { systemStatus: any }) {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Status</h2>
        <p className="text-muted-foreground">Current status of all system components</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Overall System Status</CardTitle>
            {getStatusBadge(systemStatus.overall)}
          </div>
          <CardDescription>
            {systemStatus.overall === "operational"
              ? "All systems are operating normally"
              : systemStatus.overall === "partial_outage"
                ? "Some systems are experiencing issues"
                : "Major system outage detected"}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="incidents">Recent Incidents</TabsTrigger>
          <TabsTrigger value="maintenance">Scheduled Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4 pt-4">
          {systemStatus.components.map((component: any) => (
            <Card key={component.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{component.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {component.lastIncident
                        ? `Last incident: ${new Date(component.lastIncident).toLocaleDateString()}`
                        : "No incidents recorded"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{component.uptime.toFixed(2)}% uptime</p>
                      <Progress value={component.uptime} className="h-2 w-24" />
                    </div>
                    {getStatusBadge(component.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4 pt-4">
          {systemStatus.recentIncidents.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>No recent incidents reported.</p>
              </CardContent>
            </Card>
          ) : (
            systemStatus.recentIncidents.map((incident: any) => (
              <Card key={incident.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{incident.description}</CardTitle>
                    <Badge variant={incident.status === "resolved" ? "outline" : "destructive"}>
                      {incident.status}
                    </Badge>
                  </div>
                  <CardDescription>Affected component: {incident.component}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Time:</span>
                      <span>{new Date(incident.startTime).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">End Time:</span>
                      <span>{incident.endTime ? new Date(incident.endTime).toLocaleString() : "Ongoing"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Affected Locations:</span>
                      <span>{incident.affectedLocations.join(", ")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4 pt-4">
          {systemStatus.maintenanceSchedule.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>No scheduled maintenance.</p>
              </CardContent>
            </Card>
          ) : (
            systemStatus.maintenanceSchedule.map((maintenance: any) => (
              <Card key={maintenance.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{maintenance.description}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Scheduled</span>
                    </Badge>
                  </div>
                  <CardDescription>Affected component: {maintenance.component}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Time:</span>
                      <span>{new Date(maintenance.scheduledStart).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">End Time:</span>
                      <span>{new Date(maintenance.scheduledEnd).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expected Impact:</span>
                      <span>{maintenance.expectedImpact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
