import type { NextApiRequest, NextApiResponse } from "next"
import { users } from "../../lib/mock-data"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  // DEMO: For demo purposes, accept any credentials
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" })
  }

  // DEMO: Generate a fake token
  const token = `demo-token-${Date.now()}`

  // Find a user or use a default one
  const user = users.find((u) => u.email === email) || users[0]

  // Return success with token and user data
  return res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        preferences: user.preferences,
        avatar: user.avatar,
      },
    },
    message: "Login successful",
  })
}
