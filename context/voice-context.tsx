"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface VoiceContextType {
  isListening: boolean
  transcript: string
  isVoiceModalOpen: boolean
  isSpeaking: boolean
  startListening: () => void
  stopListening: () => void
  speak: (text: string) => void
  cancelSpeech: () => void
  openVoiceModal: () => void
  closeVoiceModal: () => void
  isSupported: boolean
  error: string | null
  debugInfo: {
    browserSupport: {
      speechRecognition: boolean
      speechSynthesis: boolean
      browser: string
    }
    recognitionState: string
    lastCommand: string | null
  }
}

const VoiceContext = createContext<VoiceContextType>({
  isListening: false,
  transcript: "",
  isVoiceModalOpen: false,
  isSpeaking: false,
  startListening: () => {},
  stopListening: () => {},
  speak: () => {},
  cancelSpeech: () => {},
  openVoiceModal: () => {},
  closeVoiceModal: () => {},
  isSupported: false,
  error: null,
  debugInfo: {
    browserSupport: {
      speechRecognition: false,
      speechSynthesis: false,
      browser: "",
    },
    recognitionState: "uninitialized",
    lastCommand: null,
  },
})

// Helper to detect browser
function detectBrowser() {
  const userAgent = navigator.userAgent
  let browserName = "Unknown"

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Chrome"
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Firefox"
  } else if (userAgent.match(/safari/i)) {
    browserName = "Safari"
  } else if (userAgent.match(/opr\//i)) {
    browserName = "Opera"
  } else if (userAgent.match(/edg/i)) {
    browserName = "Edge"
  }

  return browserName
}

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

  // Debug information
  const [debugInfo, setDebugInfo] = useState({
    browserSupport: {
      speechRecognition: false,
      speechSynthesis: false,
      browser: "",
    },
    recognitionState: "uninitialized",
    lastCommand: null as string | null,
  })

  // Update debug info
  const updateDebugInfo = useCallback((updates: Partial<typeof debugInfo>) => {
    setDebugInfo((prev) => ({
      ...prev,
      ...updates,
    }))
    console.log("[VOICE DEBUG]", updates)
  }, [])

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) {
      console.warn("[VOICE] Speech synthesis not supported")
      setError("Speech synthesis not supported in this browser")
      return
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text)

      utterance.onstart = () => {
        setIsSpeaking(true)
        console.log("[VOICE] Speech started")
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        console.log("[VOICE] Speech ended")
      }

      utterance.onerror = (event) => {
        console.error("[VOICE] Speech error:", event.error)
        setIsSpeaking(false)
        setError(`Speech synthesis error: ${event.error}`)
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
      console.log("[VOICE] Speaking:", text)
    } catch (err) {
      console.error("[VOICE] Error in speech synthesis:", err)
      setError("Error in speech synthesis")
      setIsSpeaking(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return

    try {
      recognitionRef.current.stop()
      console.log("[VOICE] Stopping recognition")
      // Note: onend event will set isListening to false
    } catch (err) {
      console.error("[VOICE] Error stopping recognition:", err)
      setIsListening(false)
      updateDebugInfo({ recognitionState: "stop_failed" })
    }
  }, [isListening, updateDebugInfo])

  // Initialize speech recognition
  useEffect(() => {
    try {
      // DEMO: Check browser support
      const browserName = detectBrowser()
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const speechSynthesisSupported = "speechSynthesis" in window

      updateDebugInfo({
        browserSupport: {
          speechRecognition: !!SpeechRecognition,
          speechSynthesis: speechSynthesisSupported,
          browser: browserName,
        },
      })

      if (!SpeechRecognition) {
        setError(`Speech recognition not supported in ${browserName}. Please try Chrome or Edge.`)
        setIsSupported(false)
        updateDebugInfo({ recognitionState: "unsupported" })
        return
      }

      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onstart = () => {
        setIsListening(true)
        updateDebugInfo({ recognitionState: "listening" })
        console.log("[VOICE] Recognition started")
      }

      recognitionInstance.onresult = (event: any) => {
        try {
          const current = event.resultIndex
          const transcriptValue = event.results[current][0].transcript
          setTranscript(transcriptValue)
          console.log("[VOICE] Transcript:", transcriptValue)
        } catch (err) {
          console.error("[VOICE] Error processing result:", err)
          setError("Error processing speech result")
        }
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("[VOICE] Recognition error:", event.error)
        setError(`Speech recognition error: ${event.error}`)
        setIsListening(false)
        updateDebugInfo({ recognitionState: "error" })
      }

      recognitionInstance.onend = () => {
        console.log("[VOICE] Recognition ended")
        setIsListening(false)
        updateDebugInfo({ recognitionState: "ended" })
      }

      recognitionRef.current = recognitionInstance
      setIsSupported(true)
      setError(null)
      updateDebugInfo({ recognitionState: "initialized" })
    } catch (err) {
      console.error("[VOICE] Initialization error:", err)
      setError("Failed to initialize speech recognition")
      setIsSupported(false)
      updateDebugInfo({ recognitionState: "initialization_failed" })
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (err) {
          console.error("[VOICE] Error stopping recognition on cleanup:", err)
        }
      }
    }
  }, [updateDebugInfo])

  // Process voice commands when transcript changes
  useEffect(() => {
    if (!transcript || !isListening) return

    // DEMO: Simple keyword matching for voice commands
    const processCommand = () => {
      const command = transcript.toLowerCase()
      updateDebugInfo({ lastCommand: command })

      if (command.includes("find washer") || command.includes("find machine")) {
        speak("Taking you to the machines page")
        router.push("/machines")
        return true
      } else if (command.includes("find detergent") || command.includes("find deals")) {
        speak("Taking you to the deals page")
        router.push("/deals")
        return true
      } else if (command.includes("check supplies") || command.includes("supplies")) {
        speak("Taking you to the supplies page")
        router.push("/supplies")
        return true
      } else if (command.includes("my orders") || command.includes("order history")) {
        speak("Taking you to your orders")
        router.push("/orders")
        return true
      } else if (command.includes("dashboard") || command.includes("home")) {
        speak("Taking you to the dashboard")
        router.push("/dashboard")
        return true
      } else if (command.includes("settings") || command.includes("profile")) {
        speak("Taking you to settings")
        router.push("/settings")
        return true
      } else if (command.includes("help")) {
        speak(
          "You can ask me to find machines, check deals, view supplies, see your orders, go to dashboard, or open settings",
        )
        return true
      }

      return false
    }

    // Wait a bit for the full command before processing
    const timer = setTimeout(() => {
      try {
        const commandProcessed = processCommand()
        console.log("[VOICE] Command processed:", commandProcessed)

        if (commandProcessed) {
          stopListening()
          setIsVoiceModalOpen(false)
        }
      } catch (err) {
        console.error("[VOICE] Error processing command:", err)
        setError("Error processing voice command")
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [transcript, isListening, router, speak, stopListening])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return

    setError(null)
    setTranscript("")

    try {
      recognitionRef.current.start()
      console.log("[VOICE] Attempting to start recognition")
      // Note: onstart event will set isListening to true
    } catch (err) {
      console.error("[VOICE] Error starting recognition:", err)
      setError("Failed to start speech recognition")
      setIsListening(false)
      updateDebugInfo({ recognitionState: "start_failed" })

      // Try to recreate the recognition instance
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
          const newInstance = new SpeechRecognition()
          newInstance.continuous = true
          newInstance.interimResults = true
          newInstance.lang = "en-US"

          // Copy event handlers
          if (recognitionRef.current) {
            newInstance.onstart = recognitionRef.current.onstart
            newInstance.onresult = recognitionRef.current.onresult
            newInstance.onerror = recognitionRef.current.onerror
            newInstance.onend = recognitionRef.current.onend
          }

          recognitionRef.current = newInstance
          console.log("[VOICE] Recognition instance recreated")
        }
      } catch (recreateErr) {
        console.error("[VOICE] Failed to recreate recognition instance:", recreateErr)
      }
    }
  }, [isListening, updateDebugInfo])

  const cancelSpeech = useCallback(() => {
    if (!("speechSynthesis" in window)) return

    try {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      console.log("[VOICE] Speech cancelled")
    } catch (err) {
      console.error("[VOICE] Error cancelling speech:", err)
    }
  }, [])

  const openVoiceModal = useCallback(() => {
    setIsVoiceModalOpen(true)
    setError(null)
    console.log("[VOICE] Modal opened")

    // Start listening after a short delay to ensure modal is open
    setTimeout(() => {
      startListening()
    }, 300)
  }, [startListening])

  const closeVoiceModal = useCallback(() => {
    setIsVoiceModalOpen(false)
    stopListening()
    cancelSpeech()
    console.log("[VOICE] Modal closed")
  }, [stopListening, cancelSpeech])

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        isVoiceModalOpen,
        isSpeaking,
        startListening,
        stopListening,
        speak,
        cancelSpeech,
        openVoiceModal,
        closeVoiceModal,
        isSupported,
        error,
        debugInfo,
      }}
    >
      {children}
    </VoiceContext.Provider>
  )
}

export const useVoice = () => useContext(VoiceContext)
