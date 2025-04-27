import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet, useLocation } from "react-router-dom";

// Optionnel : mapping des titres selon la page
const TITLES = {
    "/dashboard": "Tableau de bord",
    "/profile": "Mon Profil",
    "/settings": "Paramètres",
};

export default function DashboardLayout() {
    const { pathname } = useLocation();
    // Détermine le titre selon la route courante
    const title = TITLES[pathname] || "Dashboard";

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#C3CFE2] to-[#B7C9E2]">
            <Sidebar />
            <main className="flex-1 px-4 md:px-10 py-4">
                <Header title={title} />
                <Outlet />
            </main>
        </div>
    );
}