// API configuration
const API_BASE_URL = "/api"

// Helper function to get the auth token
export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token")
}

// Helper function to set the auth token
export function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token)
}

// Helper function to clear the auth token
export function clearAuthToken(): void {
  localStorage.removeItem("auth_token")
}

// Helper function to check if the user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

// Helper function to create headers with authentication
export function createAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export { API_BASE_URL }
