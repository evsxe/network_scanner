import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Info,
    Loader2,
    Shield,
    ShieldAlert
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../components/ui/card.tsx";

import {Progress} from "../components/ui/progress.tsx";

type Vulnerabilities = {
    critical: number;
    high: number;
    medium: number;
    low: number;
    misc: number;
};

type Scan = {
    id: number;
    target: string;
    description: string;
};

type Alert = {
    id: number;
    type: "Critical" | "High" | "Medium" | "Low";
    description: string;
};

function OverviewPage() {
    const vulnerabilities: Vulnerabilities = {
        critical: 5,
        high: 12,
        medium: 28,
        low: 45,
        misc: 8,
    };

    const activeScans: Scan[] = [
        {id: 1, target: "https://example.com", description: "Full network scan"},
        {id: 2, target: "https://api.example.com", description: "API security audit"},
        {id: 3, target: "192.168.1.0/24", description: "Internal network assessment"},
    ];

    const latestAlerts: Alert[] = [
        {id: 1, type: "Critical", description: "SQL Injection vulnerability detected"},
        {id: 2, type: "High", description: "Outdated SSL certificate"},
        {id: 3, type: "Medium", description: "Weak password policy"},
        {id: 4, type: "Low", description: "Information disclosure in HTTP headers"},
    ];

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-200">Overview</h1>
                <p className="text-gray-400">Real-time overview of your security landscape</p>
            </header>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Vulnerability Overview</CardTitle>
                        <CardDescription className="text-gray-400">Total vulnerabilities detected</CardDescription>
                    </CardHeader>
                    <CardContent className='overview-card-content'>
                        <div className="space-y-4">
                            {Object.entries(vulnerabilities).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {key === "critical" && <AlertCircle className="w-5 h-5 text-red-500 mr-2"/>}
                                            {key === "high" &&
                                                <AlertTriangle className="w-5 h-5 text-orange-500 mr-2"/>}
                                            {key === "medium" && <Shield className="w-5 h-5 text-yellow-500 mr-2"/>}
                                            {key === "low" && <ShieldAlert className="w-5 h-5 text-blue-500 mr-2"/>}
                                            {key === "misc" && <Info className="w-5 h-5 text-gray-400 mr-2"/>}
                                            <span className="text-gray-300 capitalize">{key}</span>
                                        </div>
                                        <span className="font-bold text-gray-400">{value}</span>
                                    </div>
                                    <Progress value={value} max={100} className="h-2 bg-gray-700"
                                              indicatorClassName={
                                                  key === "critical" ? "bg-red-500" :
                                                      key === "high" ? "bg-orange-500" :
                                                          key === "medium" ? "bg-yellow-500" :
                                                              key === "low" ? "bg-blue-500" : "bg-gray-400"
                                              }/>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Active Scans</CardTitle>
                        <CardDescription className="text-gray-400">Currently running security scans</CardDescription>
                    </CardHeader>
                    <CardContent className='overview-card-content'>
                        <ul className="space-y-4">
                            {activeScans.map((scan) => (
                                <li key={scan.id} className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-200">{scan.target}</span>
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-400"/>
                                    </div>
                                    <p className="text-sm text-gray-400">{scan.description}</p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Latest Alerts</CardTitle>
                        <CardDescription className="text-gray-400">Recent security notifications</CardDescription>
                    </CardHeader>
                    <CardContent className='overview-card-content'>
                        <ul className="space-y-4">
                            {latestAlerts.map((alert) => (
                                <li key={alert.id} className="flex items-start space-x-3">
                                    {alert.type === "Critical" &&
                                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5"/>}
                                    {alert.type === "High" &&
                                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5"/>}
                                    {alert.type === "Medium" && <Shield className="w-5 h-5 text-yellow-500 mt-0.5"/>}
                                    {alert.type === "Low" && <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5"/>}
                                    <div>
                                        <p className="font-semibold text-gray-200">{alert.type}</p>
                                        <p className="text-sm text-gray-400">{alert.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default OverviewPage;
