import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet, useLocation } from "react-router-dom";

const TITLES = {
    "/dashboard": "Tableau de bord",
    "/profile": "Mon Profil",
    "/settings": "Paramètres",
    "/stagiaires": "Gestion des Stagiaires",
    "/tuteurs": "Gestion des Tuteurs",
    "/stage-annee": "Années de Stage",
};

export default function DashboardLayout() {
    const { pathname } = useLocation();
    const title = TITLES[pathname] || pathname.split('/')[1].charAt(0).toUpperCase() + pathname.split('/')[1].slice(1);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#C3CFE2] to-[#B7C9E2]">
            <Sidebar />
            <main className="flex-1 ml-24 md:ml-64 px-4 md:px-10 py-4">
                <Header title={title} />
                <Outlet />
            </main>
        </div>
    );
}