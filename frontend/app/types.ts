// API base types from Swagger
export interface AuthRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface RegisterRequest {
  username: string
  password: string
  secret?: string
}

// Target related types
export interface Target {
  id: string
  uri: string
  description: string
  created_at: string
  ad_username?: string
  ad_password?: string
}

export interface CreateTargetRequest {
  target: Target
}

export interface UpdateTargetRequest {
  target: Target
}

// Scan related types
export interface Scan {
  id: string
  targets: string[]
  status: string
  mode: string
  module: string
  created_at: string
}

export interface CreateScanRequest {
  scan: Scan
}

export interface UpdateScanRequest {
  scan: Scan
}

export interface StartScanRequest {
  id: string
}

export interface StopScanRequest {
  id: string
}

// Finding related types
export interface About {
  type: string
  severity: string
  description: string
  position: string
}

export interface InjectionPoint {
  payload: string
  matched: string
}

export interface Interaction {
  request: string
  response: string
}

export interface Details {
  "injection-point": InjectionPoint
  interaction: Interaction
}

export interface Finding {
  id: string
  scanID: string
  targetID: string
  about: string
  details: string
  createdAt: string
  userId: string
}

export interface NewFindingRequest {
  finding: {
    about: About
    details: Details
    scan_id: string
    target_id: string
  }
}

// Task related types
export interface Task {
  id: string
  scan_id: string
  type: string
  user_id: string
  created_at: string
}

export interface ConfirmTaskRequest {
  id: string
}

export interface ScanExtended {
  id: string
  status: string
  mode: string
  module: string
  created_at: string
  targets: Target[]
}

export interface TaskResponse {
  task: Task
  scan: ScanExtended
}

// UI types for vulnerability counts
export interface VulnerabilityCounts {
  critical: number
  high: number
  medium: number
  low: number
  misc?: number
}
