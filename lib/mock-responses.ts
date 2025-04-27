import {
  mockTickets,
  mockUsers,
  mockLocations,
  mockSystemStatus,
  mockPerformanceMetrics,
  mockSystemLogs,
} from "./mock-data"
import type { DisplayType } from "@/context/data-display-context"

interface ResponseMatch {
  response: string
  displayType: DisplayType
  displayData: any
}

// DEMO: Function to find a matching response based on keywords in the input
export function findResponseForInput(input: string): ResponseMatch {
  const normalizedInput = input.toLowerCase()

  // Check for ticket-related commands
  if (
    normalizedInput.includes("show ticket") ||
    normalizedInput.includes("list ticket") ||
    normalizedInput.includes("view ticket") ||
    normalizedInput.includes("open ticket")
  ) {
    return {
      response:
        "Here are the current support tickets in the system. I've displayed them in the side panel for you to review. You can click on any ticket to see more details.",
      displayType: "tickets",
      displayData: mockTickets,
    }
  }

  // Check for specific ticket lookup
  const ticketMatch = normalizedInput.match(/ticket[- ](\d+)/i) || normalizedInput.match(/ticket[- ]([a-z0-9-]+)/i)
  if (ticketMatch) {
    const ticketId = `TICKET-${ticketMatch[1]}`
    const ticket = mockTickets.find((t) => t.id === ticketId || t.id.includes(ticketMatch[1]))

    if (ticket) {
      return {
        response: `I've found ticket ${ticket.id} regarding "${ticket.subject}" from ${ticket.userName}. The details are displayed in the side panel.`,
        displayType: "ticket-detail",
        displayData: ticket,
      }
    } else {
      return {
        response: `I couldn't find a ticket matching the ID ${ticketMatch[1]}. Would you like to see all open tickets instead?`,
        displayType: null,
        displayData: null,
      }
    }
  }

  // Check for user-related commands
  if (
    normalizedInput.includes("show user") ||
    normalizedInput.includes("list user") ||
    normalizedInput.includes("view user") ||
    normalizedInput.includes("all user")
  ) {
    return {
      response:
        "Here's a list of all users in the system. I've displayed them in the side panel for you to review. You can click on any user to see their detailed profile.",
      displayType: "users",
      displayData: mockUsers,
    }
  }

  // Check for specific user lookup
  if (
    normalizedInput.includes("find user") ||
    normalizedInput.includes("search user") ||
    normalizedInput.includes("lookup user")
  ) {
    // Extract name or email if provided
    let userQuery = ""
    const nameMatch = normalizedInput.match(/user (?:named|called|with name) ([a-z ]+)/i)
    const emailMatch = normalizedInput.match(/user (?:with email|email) ([a-z0-9.@]+)/i)

    if (nameMatch) {
      userQuery = nameMatch[1].trim()
    } else if (emailMatch) {
      userQuery = emailMatch[1].trim()
    } else {
      // Extract anything after "find user" or similar phrases
      const generalMatch = normalizedInput.match(/(?:find|search|lookup) user\s+(.+)/i)
      if (generalMatch) {
        userQuery = generalMatch[1].trim()
      }
    }

    if (userQuery) {
      const user = mockUsers.find(
        (u) =>
          u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(userQuery.toLowerCase()),
      )

      if (user) {
        return {
          response: `I found user ${user.name} (${user.email}). Their profile details are displayed in the side panel.`,
          displayType: "user-detail",
          displayData: user,
        }
      } else {
        return {
          response: `I couldn't find a user matching "${userQuery}". Would you like to see a list of all users instead?`,
          displayType: null,
          displayData: null,
        }
      }
    }
  }

  // Check for location-related commands
  if (
    normalizedInput.includes("show location") ||
    normalizedInput.includes("list location") ||
    normalizedInput.includes("view location") ||
    normalizedInput.includes("all location") ||
    normalizedInput.includes("laundromat")
  ) {
    return {
      response:
        "Here are all the laundromat locations in our system. I've displayed them in the side panel for you to review. You can click on any location to see more details.",
      displayType: "locations",
      displayData: mockLocations,
    }
  }

  // Check for specific location lookup
  const locationMatch = normalizedInput.match(/location (?:named|called) ([a-z &]+)/i)
  if (locationMatch) {
    const locationName = locationMatch[1].trim()
    const location = mockLocations.find((l) => l.name.toLowerCase().includes(locationName.toLowerCase()))

    if (location) {
      return {
        response: `I found the location "${location.name}" at ${location.address}. The details are displayed in the side panel.`,
        displayType: "location-detail",
        displayData: location,
      }
    } else {
      return {
        response: `I couldn't find a location matching "${locationName}". Would you like to see all locations instead?`,
        displayType: null,
        displayData: null,
      }
    }
  }

  // Check for system status commands
  if (
    normalizedInput.includes("system status") ||
    normalizedInput.includes("status") ||
    normalizedInput.includes("health") ||
    normalizedInput.includes("system health")
  ) {
    return {
      response:
        "Here's the current system status. Overall, the system is operational with a partial outage in Machine Connectivity. Details are displayed in the side panel.",
      displayType: "system",
      displayData: mockSystemStatus,
    }
  }

  // Check for performance metrics commands
  if (
    normalizedInput.includes("performance") ||
    normalizedInput.includes("metrics") ||
    normalizedInput.includes("analytics") ||
    normalizedInput.includes("stats") ||
    normalizedInput.includes("statistics")
  ) {
    return {
      response:
        "Here are the current performance metrics for the platform. I've displayed key user, booking, and revenue metrics in the side panel for your review.",
      displayType: "performance",
      displayData: mockPerformanceMetrics,
    }
  }

  // Check for help command
  if (
    normalizedInput.includes("help") ||
    normalizedInput.includes("what can you do") ||
    normalizedInput.includes("commands")
  ) {
    return {
      response:
        "I can help you with various administrative tasks. Here are some commands you can try:\n\n" +
        "- Show tickets / Find ticket [ID]\n" +
        "- Show users / Find user [name or email]\n" +
        "- Show locations / Find location [name]\n" +
        "- System status\n" +
        "- Performance metrics\n" +
        "- Show logs\n\n" +
        "You can also ask me to perform actions like resolving tickets or updating user information.",
      displayType: null,
      displayData: null,
    }
  }

  // Check for logs command
  if (
    normalizedInput.includes("logs") ||
    normalizedInput.includes("system logs") ||
    normalizedInput.includes("error logs") ||
    normalizedInput.includes("activity logs")
  ) {
    return {
      response:
        "Here are the recent system logs. I've displayed them in the side panel, sorted by timestamp with the most recent logs first.",
      displayType: "logs",
      displayData: mockSystemLogs,
    }
  }

  // Default response if no keywords match
  return {
    response:
      "I'm not sure I understand what you're looking for. You can ask me to show tickets, users, locations, system status, or performance metrics. Type 'help' to see all available commands.",
    displayType: null,
    displayData: null,
  }
}

// DEMO: Pre-canned responses for specific actions
export const mockResponses = {
  resolveTicket: (ticketId: string) => {
    return `I've marked ticket ${ticketId} as resolved. The ticket status has been updated in the system.`
  },
  assignTicket: (ticketId: string, assignee: string) => {
    return `I've assigned ticket ${ticketId} to ${assignee}. They will be notified of this assignment.`
  },
  updateUserStatus: (userId: string, status: string) => {
    return `I've updated the status of user ${userId} to ${status}. The changes have been saved to the database.`
  },
  scheduleMaintenanceForLocation: (locationId: string, date: string) => {
    return `I've scheduled maintenance for location ${locationId} on ${date}. All relevant parties will be notified.`
  },
}
