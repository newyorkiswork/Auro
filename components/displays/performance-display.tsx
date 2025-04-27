"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts"  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts'

export function PerformanceDisplay({ metrics }: { metrics: any }) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Performance Metrics</h2>
        <p className="text-muted-foreground">Key metrics and analytics for the platform</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Users"
              value={metrics.userMetrics.totalUsers.toLocaleString()}
              description="Registered users"
            />
            <MetricCard
              title="Active Users"
              value={metrics.userMetrics.activeUsers.toLocaleString()}
              description="Users active in last 30 days"
            />
            <MetricCard
              title="Premium Users"
              value={metrics.userMetrics.premiumUsers.toLocaleString()}
              description="Users with premium subscription"
            />
            <MetricCard
              title="New Users"
              value={metrics.userMetrics.newUsersLast30Days.toLocaleString()}
              description="New registrations in last 30 days"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Active Users</CardTitle>
              <CardDescription>User activity over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.userMetrics.dailyActiveUsers}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Active Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Total Bookings"
              value={metrics.bookingMetrics.totalBookingsLast30Days.toLocaleString()}
              description="Bookings in last 30 days"
            />
            <MetricCard
              title="Daily Average"
              value={metrics.bookingMetrics.averageBookingsPerDay.toLocaleString()}
              description="Average bookings per day"
            />
            <MetricCard
              title="Completion Rate"
              value={`${metrics.bookingMetrics.bookingCompletionRate}%`}
              description="Bookings completed successfully"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Peak Booking Hours</CardTitle>
                <CardDescription>Most popular times for machine bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics.bookingMetrics.peakBookingHours}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Machine Utilization</CardTitle>
                <CardDescription>Overall machine usage across all locations</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="h-80 w-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Utilized", value: metrics.bookingMetrics.machineUtilization },
                          { name: "Idle", value: 100 - metrics.bookingMetrics.machineUtilization },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell key="utilized" fill="#0088FE" />
                        <Cell key="idle" fill="#EEEEEE" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(metrics.revenueMetrics.totalRevenueLast30Days)}
              description="Revenue in last 30 days"
            />
            <MetricCard
              title="Revenue Growth"
              value={`${metrics.revenueMetrics.revenueGrowth}%`}
              description="Month-over-month growth"
            />
            <MetricCard
              title="Avg. Transaction"
              value={formatCurrency(metrics.revenueMetrics.averageTransactionValue)}
              description="Average value per transaction"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Location</CardTitle>
              <CardDescription>Monthly revenue breakdown by laundromat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.revenueMetrics.revenueByLocation}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="API Response Time"
              value={`${metrics.systemMetrics.apiResponseTime} ms`}
              description="Average response time"
            />
            <MetricCard
              title="App Crash Rate"
              value={`${metrics.systemMetrics.appCrashRate}%`}
              description="Mobile app crash rate"
            />
            <MetricCard
              title="Server Uptime"
              value={`${metrics.systemMetrics.serverUptime}%`}
              description="Overall server uptime"
            />
            <MetricCard title="Error Rate" value={`${metrics.systemMetrics.errorRate}%`} description="API error rate" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
