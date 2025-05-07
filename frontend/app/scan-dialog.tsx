"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, ChevronDown, ChevronUp, Key } from "lucide-react"
import type { Scan, Target } from "./types"
import { createScan } from "./scan-api"
import { getTarget } from "./target-api"
import { Checkbox } from "@/components/ui/checkbox"

interface ScanDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (scan: Scan) => void
  targetId: string
}

export default function ScanDialog({ isOpen, onClose, onSuccess, targetId }: ScanDialogProps) {
  const [mode, setMode] = useState("Full")
  const [module, setModule] = useState("Web Scanner")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [target, setTarget] = useState<Target | null>(null)
  const [useAuth, setUseAuth] = useState(false)
  const [showAuthFields, setShowAuthFields] = useState(false)
  const [adUsername, setAdUsername] = useState("")
  const [adPassword, setAdPassword] = useState("")
  const [loadingTarget, setLoadingTarget] = useState(true)

  // Fetch target details when dialog opens
  React.useEffect(() => {
    if (isOpen && targetId) {
      const fetchTarget = async () => {
        setLoadingTarget(true)
        try {
          const targetData = await getTarget(targetId)
          setTarget(targetData)

          // If target has AD credentials, pre-fill them
          if (targetData.ad_username) {
            setAdUsername(targetData.ad_username)
            setAdPassword(targetData.ad_password || "")
            setUseAuth(true)
            setShowAuthFields(true)
          }
        } catch (err) {
          console.error("Error fetching target:", err)
        } finally {
          setLoadingTarget(false)
        }
      }

      fetchTarget()
    }
  }, [isOpen, targetId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const scanData = {
        targets: [targetId],
        mode,
        module,
        ...(useAuth ? { ad_username: adUsername, ad_password: adPassword } : {}),
      }

      const scan = await createScan(scanData)
      onSuccess(scan)
      onClose()
    } catch (err) {
      console.error("Error starting scan:", err)
      setError("Failed to start scan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleAuthFields = () => {
    setShowAuthFields(!showAuthFields)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle>Start New Scan</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure and start a new security scan for the selected target.
          </DialogDescription>
        </DialogHeader>

        {loadingTarget ? (
          <div className="py-8 flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {target && (
                <div className="bg-gray-700 p-3 rounded-md mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Target</h4>
                  <p className="text-gray-200 font-medium">{target.uri}</p>
                  {target.description && <p className="text-gray-400 text-sm mt-1">{target.description}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="mode" className="text-gray-200">
                  Scan Mode
                </Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger id="mode" className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectItem value="Quick">Quick</SelectItem>
                    <SelectItem value="Full">Full</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="module" className="text-gray-200">
                  Scanner Module
                </Label>
                <Select value={module} onValueChange={setModule}>
                  <SelectTrigger id="module" className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Select scanner module" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectItem value="Web Scanner">Web Scanner</SelectItem>
                    <SelectItem value="API Scanner">API Scanner</SelectItem>
                    <SelectItem value="Network Scanner">Network Scanner</SelectItem>
                    <SelectItem value="Custom Scanner">Custom Scanner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useAuth"
                      checked={useAuth}
                      onCheckedChange={(checked) => setUseAuth(checked as boolean)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="useAuth" className="text-gray-200 cursor-pointer flex items-center">
                      <Key className="h-4 w-4 mr-1 text-gray-400" />
                      Use Active Directory Authentication
                    </Label>
                  </div>
                  {useAuth && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleAuthFields}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      {showAuthFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  )}
                </div>

                {useAuth && showAuthFields && (
                  <div className="space-y-4 mt-4 pl-6 border-l-2 border-gray-700">
                    <div className="space-y-2">
                      <Label htmlFor="adUsername" className="text-gray-200">
                        AD Username
                      </Label>
                      <Input
                        id="adUsername"
                        value={adUsername}
                        onChange={(e) => setAdUsername(e.target.value)}
                        placeholder="domain\username or username@domain.com"
                        className="bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
                        required={useAuth}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adPassword" className="text-gray-200">
                        AD Password
                      </Label>
                      <Input
                        id="adPassword"
                        type="password"
                        value={adPassword}
                        onChange={(e) => setAdPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
                        required={useAuth}
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm p-2 bg-red-500/10 rounded-md border border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                type="button"
                className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Starting Scan...
                  </span>
                ) : (
                  "Start Scan"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
