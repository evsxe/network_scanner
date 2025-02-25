import React, { useState, useEffect } from "react";
import {
    Plus,
    AlertCircle,
    AlertTriangle,
    Rocket,
    Shield,
    ShieldAlert,
    Trash2,
    Crosshair,
} from "lucide-react";

import {Card, CardContent} from "../components/ui/card.tsx";
import {Label} from "../components/ui/label.tsx";
import {Input} from "../components/ui/input.tsx";
import {Button} from "../components/ui/button.tsx";

interface Vulnerabilities {
    critical: number;
    high: number;
    medium: number;
    low: number;
}

interface Target {
    id: number;
    url: string;
    description: string;
    vulnerabilities: Vulnerabilities;
}

interface TargetItemProps {
    target: Target;
    onDelete: (id: number) => void;
    onScan: (target: Target) => void;
}

const TargetItem: React.FC<TargetItemProps> = ({target, onDelete, onScan}) => {
    return (
        <Card className="bg-gray-800 border-gray-700 mb-4">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-100">{target.url}</h3>
                        <p className="text-sm text-gray-400">{target.description}</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onScan(target)}>
                            <Rocket className="w-4 h-4 mr-1"/> Scan
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onDelete(target.id)}>
                            <Trash2 className="w-4 h-4 mr-1"/> Delete
                        </Button>
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <span className="flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4 text-red-500"/>
                            <span className="text-red-500">{target.vulnerabilities.critical}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <AlertTriangle className="w-4 h-4 text-orange-500"/>
                            <span className="text-orange-500">{target.vulnerabilities.high}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Shield className="w-4 h-4 text-yellow-500"/>
                            <span className="text-yellow-500">{target.vulnerabilities.medium}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <ShieldAlert className="w-4 h-4 text-blue-500"/>
                            <span className="text-blue-500">{target.vulnerabilities.low}</span>
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface AddTargetFormProps {
    onAdd: (target: Omit<Target, "id" | "vulnerabilities">) => void;
    onCancel: () => void;
}

const AddTargetForm: React.FC<AddTargetFormProps> = ({onAdd, onCancel}) => {
    const [url, setUrl] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onAdd({url, description});
        setUrl("");
        setDescription("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700 mb-4">
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <Label htmlFor="url" className="text-gray-200">
                            Network Address
                        </Label>
                        <Input
                            id="url"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="bg-gray-700 text-gray-200 border-gray-600"
                        />
                    </div>
                    <div className="flex flex-col">
                        <Label htmlFor="description" className="text-gray-200">
                            Description
                        </Label>
                        <Input
                            id="description"
                            placeholder="Development server"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-gray-700 text-gray-200 border-gray-600"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="black">Add Network</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

const TargetsPage: React.FC = () => {
    const [targets, setTargets] = useState<Target[]>([]);
    const [isAddingTarget, setIsAddingTarget] = useState<boolean>(false);

    const handleAddTarget = (newTarget: Omit<Target, "id" | "vulnerabilities">) => {
        setTargets([
            ...targets,
            {...newTarget, id: Date.now(), vulnerabilities: {critical: 0, high: 0, medium: 0, low: 0}},
        ]);
        setIsAddingTarget(false);
    };

    const handleDeleteTarget = (id: number) => {
        setTargets(targets.filter((target) => target.id !== id));
    };

    const handleScanTarget = (target: Target) => {
        console.log("Scanning target:", target);
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Targets</h1>
                <p className="text-gray-400">List of all scanning targets</p>
            </header>
            {targets.length === 0 && !isAddingTarget ? (
                <Card className="bg-gray-800 border-gray-700 mb-4">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Crosshair className="w-12 h-12 text-gray-400 mb-4"/>
                        <p className="text-xl text-gray-300 mb-4">No known networks</p>
                        <Button onClick={() => setIsAddingTarget(true)} variant="black">
                            <Plus className="w-4 h-4 mr-2"/> Add Network
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {isAddingTarget ? (
                        <AddTargetForm onAdd={handleAddTarget} onCancel={() => setIsAddingTarget(false)}/>
                    ) : (
                        <Button onClick={() => setIsAddingTarget(true)} variant="black">
                            <Plus className="w-4 h-4 mr-2"/> Add Network
                        </Button>
                    )}
                    {targets.map((target) => (
                        <TargetItem key={target.id} target={target} onDelete={handleDeleteTarget}
                                    onScan={handleScanTarget}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TargetsPage;