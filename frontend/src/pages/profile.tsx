import { useState } from 'react'
import { Button } from "../components/ui/button.tsx"
import { Input } from "../components/ui/input.tsx"
import { Label } from "../components/ui/label.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx"
import { User, Mail, Key, Globe, Shield, LogOut } from 'lucide-react'

interface UserProfile {
    name: string;
    email: string;
    role: string;
    lastLogin: string;
    apiKey: string;
}

interface ProfilePageProps {
    onLogout: () => void;
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
    const [user, setUser] = useState<UserProfile>({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Security Analyst',
        lastLogin: '2023-11-17 15:30',
        apiKey: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    })

    const [isEditing, setIsEditing] = useState(false)

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        setIsEditing(false)
        // Here you would typically send the updated user data to your backend
    }

    return (
        <div className="p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">User Profile</h1>
                    <p className="text-gray-400">Manage your account settings and view your API key</p>
                </div>
                <Button onClick={onLogout} className="text-white flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </Button>
            </header>

            <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center text-gray-100">
                        <User className="mr-2" /> Profile Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-400">Name</Label>
                        <div className="flex items-center">
                            <User className="w-5 h-5 mr-2 text-gray-500" />
                            <Input
                                id="name"
                                value={user.name}
                                readOnly={!isEditing}
                                onChange={(e) => setUser({...user, name: e.target.value})}
                                className="flex-grow bg-gray-700 text-gray-100 border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-400">Email</Label>
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-gray-500" />
                            <Input
                                id="email"
                                value={user.email}
                                readOnly={!isEditing}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                className="flex-grow bg-gray-700 text-gray-100 border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium text-gray-400">Role</Label>
                        <div className="flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-gray-500" />
                            <Input
                                id="role"
                                value={user.role}
                                readOnly
                                className="flex-grow bg-gray-700 text-gray-100 border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastLogin" className="text-sm font-medium text-gray-400">Last Login</Label>
                        <div className="flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-gray-500" />
                            <Input
                                id="lastLogin"
                                value={user.lastLogin}
                                readOnly
                                className="flex-grow bg-gray-700 text-gray-100 border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="apiKey" className="text-sm font-medium text-gray-400">API Key</Label>
                        <div className="flex items-center">
                            <Key className="w-5 h-5 mr-2 text-gray-500" />
                            <Input
                                id="apiKey"
                                value={user.apiKey}
                                readOnly
                                type="password"
                                className="flex-grow bg-gray-700 text-gray-100 border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        {isEditing ? (
                            <Button onClick={handleSave} className="text-white">
                                Save Changes
                            </Button>
                        ) : (
                            <Button onClick={handleEdit} className="text-white">
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}