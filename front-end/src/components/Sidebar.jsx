import { Link, useLocation } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaGraduationCap, FaChalkboardTeacher, FaCalendarAlt, FaUserShield, FaClipboardCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

export default function Sidebar() {
    const { pathname } = useLocation();
    const [userRole, setUserRole] = useState(null);
    const [userInfo, setUserInfo] = useState({ nom: "", prenom: "" });
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        // Récupérer la date actuelle et la formater
        const now = new Date();
        const formattedDate = now.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        setCurrentDate(formattedDate);

        // Récupérer les informations utilisateur
        try {
            const user = AuthService.getCurrentUser();

            if (user) {
                console.log("Informations utilisateur récupérées du localStorage:", user);

                // Configurer le token pour toutes les requêtes axios
                if (user.token) {
                    console.log("Token trouvé et configuré");
                }

                // Définir les informations utilisateur
                setUserRole(user.role);
                setUserInfo({
                    nom: user.nom || "",
                    prenom: user.prenom || ""
                });

                // Vérifier si l'utilisateur est un superAdmin
                setIsSuperAdmin(user.superAdmin === true);
            } else {
                console.log("Aucun utilisateur trouvé dans le localStorage");
                window.location.href = '/login';
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des infos utilisateur:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Définir les liens en fonction du rôle et des permissions de l'utilisateur
    const getNavLinks = () => {
        // Liens de base pour tous les admins
        if (userRole === "ADMIN") {
            const adminLinks = [
                { to: "/dashboard", label: "Dashboard", icon: <FaGraduationCap /> },
                { to: "/profile", label: "Profil", icon: <FaUser /> },
                { to: "/stage-annee", label: "Années universitaires", icon: <FaCalendarAlt /> },                { to: "/stagiaires", label: "Stagiaires", icon: <FaGraduationCap /> },
                { to: "/tuteurs", label: "Tuteurs", icon: <FaChalkboardTeacher /> },
            ];

            // Ajouter l'option "Créer Admin" seulement si l'utilisateur est superAdmin
            if (isSuperAdmin) {
                adminLinks.push({ to: "/admin/create", label: "Gestion des admins", icon: <FaUserShield /> });
            }

            // Ajouter paramètres à la fin pour tous les admins
            adminLinks.push({ to: "/settings", label: "Paramètres", icon: <FaCog /> });

            return adminLinks;
        }

        // Liens pour les stagiaires
        else if (userRole === "STAGIAIRE") {
            return [
                { to: "/student-dashboard", label: "Mon stage", icon: <FaClipboardCheck /> },
                { to: "/profile", label: "Profil", icon: <FaUser /> },
                { to: "/settings", label: "Paramètres", icon: <FaCog /> }
            ];
        }

        // Retourner un tableau vide si aucun rôle correspondant
        return [];
    };

    const navLinks = getNavLinks();

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = '/';
    };

    const getInitials = () => {
        if (userInfo.nom && userInfo.prenom) {
            return (userInfo.nom[0] + userInfo.prenom[0]).toUpperCase();
        }
        return "?";
    };

    return (
        <aside className="
            fixed left-0 top-0 h-screen w-20 md:w-60
            bg-white/70 backdrop-blur-2xl shadow-xl
            flex flex-col rounded-2xl m-4
            transition-all duration-300
            border border-[#D4E1F5]
            z-50
        ">
            {/* Logo */}
            <div className="flex items-center justify-center md:justify-start gap-3 p-5">
                <div className="relative">
                    <div className="w-12 h-12 relative overflow-hidden rounded-xl shadow-lg">
                        {/* Arrière-plan avec effet de superposition */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#41729F] to-[#274472]"></div>

                        {/* Icône d'évaluation/checklist */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path d="M8 2v4"></path>
                                <path d="M16 2v4"></path>
                                <rect x="2" y="6" width="20" height="16" rx="2"></rect>
                                <path d="M9 14l2 2 4-4"></path>
                            </svg>
                        </div>

                        {/* Éléments décoratifs */}
                        <div
                            className="absolute top-0 right-0 w-6 h-6 bg-white/10 rounded-full transform translate-x-2 -translate-y-2"></div>
                        <div
                            className="absolute bottom-0 left-0 w-4 h-4 bg-white/10 rounded-full transform -translate-x-1 translate-y-1"></div>
                    </div>
                </div>

                <div className="hidden md:flex flex-col">
                    <span
                        className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#274472] to-[#41729F] tracking-wide leading-tight">EvalStage</span>
                    <span className="text-xs text-[#5885AF] font-medium tracking-wide">Gestion des stages</span>
                </div>
            </div>

            {/* Navigation */}
            {loading ? (
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#41729F]"></div>
                </div>
            ) : (
                <nav className="flex-1 flex flex-col items-center md:items-stretch gap-2 mt-4 px-3 overflow-y-auto">
                    {navLinks.map(link => {
                        const active = pathname === link.to ||
                            (link.to !== '/dashboard' && pathname.startsWith(link.to));
                        return (
                            <Link
                                to={link.to}
                                key={link.to}
                                className="relative flex items-center md:gap-4 gap-0 px-0 md:px-3 py-2 my-1 group focus:outline-none rounded-xl overflow-hidden"
                                tabIndex={0}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-[#B7C9E2] rounded-xl"
                                        transition={{type: "spring", stiffness: 500, damping: 30}}
                                        style={{pointerEvents: "none"}}
                                    />
                                )}
                                <span className={`
                                    text-2xl z-10 transition-colors flex justify-center md:justify-start w-full md:w-auto
                                    ${active ? "text-[#41729F]" : "text-[#5885AF] group-hover:text-[#41729F]"}
                                `}>
                                    {link.icon}
                                </span>
                                <span className={`
                                    hidden md:inline z-10 whitespace-nowrap text-base font-medium transition-colors
                                    ${active ? "text-[#41729F] font-bold" : "text-[#274472] group-hover:text-[#5885AF]"}
                                `}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            )}

            {/* Infos utilisateur */}
            <div className="hidden md:flex items-center px-3 py-2 mb-2 gap-2 border-t border-[#D4E1F5] pt-3">
                <div
                    className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#41729F] font-bold">
                    {getInitials()}
                </div>
                <div className="flex-1 truncate">
                    <div className="font-medium text-[#274472] truncate">
                        {userInfo.nom} {userInfo.prenom}
                    </div>
                    <div className="text-xs text-[#5885AF]">
                        {userRole === "ADMIN" ? (isSuperAdmin ? "Super Admin" : "Administrateur") : "Stagiaire"}
                    </div>
                </div>
            </div>

            {/* Version mobile de l'avatar (visible uniquement sur petit écran) */}
            <div className="md:hidden flex justify-center mb-2 pt-3 border-t border-[#D4E1F5]">
                <div
                    className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#41729F] font-bold">
                    {getInitials()}
                </div>
            </div>

            {/* Déconnexion */}
            <motion.button
                className="
                    flex items-center gap-2 mx-auto md:w-[85%] w-14 my-4 py-2 px-2 md:px-4 rounded-xl text-base transition
                    justify-center md:justify-start bg-white/80 hover:bg-[#FFEBEE] shadow text-[#D32F2F] font-semibold
                    border border-[#FFD1D1] hover:text-[#B71C1C]
                "
                whileHover={{scale: 1.05, x: 2}}
                onClick={handleLogout}
            >
                <FaSignOutAlt className="text-2xl"/>
                <span className="hidden md:inline">Déconnexion</span>
            </motion.button>
        </aside>
    );
}