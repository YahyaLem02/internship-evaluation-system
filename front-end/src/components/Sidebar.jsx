import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaGraduationCap, FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/stagiaires", label: "Stagiaires", icon: <FaGraduationCap /> }, // Changé de "Étudiants"
    { to: "/tuteurs", label: "Tuteurs", icon: <FaChalkboardTeacher /> },
    { to: "/stage-annee", label: "Stage Année", icon: <FaCalendarAlt /> },
    { to: "/profile", label: "Profil", icon: <FaUser /> },
    { to: "/settings", label: "Paramètres", icon: <FaCog /> },
];

export default function Sidebar() {
    const { pathname } = useLocation();
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
                <span className="text-3xl font-black bg-[#F5F7FA] text-[#41729F] rounded-full px-3 py-2 shadow-md">E</span>
                <span className="hidden md:block text-xl font-bold text-[#274472] tracking-wide">EvalStage</span>
            </div>
            {/* Navigation */}
            <nav className="flex-1 flex flex-col items-center md:items-stretch gap-2 mt-4 overflow-y-auto">
                {navLinks.map(link => {
                    const active = pathname.startsWith(link.to);
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
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    style={{ pointerEvents: "none" }}
                                />
                            )}
                            <span className={`
                                text-2xl z-10 transition-colors
                                ${active ? "text-[#41729F]" : "text-[#5885AF] group-hover:text-[#41729F]"}
                            `}>
                                {link.icon}
                            </span>
                            <span className={`
                                hidden md:inline z-10 whitespace-nowrap text-base font-medium ml-4 transition-colors
                                ${active ? "text-[#41729F] font-bold" : "text-[#274472] group-hover:text-[#5885AF]"}
                            `}>
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
            {/* Infos utilisateur */}
            <div className="hidden md:flex items-center px-3 py-2 mb-2 gap-2 border-t border-[#D4E1F5] pt-3">
                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#41729F] font-bold">
                    {/* Prendre les initiales de l'utilisateur */}
                    YL
                </div>
                <div className="flex-1 truncate">
                    <div className="font-medium text-[#274472] truncate">YahyaLem02</div>
                    <div className="text-xs text-[#5885AF]">{new Date().toISOString().split('T')[0]}</div>
                </div>
            </div>
            {/* Déconnexion */}
            <motion.button
                className="
                    flex items-center gap-2 mx-auto md:w-[85%] w-14 my-4 py-2 px-2 md:px-4 rounded-xl text-base transition
                    justify-center md:justify-start bg-white/80 hover:bg-[#FFEBEE] shadow text-[#D32F2F] font-semibold
                    border border-[#FFD1D1] hover:text-[#B71C1C]
                "
                whileHover={{ scale: 1.05, x: 2 }}
            >
                <FaSignOutAlt className="text-2xl" />
                <span className="hidden md:inline">Déconnexion</span>
            </motion.button>
        </aside>
    );
}