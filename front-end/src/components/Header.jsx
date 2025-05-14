import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaSignOutAlt, FaCog, FaUser, FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import AuthService from "../services/AuthService";

export default function Header({ title = "Dashboard" }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [userInfo, setUserInfo] = useState({
        nom: "",
        prenom: "",
        role: "",
        isSuperAdmin: false
    });

    useEffect(() => {
        // Mettre à jour la date et l'heure toutes les minutes
        const updateDateTime = () => {
            const now = new Date();

            // Format de date et heure
            const formattedDate = now.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            // Première lettre en majuscule
            const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

            // Heure au format 24h
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const timeString = `${hours}:${minutes}`;

            setCurrentDateTime(`${capitalizedDate} - ${timeString}`);
        };

        // Appeler immédiatement et configurer l'intervalle
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 60000);

        // Récupérer les informations utilisateur
        try {
            const user = AuthService.getCurrentUser();
            if (user) {
                setUserInfo({
                    nom: user.nom || "",
                    prenom: user.prenom || "",
                    role: user.role || "",
                    isSuperAdmin: user.superAdmin === true
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des infos utilisateur:", error);
        }

        // Nettoyer l'intervalle
        return () => clearInterval(intervalId);
    }, []);

    const getInitials = () => {
        if (userInfo.nom && userInfo.prenom) {
            return (userInfo.nom[0] + userInfo.prenom[0]).toUpperCase();
        }
        return "?";
    };

    const getRoleDisplay = () => {
        if (userInfo.role === "ADMIN") {
            return userInfo.isSuperAdmin ? "Super Admin" : "Administrateur";
        } else if (userInfo.role === "STAGIAIRE") {
            return "Stagiaire";
        }
        return userInfo.role || "Utilisateur";
    };

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = '/login';
    };

    return (
        <header
            className="
                sticky top-0 z-20
                flex items-center justify-between
                px-6 py-3 mb-6
                bg-white/70 backdrop-blur-xl
                rounded-2xl shadow
                mx-2 mt-4
                transition-all duration-300
                border border-[#D4E1F5]
            "
            style={{
                boxShadow: "0 4px 24px 0 #41729F12",
            }}
        >
            <div className="flex items-center">
                <h2 className="text-2xl font-bold text-[#41729F] tracking-tight">{title}</h2>
                <div className="hidden md:flex items-center ml-6 text-[#5885AF] text-sm">
                    <FaCalendarAlt className="mr-2" />
                    {currentDateTime}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Barre de recherche */}


                {/* Information utilisateur connecté (version desktop) */}
                <div className="hidden md:flex items-center">
                    <div className="text-right mr-3">
                        <div className="font-medium text-[#274472]">
                            {userInfo.prenom} {userInfo.nom}
                        </div>
                        <div className="text-xs text-[#5885AF]">
                            {getRoleDisplay()}
                        </div>
                    </div>

                    {/* Avatar et menu déroulant */}
                    <div className="relative">
                        <button
                            className="flex items-center"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#41729F] font-bold shadow-md">
                                {getInitials()}
                            </div>
                            <FaChevronDown className={`ml-1 text-[#5885AF] transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Menu déroulant utilisateur */}
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-30 border border-[#D4E1F5]"
                            >
                                <ul>
                                    <li>
                                        <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-[#F5F7FA] text-sm text-[#274472]">
                                            <FaUser className="mr-3 text-[#5885AF]" />
                                            Profil
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-[#F5F7FA] text-sm text-[#274472]">
                                            <FaCog className="mr-3 text-[#5885AF]" />
                                            Paramètres
                                        </Link>
                                    </li>
                                    <li className="border-t border-[#D4E1F5] mt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center px-4 py-2 hover:bg-[#FFEBEE] text-sm text-[#D32F2F]"
                                        >
                                            <FaSignOutAlt className="mr-3" />
                                            Déconnexion
                                        </button>
                                    </li>
                                </ul>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Avatar uniquement (version mobile) */}
                <div className="md:hidden relative">
                    <button
                        className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#41729F] font-bold shadow-md"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        {getInitials()}
                    </button>

                    {/* Menu déroulant utilisateur mobile */}
                    {showUserMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-30 border border-[#D4E1F5]"
                        >
                            <div className="px-4 py-2 border-b border-[#D4E1F5] mb-1">
                                <div className="font-medium text-[#274472]">{userInfo.prenom} {userInfo.nom}</div>
                                <div className="text-xs text-[#5885AF]">{getRoleDisplay()}</div>
                            </div>
                            <ul>
                                <li>
                                    <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-[#F5F7FA] text-sm text-[#274472]">
                                        <FaUser className="mr-3 text-[#5885AF]" />
                                        Profil
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-[#F5F7FA] text-sm text-[#274472]">
                                        <FaCog className="mr-3 text-[#5885AF]" />
                                        Paramètres
                                    </Link>
                                </li>
                                <li className="border-t border-[#D4E1F5] mt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center px-4 py-2 hover:bg-[#FFEBEE] text-sm text-[#D32F2F]"
                                    >
                                        <FaSignOutAlt className="mr-3" />
                                        Déconnexion
                                    </button>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </div>
            </div>
        </header>
    );
}