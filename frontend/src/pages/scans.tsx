import {useState} from "react"
import {AlertCircle, AlertTriangle, Pause, Info, Play, Shield, ShieldAlert, Square, X} from "lucide-react";

import {Badge} from "../components/ui/badge.tsx";
import {Button} from "../components/ui/button.tsx";
import {Progress} from "../components/ui/progress.tsx";
import {Card, CardHeader, CardTitle, CardContent} from "../components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../components/ui/table";

interface Vulnerabilities {
    critical: number;
    high: number;
    medium: number;
    low: number;
}

interface DetectedVulnerability {
    severity: "Critical" | "High" | "Medium" | "Low";
    name: string;
    description: string;
}

interface Scan {
    id: number;
    target: string;
    description: string;
    status: "Active" | "Paused" | "Finished" | "Failed";
    time: string;
    vulnerabilities: Vulnerabilities;
    detectedVulnerabilities: DetectedVulnerability[];
}

interface ScanItemProps {
    scan: Scan;
    onInfo: (scan: Scan) => void;
}

function ScanItem({scan, onInfo}: ScanItemProps) {
    const statusColors: Record<Scan["status"], string> = {
        Active: "bg-green-500",
        Paused: "bg-yellow-500",
        Finished: "bg-blue-500",
        Failed: "bg-red-500",
    };

    return (
        <Card className="bg-gray-800 border-gray-700 mb-4">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-100">{scan.target}</h3>
                        <p className="text-sm text-gray-400">{scan.description}</p>
                    </div>
                    <Badge className={`${statusColors[scan.status]} text-gray-900`}>{scan.status}</Badge>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-400">Time: {scan.time}</div>
                    <div className="flex space-x-2">
            <span className="flex items-center space-x-1">
              <AlertCircle className="w-4 h-4 text-red-500"/>
              <span className="text-red-500">{scan.vulnerabilities.critical}</span>
            </span>
                        <span className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-orange-500"/>
              <span className="text-orange-500">{scan.vulnerabilities.high}</span>
            </span>
                        <span className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-yellow-500"/>
              <span className="text-yellow-500">{scan.vulnerabilities.medium}</span>
            </span>
                        <span className="flex items-center space-x-1">
              <ShieldAlert className="w-4 h-4 text-blue-500"/>
              <span className="text-blue-500">{scan.vulnerabilities.low}</span>
            </span>
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button size="sm" variant="outline" disabled={scan.status !== "Paused"}>
                        <Play className="w-4 h-4 mr-1"/> Play
                    </Button>
                    <Button size="sm" variant="outline" disabled={scan.status !== "Active"}>
                        <Pause className="w-4 h-4 mr-1"/> Pause
                    </Button>
                    <Button size="sm" variant="outline"
                            disabled={scan.status === "Finished" || scan.status === "Failed"}>
                        <Square className="w-4 h-4 mr-1"/> Stop
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onInfo(scan)}>
                        <Info className="w-4 h-4 mr-1"/> Info
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

interface ScanInfoViewProps {
    scan: Scan;
    onClose: () => void;
}

function ScanInfoView({scan, onClose}: ScanInfoViewProps) {
    const severityColors = {
        Critical: "bg-red-500",
        High: "bg-orange-500",
        Medium: "bg-yellow-500",
        Low: "bg-blue-500",
    }
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">{scan.target} - Scan Details</h2>
                <Button variant="outline" size="sm" onClick={onClose}>
                    <X className="w-4 h-4 mr-2"/> Close
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Scan Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-2">
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Status:</dt>
                                <dd className="text-gray-200">{scan.status}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Duration:</dt>
                                <dd className="text-gray-200">{scan.time}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Start Time:</dt>
                                <dd className="text-gray-200">2023-07-15 09:00:00</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-400">End Time:</dt>
                                <dd className="text-gray-200">2023-07-15 11:15:00</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Vulnerabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-500 mr-2"/>
                                    <span className="text-gray-300">Critical</span>
                                </div>
                                <span className="font-bold text-red-500">{scan.vulnerabilities.critical}</span>
                            </div>
                            <Progress value={scan.vulnerabilities.critical} max={100} className="h-2 bg-gray-700"/>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-2"/>
                                    <span className="text-gray-300">High</span>
                                </div>
                                <span className="font-bold text-orange-500">{scan.vulnerabilities.high}</span>
                            </div>
                            <Progress value={scan.vulnerabilities.high} max={100} className="h-2 bg-gray-700"/>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 text-yellow-500 mr-2"/>
                                    <span className="text-gray-300">Medium</span>
                                </div>
                                <span className="font-bold text-yellow-500">{scan.vulnerabilities.medium}</span>
                            </div>
                            <Progress value={scan.vulnerabilities.medium} max={100} className="h-2 bg-gray-700"/>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <ShieldAlert className="w-5 h-5 text-blue-500 mr-2"/>
                                    <span className="text-gray-300">Low</span>
                                </div>
                                <span className="font-bold text-blue-500">{scan.vulnerabilities.low}</span>
                            </div>
                            <Progress value={scan.vulnerabilities.low} max={100} className="h-2 bg-gray-700"/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Detected Vulnerabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-gray-300">Severity</TableHead>
                                    <TableHead className="text-gray-300">Name</TableHead>
                                    <TableHead className="text-gray-300">Description</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scan.detectedVulnerabilities.map((vuln, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Badge
                                                className={`${severityColors[vuln.severity]} text-gray-900`}>{vuln.severity}</Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-300">{vuln.name}</TableCell>
                                        <TableCell className="text-gray-400">{vuln.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function ScansPage() {
    const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
    const [isSliding, setIsSliding] = useState(false)

    const scans: Scan[] = [
        {
            id: 1,
            target: "https://example.com",
            description: "Full network scan of main website",
            status: "Active",
            time: "00:45:30",
            vulnerabilities: { critical: 2, high: 5, medium: 10, low: 20 },
            detectedVulnerabilities: [
                {
                    severity: "Critical",
                    name: "SQL Injection",
                    description: "Potential SQL injection vulnerability in login form",
                },
                {
                    severity: "High",
                    name: "Cross-Site Scripting (XSS)",
                    description: "Reflected XSS vulnerability in search functionality",
                },
                {
                    severity: "Medium",
                    name: "Outdated Software",
                    description: "Web server running outdated version with known vulnerabilities",
                },
                {
                    severity: "Low",
                    name: "Missing HTTP Security Headers",
                    description: "Some recommended security headers are not set",
                },
            ],
        },
        {
            id: 2,
            target: "https://api.example.com",
            description: "API security audit",
            status: "Paused",
            time: "01:30:00",
            vulnerabilities: { critical: 0, high: 3, medium: 7, low: 15 },
            detectedVulnerabilities: [],
        },
        {
            id: 3,
            target: "192.168.1.0/24",
            description: "Internal network assessment",
            status: "Finished",
            time: "02:15:45",
            vulnerabilities: { critical: 1, high: 8, medium: 12, low: 25 },
            detectedVulnerabilities: [],
        },
        {
            id: 4,
            target: "https://dev.example.com",
            description: "Development server scan",
            status: "Failed",
            time: "00:05:30",
            vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
            detectedVulnerabilities: [],
        },
    ];

    const handleViewScanInfo = (scan: Scan) => {
        setSelectedScan(scan);
        setIsSliding(true);
    };

    const handleCloseInfo = () => {
        setIsSliding(false)
        setTimeout(() => setSelectedScan(null), 300) // Wait for the transition to complete
    }

    return (
        <div className="p-8 h-full overflow-hidden">
            <div
                className={`flex transition-transform duration-300 ease-in-out h-full ${isSliding ? "-translate-x-full" : "translate-x-0"}`}
            >
                <div className="w-full flex-shrink-0">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-100">Scans</h1>
                        <p className="text-gray-400">Overview of all security scans</p>
                    </header>
                    <div className="space-y-4">
                        {scans.map((scan) => (
                            <ScanItem key={scan.id} scan={scan} onInfo={handleViewScanInfo}/>
                        ))}
                    </div>
                </div>
                <div className="w-full flex-shrink-0">
                    {selectedScan && <ScanInfoView scan={selectedScan} onClose={handleCloseInfo}/>}
                </div>
            </div>
        </div>
    )
}

export default ScansPage;