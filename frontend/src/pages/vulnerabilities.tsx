import {
    AlertCircle,
    AlertTriangle,
    Shield,
    ShieldAlert
} from "lucide-react";

import {
    Card,
    CardContent
} from "../components/ui/card.tsx";

import { Badge } from "../components/ui/badge.tsx";
import React from "react";

interface Vulnerability {
    id: number;
    name: string;
    severity: "Critical" | "High" | "Medium" | "Low";
    targetUrl: string;
    confidence: number;
}

interface VulnerabilityItemProps {
    vulnerability: Vulnerability;
}

const VulnerabilityItem: React.FC<VulnerabilityItemProps> = ({ vulnerability }) => {
    const severityColors: Record<Vulnerability["severity"], string> = {
        Critical: "bg-red-500",
        High: "bg-orange-500",
        Medium: "bg-yellow-500",
        Low: "bg-blue-500"
    };

    const severityIcons: Record<Vulnerability["severity"], JSX.Element> = {
        Critical: <AlertCircle className="w-5 h-5" />,
        High: <AlertTriangle className="w-5 h-5" />,
        Medium: <Shield className="w-5 h-5" />,
        Low: <ShieldAlert className="w-5 h-5" />
    };

    return (
        <Card className="bg-gray-800 border-gray-700 mb-4">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Badge
                                className={`${severityColors[vulnerability.severity]} text-gray-900 w-25 justify-start`}
                            >
                                <div className="flex items-center">
                                    {severityIcons[vulnerability.severity]}
                                    <span className="ml-2">{vulnerability.severity}</span>
                                </div>
                            </Badge>
                            <h3 className="text-lg font-semibold text-gray-100">{vulnerability.name}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{vulnerability.targetUrl}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                        Confidence: {vulnerability.confidence}%
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const VulnerabilitiesPage: React.FC = () => {
    const vulnerabilities: Vulnerability[] = [
        { id: 1, name: "SQL Injection", severity: "Critical", targetUrl: "https://example.com/login", confidence: 95 },
        { id: 2, name: "Cross-Site Scripting (XSS)", severity: "High", targetUrl: "https://example.com/search", confidence: 87 },
        { id: 3, name: "Outdated SSL Certificate", severity: "Medium", targetUrl: "https://api.example.com", confidence: 100 },
        { id: 4, name: "Weak Password Policy", severity: "Medium", targetUrl: "https://example.com", confidence: 75 },
        { id: 5, name: "Information Disclosure", severity: "Low", targetUrl: "https://dev.example.com", confidence: 60 },
        { id: 6, name: "Remote Code Execution", severity: "Critical", targetUrl: "https://example.com/admin", confidence: 92 },
        { id: 7, name: "Insecure Direct Object References", severity: "High", targetUrl: "https://api.example.com/users", confidence: 83 },
        { id: 8, name: "Cross-Site Request Forgery (CSRF)", severity: "Medium", targetUrl: "https://example.com/profile", confidence: 78 },
    ];

    const sortedVulnerabilities = [...vulnerabilities].sort((a, b) => {
        const severityOrder: Record<Vulnerability["severity"], number> = {
            Critical: 4,
            High: 3,
            Medium: 2,
            Low: 1
        };
        return severityOrder[b.severity] - severityOrder[a.severity];
    });

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Vulnerabilities</h1>
                <p className="text-gray-400">List of all detected vulnerabilities</p>
            </header>
            <div className="space-y-4">
                {sortedVulnerabilities.map(vulnerability => (
                    <VulnerabilityItem key={vulnerability.id} vulnerability={vulnerability} />
                ))}
            </div>
        </div>
    );
};

export default VulnerabilitiesPage;
