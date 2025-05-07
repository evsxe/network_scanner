"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Target } from "./types"
import { createTarget, updateTarget } from "./target-api"
import { Checkbox } from "@/components/ui/checkbox"

interface TargetDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (target: Target) => void
  existingTarget?: Target
}

export default function TargetDialog({ isOpen, onClose, onSuccess, existingTarget }: TargetDialogProps) {
  const [uri, setUri] = useState(existingTarget?.uri || "")
  const [description, setDescription] = useState(existingTarget?.description || "")
  const [useAD, setUseAD] = useState(Boolean(existingTarget?.ad_username))
  const [adUsername, setAdUsername] = useState(existingTarget?.ad_username || "")
  const [adPassword, setAdPassword] = useState(existingTarget?.ad_password || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = Boolean(existingTarget)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const targetData = {
        uri,
        description,
        ...(useAD ? { ad_username: adUsername, ad_password: adPassword } : {}),
      }

      let result: Target

      if (isEdit && existingTarget) {
        result = await updateTarget({
          ...existingTarget,
          ...targetData,
        })
      } else {
        result = await createTarget(targetData)
      }

      onSuccess(result)
      onClose()
    } catch (err) {
      console.error("Error saving target:", err)
      setError("Failed to save target. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Target" : "Add New Target"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {isEdit ? "Update the target information below." : "Enter the details for the new scanning target."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="uri" className="text-gray-200">
                Target URI
              </Label>
              <Input
                id="uri"
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                placeholder="https://example.com or 192.168.1.0/24"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-200">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a description of this target"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400 resize-none h-20"
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useAD"
                  checked={useAD}
                  onCheckedChange={(checked) => setUseAD(checked as boolean)}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="useAD" className="text-gray-200 cursor-pointer">
                  Use Active Directory credentials for internal scanning
                </Label>
              </div>

              {useAD && (
                <div className="space-y-4 pl-6 border-l-2 border-gray-700">
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
                      required={useAD}
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
                      required={useAD}
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded-md border border-red-500/20">{error}</div>
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
                  Saving...
                </span>
              ) : isEdit ? (
                "Update Target"
              ) : (
                "Create Target"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
