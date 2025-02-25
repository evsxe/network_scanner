import React, {useState} from "react";
import {Search} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Input} from "../components/ui/input.tsx";
import {Button} from "../components/ui/button.tsx";

interface LoginPageProps {
    onLogin: () => void;
}

export function LoginPage({onLogin}: LoginPageProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Card className="w-[350px] bg-gray-800 border-gray-700">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <Search className="w-10 h-10 text-blue-400"/>
                    </div>
                    <CardTitle className="text-2xl text-center font-bold text-gray-100">Login</CardTitle>
                    <CardDescription className="text-gray-400 text-center">
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Input
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                            />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                            />
                            <Button className="w-full mt-4 text-white" type="submit">
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginPage;
