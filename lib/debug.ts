// Debug utility for authentication flow
const DEBUG = true

export const debugLog = (component: string, action: string, data?: any) => {
  if (DEBUG) {
    console.log(`[DEBUG][${component}][${action}]`, data || "")
  }
}

export const debugError = (component: string, action: string, error: any) => {
  if (DEBUG) {
    console.error(`[ERROR][${component}][${action}]`, error)
  }
}
