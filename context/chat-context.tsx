"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { findResponseForInput } from "@/lib/mock-responses"
import { useDataDisplay } from "@/context/data-display-context"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatContextType {
  messages: ChatMessage[]
  isProcessing: boolean
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  isProcessing: false,
  sendMessage: async () => {},
  clearMessages: () => {},
})

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content: "Hello, I'm Operator, your administrative assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const { setDisplayType, setDisplayData } = useDataDisplay()

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)

    // DEMO: Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // DEMO: Find a matching response based on keywords
    const { response, displayType, displayData } = findResponseForInput(content)

    // Add assistant response
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsProcessing(false)

    // Update the data display if applicable
    if (displayType && displayData) {
      setDisplayType(displayType)
      setDisplayData(displayData)
    }
  }

  const clearMessages = () => {
    setMessages([
      {
        id: "welcome-message",
        role: "assistant",
        content: "Hello, I'm Operator, your administrative assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ])
    setDisplayType(null)
    setDisplayData(null)
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        isProcessing,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
