import type { Scan, CreateScanRequest, UpdateScanRequest, StartScanRequest, StopScanRequest } from "./types"
import { API_BASE_URL, createAuthHeaders } from "./api-config"

// Get all scans
export async function getAllScans(): Promise<Scan[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/scan/all`, {
      headers: createAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error fetching scans: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch scans:", error)
    throw error
  }
}

// Get a scan by ID
export async function getScan(id: string): Promise<Scan> {
  try {
    const response = await fetch(`${API_BASE_URL}/scan?id=${id}`, {
      headers: createAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error fetching scan: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch scan ${id}:`, error)
    throw error
  }
}

// Create a new scan
export async function createScan(scanData: {
  targets: string[]
  mode: string
  module: string
  ad_username?: string
  ad_password?: string
}): Promise<Scan> {
  try {
    const request: CreateScanRequest = {
      scan: {
        id: "", // Will be assigned by the server
        targets: scanData.targets,
        status: "created",
        mode: scanData.mode,
        module: scanData.module,
        created_at: "", // Will be assigned by the server
      },
    }

    const response = await fetch(`${API_BASE_URL}/scan/new`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Error creating scan: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to create scan:", error)
    throw error
  }
}

// Update a scan
export async function updateScan(scanData: Scan): Promise<Scan> {
  try {
    const request: UpdateScanRequest = {
      scan: scanData,
    }

    const response = await fetch(`${API_BASE_URL}/scan/update`, {
      method: "PATCH",
      headers: createAuthHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Error updating scan: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to update scan ${scanData.id}:`, error)
    throw error
  }
}

// Delete a scan
export async function deleteScan(id: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/scan/delete?id=${id}`, {
      method: "DELETE",
      headers: createAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error deleting scan: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to delete scan ${id}:`, error)
    throw error
  }
}

// Start a scan
export async function startScan(id: string): Promise<string> {
  try {
    const request: StartScanRequest = {
      id,
    }

    const response = await fetch(`${API_BASE_URL}/scan/start`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Error starting scan: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to start scan ${id}:`, error)
    throw error
  }
}

// Stop a scan
export async function stopScan(id: string): Promise<string> {
  try {
    const request: StopScanRequest = {
      id,
    }

    const response = await fetch(`${API_BASE_URL}/scan/stop`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Error stopping scan: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to stop scan ${id}:`, error)
    throw error
  }
}
