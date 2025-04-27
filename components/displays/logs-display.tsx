"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertCircle, AlertTriangle, Info } from "lucide-react"

export function LogsDisplay({ logs }: { logs: any[] }) {
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "INFO":
        return (
          <Badge className="flex items-center gap-1 bg-blue-500 hover:bg-blue-500">
            <Info className="h-3 w-3" />
            <span>Info</span>
          </Badge>
        )
      case "WARNING":
        return (
          <Badge className="flex items-center gap-1 bg-amber-500 hover:bg-amber-500">
            <AlertTriangle className="h-3 w-3" />
            <span>Warning</span>
          </Badge>
        )
      case "ERROR":
        return (
          <Badge className="flex items-center gap-1 bg-red-500 hover:bg-red-500">
            <AlertCircle className="h-3 w-3" />
            <span>Error</span>
          </Badge>
        )
      case "CRITICAL":
        return (
          <Badge className="flex items-center gap-1 bg-purple-600 hover:bg-purple-600">
            <AlertCircle className="h-3 w-3" />
            <span>Critical</span>
          </Badge>
        )
      default:
        return <Badge>{level}</Badge>
    }
  }

  // Get unique sources for filter
  const sources = Array.from(new Set(logs.map((log) => log.source)))

  const filteredLogs = logs.filter((log) => {
    // Apply level filter
    if (levelFilter !== "all" && log.level !== levelFilter) {
      return false
    }

    // Apply source filter
    if (sourceFilter !== "all" && log.source !== sourceFilter) {
      return false
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        log.id.toLowerCase().includes(query) ||
        log.message.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">System Logs</h2>
        <p className="text-muted-foreground">Recent system activity and events</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Log Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p>No logs matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id}>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{log.message}</CardTitle>
                  {getLevelBadge(log.level)}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                  <div>ID: {log.id}</div>
                  <div>Source: {log.source}</div>
                  <div>Time: {new Date(log.timestamp).toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
