"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat, type ChatMessage } from "@/context/chat-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, Send, Loader2, User, Bot } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function ConversationalInterface() {
  const { messages, isProcessing, sendMessage } = useChat()
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isVoiceSupported, setIsVoiceSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [recognition, setRecognition] = useState<any>(null)

  // Initialize speech recognition
  useEffect(() => {
    // DEMO: Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionInstance.onerror = () => {
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
      setIsVoiceSupported(true)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    await sendMessage(input)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
    } else {
      try {
        recognition.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }

  return (
    <div className="flex h-full flex-col border-r">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Operator AI Assistant</h2>
        <p className="text-sm text-muted-foreground">Ask questions or issue commands to manage the system</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Operator is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            ref={inputRef}
            placeholder="Type a command or question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none"
            disabled={isProcessing}
          />
          <div className="flex justify-between">
            {isVoiceSupported && (
              <Button
                type="button"
                variant={isListening ? "default" : "outline"}
                size="icon"
                onClick={toggleListening}
                disabled={isProcessing}
              >
                <Mic className={`h-4 w-4 ${isListening ? "text-primary-foreground" : ""}`} />
                <span className="sr-only">{isListening ? "Stop listening" : "Start voice input"}</span>
              </Button>
            )}
            <Button type="submit" disabled={!input.trim() || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] flex-col gap-1 ${isUser ? "order-1" : "order-2"}`}>
        <div className={`flex items-center gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${isUser ? "bg-primary" : "bg-secondary"}`}
          >
            {isUser ? (
              <User className="h-4 w-4 text-primary-foreground" />
            ) : (
              <Bot className="h-4 w-4 text-secondary-foreground" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{isUser ? "You" : "Operator"}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className={`rounded-lg p-3 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
      </div>
    </div>
  )
}
