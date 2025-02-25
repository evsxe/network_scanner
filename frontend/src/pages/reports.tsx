import {
    AlertCircle,
    AlertTriangle,
    FileText,
    Shield,
    ShieldAlert
} from "lucide-react";

import {
    Card,
    CardContent
} from "../components/ui/card";

import {
    Button
} from "../components/ui/button";

interface Vulnerabilities {
    critical: number;
    high: number;
    medium: number;
    low: number;
}

interface Report {
    id: number;
    name: string;
    target: string;
    description: string;
    vulnerabilities: Vulnerabilities;
}

interface ReportItemProps {
    report: Report;
}

function ReportItem({ report }: ReportItemProps) {
    return (
        <Card className="bg-gray-800 border-gray-700 mb-4">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-100">{report.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{report.target}</p>
                        <p className="text-sm text-gray-400 mt-2">{report.description}</p>
                    </div>
                    <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1"/> View
                    </Button>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
            <span className="flex items-center space-x-1">
              <AlertCircle className="w-4 h-4 text-red-500"/>
              <span className="text-red-500">{report.vulnerabilities.critical}</span>
            </span>
                        <span className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-orange-500"/>
              <span className="text-orange-500">{report.vulnerabilities.high}</span>
            </span>
                        <span className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-yellow-500"/>
              <span className="text-yellow-500">{report.vulnerabilities.medium}</span>
            </span>
                        <span className="flex items-center space-x-1">
              <ShieldAlert className="w-4 h-4 text-blue-500"/>
              <span className="text-blue-500">{report.vulnerabilities.low}</span>
            </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function ReportsPage() {
    const reports = [
        {
            id: 1,
            name: "Q3 2023 Security Assessment",
            target: "https://example.com",
            description: "Comprehensive security audit of the main website",
            vulnerabilities: {critical: 2, high: 5, medium: 10, low: 20}
        },
        {
            id: 2,
            name: "API Security Review",
            target: "https://api.example.com",
            description: "In-depth analysis of API endpoints and authentication mechanisms",
            vulnerabilities: {critical: 1, high: 3, medium: 7, low: 15}
        },
        {
            id: 3,
            name: "Internal Network Vulnerability Assessment",
            target: "192.168.1.0/24",
            description: "Evaluation of internal network security posture",
            vulnerabilities: {critical: 0, high: 8, medium: 12, low: 25}
        },
        {
            id: 4,
            name: "Development Environment Security Audit",
            target: "https://dev.example.com",
            description: "Security review of development and staging environments",
            vulnerabilities: {critical: 3, high: 6, medium: 9, low: 18}
        }
    ]

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Reports</h1>
                <p className="text-gray-400">List of all security assessment reports</p>
            </header>
            <div className="space-y-4">
                {reports.map(report => (
                    <ReportItem key={report.id} report={report}/>
                ))}
            </div>
        </div>
    )
}

export default ReportsPage;