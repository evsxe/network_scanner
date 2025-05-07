"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Scan } from "./types"
import { getScan } from "./scan-api"
import { getTarget } from "./target-api"
import { Key, Loader2 } from "lucide-react"

interface ScanInfoDialogProps {
  isOpen: boolean
  onClose: () => void
  scanId: string
}

export default function ScanInfoDialog({ isOpen, onClose, scanId }: ScanInfoDialogProps) {
  const [scan, setScan] = useState<Scan | null>(null)
  const [targetDetails, setTargetDetails] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !scanId) return

    const fetchScanDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const scanData = await getScan(scanId)
        setScan(scanData)

        // Fetch target details for each target in the scan
        const targetDetailsMap = {}
        for (const targetId of scanData.targets) {
          try {
            const targetData = await getTarget(targetId)
            targetDetailsMap[targetId] = targetData
          } catch (err) {
            console.error(`Error fetching target ${targetId}:`, err)
            targetDetailsMap[targetId] = { error: "Failed to load target details" }
          }
        }

        setTargetDetails(targetDetailsMap)
      } catch (err) {
        console.error("Error fetching scan details:", err)
        setError("Failed to load scan information")
      } finally {
        setLoading(false)
      }
    }

    fetchScanDetails()
  }, [isOpen, scanId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle>Scan Information</DialogTitle>
          <DialogDescription className="text-gray-400">Detailed information about the selected scan.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : scan ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Scan ID</h4>
                  <p className="text-gray-200">{scan.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Status</h4>
                  <p className="text-gray-200">{scan.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Mode</h4>
                  <p className="text-gray-200">{scan.mode}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Module</h4>
                  <p className="text-gray-200">{scan.module}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Created</h4>
                  <p className="text-gray-200">{new Date(scan.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Targets</h4>
                <ul className="mt-1 space-y-1 text-gray-200">
                  {scan.targets.map((targetId) => {
                    const target = targetDetails[targetId]
                    return (
                      <li key={targetId} className="bg-gray-700 p-2 rounded-md">
                        {target ? (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{target.uri || targetId}</span>
                              {target.ad_username && (
                                <div className="flex items-center text-xs text-gray-400">
                                  <Key className="h-3 w-3 mr-1" />
                                  <span>{target.ad_username}</span>
                                </div>
                              )}
                            </div>
                            {target.description && <p className="text-sm text-gray-400 mt-1">{target.description}</p>}
                          </div>
                        ) : (
                          targetId
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="bg-gray-700 p-3 rounded-md">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Progress</h4>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="text-blue-400">30%</span>
                  <span className="text-gray-400">Estimated time: 15 minutes remaining</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center p-4">No scan information available</div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
