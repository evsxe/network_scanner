import type { AuthRequest, RegisterRequest } from "./types"
import { API_BASE_URL, setAuthToken, clearAuthToken } from "./api-config"

// Authenticate user
export async function authenticateUser(credentials: AuthRequest): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`)
    }

    const data = await response.json()
    // Assuming the API returns a token property
    if (data.token) {
      setAuthToken(data.token)
      return true
    }
    return false
  } catch (error) {
    console.error("Authentication error:", error)
    clearAuthToken()
    return false
  }
}

// Register a new user
export async function registerUser(registrationData: RegisterRequest): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    })

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error("Registration error:", error)
    return false
  }
}

// Logout user
export function logoutUser(): void {
  clearAuthToken()
}
