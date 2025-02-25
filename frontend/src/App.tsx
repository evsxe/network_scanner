import { useState } from "react";
import TopBar from "components/nav/top-bar.tsx";
import SideMenu from "components/nav/side-menu.tsx";
import OverviewPage from "pages/overview.tsx";
import TargetsPage from "pages/targets.tsx";
import ScansPage from "pages/scans.tsx";
import LoginPage from "pages/login.tsx";
import VulnerabilitiesPage from "pages/vulnerabilities.tsx";
import ReportsPage from "pages/reports.tsx";
import ProfilePage from "pages/profile.tsx";

type Page = '' | 'overview' | 'targets' | 'scans' | 'vulnerabilities' | 'reports';

function App() {
    const [activePage, setActivePage] = useState<Page>('overview');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showProfile, setShowProfile] = useState<boolean>(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setActivePage('overview');
        setShowProfile(false);
    };

    const toggleProfile = () => {
        setShowProfile((prevState) => !prevState);
        if (!showProfile) {
            setActivePage('');
        }
    };

    const handlePageChange = (page: Page) => {
        setActivePage(page);
        setShowProfile(false);
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <TopBar onLogout={handleLogout} onProfileClick={toggleProfile} />
            <div className="flex flex-1">
                <SideMenu activePage={activePage} setActivePage={handlePageChange} />
                <div className="flex-1 overflow-auto">
                    {showProfile ? (
                        <ProfilePage onLogout={handleLogout} />
                    ) : (
                        <>
                            {activePage === 'overview' && <OverviewPage />}
                            {activePage === 'targets' && <TargetsPage />}
                            {activePage === 'scans' && <ScansPage />}
                            {activePage === 'vulnerabilities' && <VulnerabilitiesPage />}
                            {activePage === 'reports' && <ReportsPage />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;