import type { Finding } from "./types"
import { API_BASE_URL, createAuthHeaders } from "./api-config"

// Get all findings
export async function getAllFindings(): Promise<Finding[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/finding/all`, {
      headers: createAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error fetching findings: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch findings:", error)
    throw error
  }
}

// Get findings by target ID
export async function getFindingsByTarget(targetId: string): Promise<Finding[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/finding?target_id=${targetId}`, {
      headers: createAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error fetching findings: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch findings for target ${targetId}:`, error)
    throw error
  }
}
