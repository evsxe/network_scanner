import type { Target, CreateTargetRequest, UpdateTargetRequest } from "./types"
import { API_BASE_URL, createAuthHeaders } from "./api-config"

// Get all targets
export async function getAllTargets(): Promise<Target[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/target/all`, {
      headers: createAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error fetching targets: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch targets:", error)
    throw error
  }
}

// Get a target by ID
export async function getTarget(id: string): Promise<Target> {
  try {
    const response = await fetch(`${API_BASE_URL}/target?id=${id}`, {
      headers: createAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error fetching target: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch target ${id}:`, error)
    throw error
  }
}

// Create a new target
export async function createTarget(targetData: Omit<Target, "id" | "created_at">): Promise<Target> {
  try {
    const request: CreateTargetRequest = {
      target: {
        ...targetData,
        id: "", // Will be assigned by the server
        created_at: "", // Will be assigned by the server
      },
    }

    const response = await fetch(`${API_BASE_URL}/target/new`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Error creating target: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to create target:", error)
    throw error
  }
}

// Update a target
export async function updateTarget(targetData: Target): Promise<Target> {
  try {
    const request: UpdateTargetRequest = {
      target: targetData,
    }

    const response = await fetch(`${API_BASE_URL}/target/update`, {
      method: "PATCH",
      headers: createAuthHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Error updating target: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to update target ${targetData.id}:`, error)
    throw error
  }
}

// Delete a target
export async function deleteTarget(id: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/target/delete?id=${id}`, {
      method: "DELETE",
      headers: createAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error deleting target: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to delete target ${id}:`, error)
    throw error
  }
}
