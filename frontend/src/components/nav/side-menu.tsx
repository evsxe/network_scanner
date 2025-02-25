import {
    LayoutDashboard,
    Crosshair,
    Scan,
    BarChart3,
    FileBarChart,
} from 'lucide-react';

type PageName = 'overview' | 'targets' | 'scans' | 'vulnerabilities' | 'reports';

interface SideMenuProps {
    activePage: PageName;
    setActivePage: (page: PageName) => void;
}

function SideMenu({activePage, setActivePage}: SideMenuProps): JSX.Element {
    return (
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-4">
            <button
                className={`p-2 rounded-lg ${
                    activePage === 'overview' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                } transition-colors`}
                onClick={() => setActivePage('overview')}
            >
                <LayoutDashboard className="w-6 h-6"/>
            </button>
            <button
                className={`p-2 rounded-lg ${
                    activePage === 'targets' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                } transition-colors`}
                onClick={() => setActivePage('targets')}
            >
                <Crosshair className="w-6 h-6"/>
            </button>
            <button
                className={`p-2 rounded-lg ${
                    activePage === 'scans' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                } transition-colors`}
                onClick={() => setActivePage('scans')}
            >
                <Scan className="w-6 h-6"/>
            </button>
            <button
                className={`p-2 rounded-lg ${
                    activePage === 'vulnerabilities' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                } transition-colors`}
                onClick={() => setActivePage('vulnerabilities')}
            >
                <BarChart3 className="w-6 h-6"/>
            </button>
            <button
                className={`p-2 rounded-lg ${
                    activePage === 'reports' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                } transition-colors`}
                onClick={() => setActivePage('reports')}
            >
                <FileBarChart className="w-6 h-6"/>
            </button>
        </div>
    );
}

export default SideMenu;
