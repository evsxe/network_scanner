import { User, Search } from 'lucide-react';

interface TopBarProps {
    onProfileClick: () => void;
}

function TopBar({ onProfileClick }: TopBarProps): JSX.Element {
    return (
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center">
                <Search className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold text-gray-100">Scanner1726</span>
            </div>
            <button
                className="p-2 rounded-full bg-gray-700 text-gray-300 hover:text-gray-100 flex items-center justify-center"
                onClick={onProfileClick}
            >
                <User className="w-5 h-5" />
            </button>
        </div>
    );
}

export default TopBar;

