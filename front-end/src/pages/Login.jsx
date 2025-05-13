import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const imageUrl =
    "https://img.freepik.com/vecteurs-libre/illustration-emploi-stage_23-2148718493.jpg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Effectuer la connexion
            const response = await AuthService.login(email, password);

            // Récupérer les informations de l'utilisateur connecté
            const user = AuthService.getCurrentUser();

            // Rediriger en fonction du rôle
            if (user && user.role === "STAGIAIRE") {
                // Rediriger les stagiaires vers la page "Mon stage"
                navigate("/student-dashboard");
            } else {
                // Rediriger les administrateurs vers le dashboard par défaut
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Erreur de connexion:", err);
            setError(
                err.response?.data?.message ||
                "Échec de la connexion. Vérifiez vos identifiants."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#C3CFE2]">
            <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#D4E1F5] items-stretch">
                {/* Formulaire - à gauche */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, type: "spring" }}
                    className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#274472] mb-2 drop-shadow">
                        Bienvenue sur EvalStage
                    </h2>
                    <p className="text-[#41729F] mb-8 text-base">
                        Connectez-vous pour accéder à votre espace de suivi de stages.
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5885AF] text-xl" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-[#B7C9E2] focus:ring-2 focus:ring-[#41729F] focus:outline-none transition text-[#274472] shadow-sm"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5885AF] text-xl" />
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-[#B7C9E2] focus:ring-2 focus:ring-[#41729F] focus:outline-none transition text-[#274472] shadow-sm"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <motion.button
                            whileHover={{
                                backgroundColor: "#5885AF",
                                color: "#fff",
                                scale: 1.03,
                            }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="w-full py-3 rounded-lg bg-[#41729F] text-white text-lg font-semibold transition-all duration-200"
                            disabled={loading}
                        >
                            {loading ? "Connexion en cours..." : "Se connecter"}
                        </motion.button>
                    </form>
                    <div className="mt-6 text-center text-[#5885AF] text-sm">
                        Pas encore de compte ?{" "}
                        <a href="#" className="text-[#009688] hover:underline">
                            Contactez l'administration
                        </a>
                    </div>
                </motion.div>
                {/* Image - à droite */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, type: "spring", delay: 0.1 }}
                    className="hidden md:flex w-1/2 items-stretch justify-center bg-gradient-to-tr from-[#F5F7FA] via-[#C3CFE2] to-[#B7C9E2]"
                >
                    <img
                        src={imageUrl}
                        alt="Illustration emploi stage"
                        className="object-cover w-full h-full"
                        style={{
                            minHeight: "100%",
                            height: "100%",
                            width: "100%",
                            display: "block",
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
}