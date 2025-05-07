"use client"

import { useState, useEffect } from "react"
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Crosshair,
  Edit,
  FileBarChart,
  FileText,
  Info,
  LayoutDashboard,
  Loader2,
  Pause,
  Play,
  Rocket,
  Scan,
  Search,
  Shield,
  ShieldAlert,
  Square,
  Trash2,
  User,
  Key,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthProvider, useAuth } from "./auth-context"
import LoginPage from "./login-page"
import ProfilePage from "./profile-page"
import TargetDialog from "./target-dialog"
import ScanDialog from "./scan-dialog"
import ScanInfoDialog from "./scan-info-dialog"
import ReportViewer from "./report-viewer"
import type { Target, Scan as ScanType, VulnerabilityCounts, Finding } from "./types"
import { getAllTargets, deleteTarget } from "./target-api"
import { getAllScans, startScan, stopScan } from "./scan-api"
import { getAllFindings, getFindingsByTarget } from "./finding-api"
import TargetFilters, { type SortOption } from "./target-filters"

type SortDirection = "asc" | "desc"

function TopBar({ setActivePage }) {
  const { user } = useAuth()

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Search className="w-6 h-6 text-blue-400 mr-2" />
        <span className="text-xl font-bold text-gray-100">Scanner1726</span>
      </div>
      <button
        className="p-2 rounded-full bg-gray-700 text-gray-300 hover:text-gray-100 hover:bg-gray-600"
        onClick={() => setActivePage("profile")}
      >
        <User className="w-6 h-6" />
      </button>
    </div>
  )
}

function SideMenu({ activePage, setActivePage }) {
  return (
    <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-4">
      <button
        className={`p-2 rounded-lg ${activePage === "overview" ? "bg-gray-700 text-blue-400" : "text-gray-400 hover:bg-gray-700 hover:text-gray-100"} transition-colors`}
        onClick={() => setActivePage("overview")}
      >
        <LayoutDashboard className="w-6 h-6" />
      </button>
      <button
        className={`p-2 rounded-lg ${activePage === "targets" ? "bg-gray-700 text-blue-400" : "text-gray-400 hover:bg-gray-700 hover:text-gray-100"} transition-colors`}
        onClick={() => setActivePage("targets")}
      >
        <Crosshair className="w-6 h-6" />
      </button>
      <button
        className={`p-2 rounded-lg ${activePage === "scans" ? "bg-gray-700 text-blue-400" : "text-gray-400 hover:bg-gray-700 hover:text-gray-100"} transition-colors`}
        onClick={() => setActivePage("scans")}
      >
        <Scan className="w-6 h-6" />
      </button>
      <button
        className={`p-2 rounded-lg ${activePage === "vulnerabilities" ? "bg-gray-700 text-blue-400" : "text-gray-400 hover:bg-gray-700 hover:text-gray-100"} transition-colors`}
        onClick={() => setActivePage("vulnerabilities")}
      >
        <BarChart3 className="w-6 h-6" />
      </button>
      <button
        className={`p-2 rounded-lg ${activePage === "reports" ? "bg-gray-700 text-blue-400" : "text-gray-400 hover:bg-gray-700 hover:text-gray-100"} transition-colors`}
        onClick={() => setActivePage("reports")}
      >
        <FileBarChart className="w-6 h-6" />
      </button>
    </div>
  )
}

function ScanItem({ scan, onInfoClick, onStartClick, onStopClick, onPauseClick }) {
  const statusColors = {
    Active: "bg-green-500",
    Paused: "bg-yellow-500",
    Finished: "bg-blue-500",
    Failed: "bg-red-500",
    created: "bg-purple-500",
  }

  // Calculate vulnerability counts from findings
  const [vulnerabilityCounts, setVulnerabilityCounts] = useState<VulnerabilityCounts>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFindings = async () => {
      setLoading(true)
      try {
        // For each target in the scan, fetch findings
        const allFindings: Finding[] = []
        for (const targetId of scan.targets) {
          const findings = await getFindingsByTarget(targetId)
          allFindings.push(...findings)
        }

        // Count vulnerabilities by severity
        const counts: VulnerabilityCounts = {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        }

        allFindings.forEach((finding) => {
          try {
            const about = JSON.parse(finding.about)
            switch (about.severity?.toLowerCase()) {
              case "critical":
                counts.critical++
                break
              case "high":
                counts.high++
                break
              case "medium":
                counts.medium++
                break
              case "low":
                counts.low++
                break
              default:
                // Ignore or count as misc
                break
            }
          } catch (e) {
            // Handle parsing error
            console.error("Error parsing finding:", e)
          }
        })

        setVulnerabilityCounts(counts)
      } catch (error) {
        console.error("Error fetching findings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFindings()
  }, [scan.targets])

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">Target ID: {scan.targets.join(", ")}</h3>
            <p className="text-sm text-gray-400">
              Mode: {scan.mode} - Module: {scan.module}
            </p>
          </div>
          <Badge className={`${statusColors[scan.status] || "bg-gray-500"} text-gray-900`}>{scan.status}</Badge>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">Created: {new Date(scan.created_at).toLocaleString()}</div>
          <div className="flex space-x-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <>
                <span className="flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">{vulnerabilityCounts.critical}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-500">{vulnerabilityCounts.high}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500">{vulnerabilityCounts.medium}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-500">{vulnerabilityCounts.low}</span>
                </span>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            size="sm"
            variant="outline"
            disabled={scan.status !== "Paused" && scan.status !== "created"}
            className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
            onClick={() => onStartClick(scan.id)}
          >
            <Play className="w-4 h-4 mr-1 text-white" /> Play
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={scan.status !== "Active"}
            className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
            onClick={() => onPauseClick(scan.id)}
          >
            <Pause className="w-4 h-4 mr-1 text-white" /> Pause
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={scan.status === "Finished" || scan.status === "Failed"}
            className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
            onClick={() => onStopClick(scan.id)}
          >
            <Square className="w-4 h-4 mr-1 text-white" /> Stop
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
            onClick={() => onInfoClick(scan.id)}
          >
            <Info className="w-4 h-4 mr-1 text-white" /> Info
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TargetItem({ target, onScanClick, onEditClick, onDeleteClick, onInfoClick }) {
  // Fetch findings for this target
  const [vulnerabilityCounts, setVulnerabilityCounts] = useState<VulnerabilityCounts>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFindings = async () => {
      setLoading(true)
      try {
        const findings = await getFindingsByTarget(target.id)

        // Count vulnerabilities by severity
        const counts: VulnerabilityCounts = {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        }

        findings.forEach((finding) => {
          try {
            const about = JSON.parse(finding.about)
            switch (about.severity?.toLowerCase()) {
              case "critical":
                counts.critical++
                break
              case "high":
                counts.high++
                break
              case "medium":
                counts.medium++
                break
              case "low":
                counts.low++
                break
              default:
                // Ignore or count as misc
                break
            }
          } catch (e) {
            // Handle parsing error
            console.error("Error parsing finding:", e)
          }
        })

        setVulnerabilityCounts(counts)
      } catch (error) {
        console.error("Error fetching findings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFindings()
  }, [target.id])

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{target.uri}</h3>
            <p className="text-sm text-gray-400">{target.description}</p>
            {target.ad_username && (
              <div className="flex items-center mt-1 text-xs text-gray-400">
                <Key className="h-3 w-3 mr-1" />
                <span>{target.ad_username}</span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
              onClick={() => onScanClick(target.id)}
            >
              <Rocket className="w-4 h-4 mr-1 text-white" /> Scan
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
              onClick={() => onEditClick(target)}
            >
              <Edit className="w-4 h-4 mr-1 text-white" /> Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
              onClick={() => onInfoClick(target.id)}
            >
              <Info className="w-4 h-4 mr-1 text-white" /> Info
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
              onClick={() => onDeleteClick(target.id)}
            >
              <Trash2 className="w-4 h-4 mr-1 text-white" /> Delete
            </Button>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <>
                <span className="flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">{vulnerabilityCounts.critical}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-500">{vulnerabilityCounts.high}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500">{vulnerabilityCounts.medium}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-500">{vulnerabilityCounts.low}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function VulnerabilityItem({ finding }) {
  const [parsedAbout, setParsedAbout] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const about = JSON.parse(finding.about)
      setParsedAbout(about)
    } catch (e) {
      console.error("Error parsing finding about:", e)
      setParsedAbout({ type: "Unknown", severity: "Unknown" })
    } finally {
      setLoading(false)
    }
  }, [finding])

  const severityColors = {
    Critical: "bg-red-500",
    High: "bg-orange-500",
    Medium: "bg-yellow-500",
    Low: "bg-blue-500",
  }

  const severityIcons = {
    Critical: <AlertCircle className="w-5 h-5" />,
    High: <AlertTriangle className="w-5 h-5" />,
    Medium: <Shield className="w-5 h-5" />,
    Low: <ShieldAlert className="w-5 h-5" />,
  }

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700 mb-4">
        <CardContent className="pt-6 flex justify-center items-center h-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  const severity = parsedAbout?.severity || "Unknown"
  const capitalizedSeverity = severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <Badge className={`${severityColors[capitalizedSeverity] || "bg-gray-500"} text-gray-900`}>
                {severityIcons[capitalizedSeverity] || <Info className="w-5 h-5" />}
                <span className="ml-1">{capitalizedSeverity}</span>
              </Badge>
              <h3 className="text-lg font-semibold text-gray-100">{parsedAbout?.type || "Unknown Issue"}</h3>
            </div>
            <p className="text-sm text-gray-400 mt-1">{parsedAbout?.position || finding.targetID}</p>
            {parsedAbout?.description && <p className="text-sm text-gray-300 mt-2">{parsedAbout.description}</p>}
          </div>
          <div className="text-sm text-gray-400">Found in scan: {finding.scanID}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportItem({ report, onViewClick }) {
  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{report.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{report.target}</p>
            <p className="text-sm text-gray-400 mt-2">{report.description}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
            onClick={() => onViewClick(report.id)}
          >
            <FileText className="w-4 h-4 mr-1 text-white" /> View
          </Button>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <span className="flex items-center space-x-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-500">{report.vulnerabilities.critical}</span>
            </span>
            <span className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500">{report.vulnerabilities.high}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500">{report.vulnerabilities.medium}</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldAlert className="w-4 h-4 text-blue-500" />
              <span className="text-blue-500">{report.vulnerabilities.low}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OverviewPage() {
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityCounts>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    misc: 0,
  })
  const [activeScans, setActiveScans] = useState<ScanType[]>([])
  const [latestAlerts, setLatestAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch all findings to calculate vulnerability counts
        const findings = await getAllFindings()

        // Count vulnerabilities by severity
        const counts: VulnerabilityCounts = {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          misc: 0,
        }

        findings.forEach((finding) => {
          try {
            const about = JSON.parse(finding.about)
            switch (about.severity?.toLowerCase()) {
              case "critical":
                counts.critical++
                break
              case "high":
                counts.high++
                break
              case "medium":
                counts.medium++
                break
              case "low":
                counts.low++
                break
              default:
                counts.misc++
                break
            }
          } catch (e) {
            counts.misc++
          }
        })

        setVulnerabilities(counts)

        // Fetch active scans
        const scans = await getAllScans()
        const active = scans.filter((scan) => scan.status === "Active")
        setActiveScans(active)

        // Create latest alerts from the most recent findings
        const sortedFindings = [...findings]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4)

        const alerts = sortedFindings.map((finding) => {
          let type = "Low"
          try {
            const about = JSON.parse(finding.about)
            type = about.severity?.charAt(0).toUpperCase() + about.severity?.slice(1).toLowerCase() || "Low"
          } catch (e) {
            // Use default
          }
          return {
            id: finding.id,
            type,
            description: `New ${type} vulnerability found in target ${finding.targetID}`,
          }
        })

        setLatestAlerts(alerts)
      } catch (error) {
        console.error("Failed to fetch overview data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-200">Overview</h1>
        <p className="text-gray-400">Real-time overview of your security landscape</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200">Vulnerability Overview</CardTitle>
              <CardDescription className="text-gray-400">Total vulnerabilities detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-gray-300">Critical</span>
                  </div>
                  <span className="font-bold text-red-500">{vulnerabilities.critical}</span>
                </div>
                <Progress value={vulnerabilities.critical} max={100} className="h-2 bg-gray-700 [&>div]:bg-red-500" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-gray-300">High</span>
                  </div>
                  <span className="font-bold text-orange-500">{vulnerabilities.high}</span>
                </div>
                <Progress value={vulnerabilities.high} max={100} className="h-2 bg-gray-700 [&>div]:bg-orange-500" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-gray-300">Medium</span>
                  </div>
                  <span className="font-bold text-yellow-500">{vulnerabilities.medium}</span>
                </div>
                <Progress value={vulnerabilities.medium} max={100} className="h-2 bg-gray-700 [&>div]:bg-yellow-500" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShieldAlert className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-300">Low</span>
                  </div>
                  <span className="font-bold text-blue-500">{vulnerabilities.low}</span>
                </div>
                <Progress value={vulnerabilities.low} max={100} className="h-2 bg-gray-700 [&>div]:bg-blue-500" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Info className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-300">Misc</span>
                  </div>
                  <span className="font-bold text-gray-400">{vulnerabilities.misc}</span>
                </div>
                <Progress value={vulnerabilities.misc} max={100} className="h-2 bg-gray-700 [&>div]:bg-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200">Active Scans</CardTitle>
              <CardDescription className="text-gray-400">Currently running security scans</CardDescription>
            </CardHeader>
            <CardContent>
              {activeScans.length > 0 ? (
                <ul className="space-y-4">
                  {activeScans.map((scan) => (
                    <li key={scan.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-200">Targets: {scan.targets.join(", ")}</span>
                        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-400">
                        Mode: {scan.mode} - Module: {scan.module}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Scan className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>No active scans running</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200">Latest Alerts</CardTitle>
              <CardDescription className="text-gray-400">Recent security notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {latestAlerts.length > 0 ? (
                <ul className="space-y-4">
                  {latestAlerts.map((alert) => (
                    <li key={alert.id} className="flex items-start space-x-3">
                      {alert.type === "Critical" && <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                      {alert.type === "High" && <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />}
                      {alert.type === "Medium" && <Shield className="w-5 h-5 text-yellow-500 mt-0.5" />}
                      {alert.type === "Low" && <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5" />}
                      <div>
                        <p className="font-semibold text-gray-200">{alert.type}</p>
                        <p className="text-sm text-gray-400">{alert.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>No recent alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function ScansPage() {
  const [scans, setScans] = useState<ScanType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null)
  const [isScanInfoOpen, setIsScanInfoOpen] = useState(false)

  const fetchScans = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllScans()
      setScans(data)
    } catch (err) {
      console.error("Failed to fetch scans:", err)
      setError("Failed to load scans. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScans()
  }, [])

  const handleInfoClick = (scanId: string) => {
    setSelectedScanId(scanId)
    setIsScanInfoOpen(true)
  }

  const handleStartScan = async (scanId: string) => {
    try {
      await startScan(scanId)
      // Refresh scans list
      fetchScans()
    } catch (error) {
      console.error("Failed to start scan:", error)
      alert("Failed to start scan. Please try again.")
    }
  }

  const handleStopScan = async (scanId: string) => {
    try {
      await stopScan(scanId)
      // Refresh scans list
      fetchScans()
    } catch (error) {
      console.error("Failed to stop scan:", error)
      alert("Failed to stop scan. Please try again.")
    }
  }

  const handlePauseScan = async (scanId: string) => {
    // This would typically call a pause API, but for now we'll use stop
    try {
      await stopScan(scanId)
      // Refresh scans list
      fetchScans()
    } catch (error) {
      console.error("Failed to pause scan:", error)
      alert("Failed to pause scan. Please try again.")
    }
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Scans</h1>
        <p className="text-gray-400">Overview of all security scans</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 text-red-500">{error}</div>
      ) : scans.length > 0 ? (
        <div className="space-y-4">
          {scans.map((scan) => (
            <ScanItem
              key={scan.id}
              scan={scan}
              onInfoClick={handleInfoClick}
              onStartClick={handleStartScan}
              onStopClick={handleStopScan}
              onPauseClick={handlePauseScan}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <Scan className="mx-auto h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No scans found</h3>
          <p>Start a new scan from the Targets page</p>
        </div>
      )}

      {isScanInfoOpen && selectedScanId && (
        <ScanInfoDialog isOpen={isScanInfoOpen} onClose={() => setIsScanInfoOpen(false)} scanId={selectedScanId} />
      )}
    </div>
  )
}

function VulnerabilitiesPage() {
  const [findings, setFindings] = useState<Finding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFindings = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getAllFindings()
        setFindings(data)
      } catch (err) {
        console.error("Failed to fetch findings:", err)
        setError("Failed to load vulnerabilities. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFindings()
  }, [])

  // Sort findings by severity (critical first)
  const sortedFindings = [...findings].sort((a, b) => {
    const getSeverityWeight = (finding: Finding) => {
      try {
        const about = JSON.parse(finding.about)
        switch (about.severity?.toLowerCase()) {
          case "critical":
            return 4
          case "high":
            return 3
          case "medium":
            return 2
          case "low":
            return 1
          default:
            return 0
        }
      } catch (e) {
        return 0
      }
    }

    return getSeverityWeight(b) - getSeverityWeight(a)
  })

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Vulnerabilities</h1>
        <p className="text-gray-400">List of all detected vulnerabilities</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 text-red-500">{error}</div>
      ) : sortedFindings.length > 0 ? (
        <div className="space-y-4">
          {sortedFindings.map((finding) => (
            <VulnerabilityItem key={finding.id} finding={finding} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <ShieldAlert className="mx-auto h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No vulnerabilities found</h3>
          <p>Run scans to discover potential security issues</p>
        </div>
      )}
    </div>
  )
}

function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [viewingReport, setViewingReport] = useState(false)

  const reports = [
    {
      id: 1,
      name: "Q3 2023 Security Assessment",
      target: "https://example.com",
      description: "Comprehensive security audit of the main website",
      vulnerabilities: { critical: 2, high: 5, medium: 10, low: 20 },
    },
    {
      id: 2,
      name: "API Security Review",
      target: "https://api.example.com",
      description: "In-depth analysis of API endpoints and authentication mechanisms",
      vulnerabilities: { critical: 1, high: 3, medium: 7, low: 15 },
    },
    {
      id: 3,
      name: "Internal Network Vulnerability Assessment",
      target: "192.168.1.0/24",
      description: "Evaluation of internal network security posture",
      vulnerabilities: { critical: 0, high: 8, medium: 12, low: 25 },
    },
    {
      id: 4,
      name: "Development Environment Security Audit",
      target: "https://dev.example.com",
      description: "Security review of development and staging environments",
      vulnerabilities: { critical: 3, high: 6, medium: 9, low: 18 },
    },
  ]

  const handleViewReport = (reportId: number) => {
    setSelectedReportId(reportId.toString())
    setViewingReport(true)
  }

  const handleBackFromReport = () => {
    setViewingReport(false)
    setSelectedReportId(null)
  }

  if (viewingReport && selectedReportId) {
    return <ReportViewer reportId={selectedReportId} onBack={handleBackFromReport} />
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Reports</h1>
        <p className="text-gray-400">List of all security assessment reports</p>
      </header>
      <div className="space-y-4">
        {reports.map((report) => (
          <ReportItem key={report.id} report={report} onViewClick={handleViewReport} />
        ))}
      </div>
    </div>
  )
}

// Update the TargetsPage component to include search and sorting functionality
function TargetsPage({ onStartScan }) {
  const [targets, setTargets] = useState<Target[]>([])
  const [filteredTargets, setFilteredTargets] = useState<Target[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateTargetOpen, setIsCreateTargetOpen] = useState(false)
  const [isEditTargetOpen, setIsEditTargetOpen] = useState(false)
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null)
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSort, setActiveSort] = useState<SortOption | null>(null)

  const fetchTargets = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllTargets()
      setTargets(data)
      setFilteredTargets(data)
    } catch (err) {
      console.error("Failed to fetch targets:", err)
      setError("Failed to load targets. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTargets()
  }, [])

  // Apply filters and sorting whenever targets, search query, or sort option changes
  useEffect(() => {
    let result = [...targets]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (target) =>
          target.uri.toLowerCase().includes(query) ||
          (target.description && target.description.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    if (activeSort) {
      result.sort((a, b) => {
        // Handle date fields specially
        if (activeSort.value === "created_at") {
          const aDate = new Date(a[activeSort.value] || 0).getTime()
          const bDate = new Date(b[activeSort.value] || 0).getTime()

          return activeSort.direction === "asc" ? aDate - bDate : bDate - aDate
        }

        // Handle string fields
        const aValue = String(a[activeSort.value] || "").toLowerCase()
        const bValue = String(b[activeSort.value] || "").toLowerCase()

        if (activeSort.direction === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    setFilteredTargets(result)
  }, [targets, searchQuery, activeSort])

  const handleCreateTarget = (newTarget: Target) => {
    setTargets((prev) => [...prev, newTarget])
  }

  const handleUpdateTarget = (updatedTarget: Target) => {
    setTargets((prev) => prev.map((target) => (target.id === updatedTarget.id ? updatedTarget : target)))
  }

  const handleDeleteTarget = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this target?")) {
      try {
        await deleteTarget(id)
        setTargets((prev) => prev.filter((target) => target.id !== id))
      } catch (err) {
        console.error("Failed to delete target:", err)
        alert("Failed to delete target. Please try again.")
      }
    }
  }

  const handleScanSuccess = (scan: ScanType) => {
    // Redirect to scans page
    onStartScan()
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort)
  }

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Targets</h1>
          <p className="text-gray-400">List of all scanning targets</p>
        </div>
        <Button
          onClick={() => setIsCreateTargetOpen(true)}
          className="bg-black border-gray-600 hover:bg-gray-900 text-white"
        >
          Add Target
        </Button>
      </header>

      <TargetFilters onSearchChange={handleSearchChange} onSortChange={handleSortChange} activeSort={activeSort} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 text-red-500">{error}</div>
      ) : filteredTargets.length > 0 ? (
        <div className="space-y-4">
          {filteredTargets.map((target) => (
            <TargetItem
              key={target.id}
              target={target}
              onScanClick={(id) => {
                setSelectedTargetId(id)
                setIsScanDialogOpen(true)
              }}
              onEditClick={(target) => {
                setSelectedTarget(target)
                setIsEditTargetOpen(true)
              }}
              onDeleteClick={handleDeleteTarget}
              onInfoClick={() => {}} // Not implemented in this version
            />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-10 text-gray-400">
          <Search className="mx-auto h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No targets match your search</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <Crosshair className="mx-auto h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No targets found</h3>
          <p>Add a target to start scanning</p>
        </div>
      )}

      <TargetDialog
        isOpen={isCreateTargetOpen}
        onClose={() => setIsCreateTargetOpen(false)}
        onSuccess={handleCreateTarget}
      />

      {selectedTarget && (
        <TargetDialog
          isOpen={isEditTargetOpen}
          onClose={() => {
            setIsEditTargetOpen(false)
            setSelectedTarget(null)
          }}
          onSuccess={handleUpdateTarget}
          existingTarget={selectedTarget}
        />
      )}

      {selectedTargetId && (
        <ScanDialog
          isOpen={isScanDialogOpen}
          onClose={() => {
            setIsScanDialogOpen(false)
            setSelectedTargetId(null)
          }}
          onSuccess={handleScanSuccess}
          targetId={selectedTargetId}
        />
      )}
    </div>
  )
}

export default function CybersecurityDashboard() {
  const [activePage, setActivePage] = useState("overview")

  return (
    <AuthProvider>
      <AppContent activePage={activePage} setActivePage={setActivePage} />
    </AuthProvider>
  )
}

function AppContent({ activePage, setActivePage }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <TopBar setActivePage={setActivePage} />
      <div className="flex flex-1">
        <SideMenu activePage={activePage} setActivePage={setActivePage} />
        <div className="flex-1 overflow-auto">
          {activePage === "overview" && <OverviewPage />}
          {activePage === "targets" && <TargetsPage onStartScan={() => setActivePage("scans")} />}
          {activePage === "scans" && <ScansPage />}
          {activePage === "vulnerabilities" && <VulnerabilitiesPage />}
          {activePage === "reports" && <ReportsPage />}
          {activePage === "profile" && <ProfilePage onBack={() => setActivePage("overview")} />}
        </div>
      </div>
    </div>
  )
}
