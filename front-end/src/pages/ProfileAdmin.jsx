import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importation correcte de useNavigate
import { motion } from "framer-motion";
import { FaEnvelope, FaUser, FaPhone, FaEdit, FaLock, FaSpinner, FaCheck, FaExclamationTriangle, FaUserCircle, FaShieldAlt } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../api";
import AuthService from "../services/AuthService";

export default function ProfileAdmin() {
    const navigate = useNavigate(); // Utilisation du hook après son importation correcte
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // État pour le formulaire d'édition
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
    });

    // État pour le changement de mot de passe
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        // Vérifier si l'utilisateur est connecté et s'il est admin
        if (currentUser && currentUser.role === "ADMIN") {
            fetchUserData(currentUser);
        } else {
            // Rediriger vers la page de connexion ou d'accueil si l'utilisateur n'est pas admin
            setError("Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.");
            setTimeout(() => {
                navigate('/'); // Redirection vers la page d'accueil
            }, 2000);
        }
    }, [navigate]);

    // Le reste du code reste inchangé

    // ... (code existant inchangé)

    const fetchUserData = async (currentUser) => {
        try {
            setLoading(true);

            // Récupérer les informations de l'administrateur
            const response = await axios.get(`${API_URL}/api/admin/${currentUser.userId}`);

            // Adapter les données pour l'affichage
            const userData = {
                ...response.data,
                role: "Administrateur",
            };

            setUser(userData);

            // Initialiser le formulaire avec les données utilisateur
            setFormData({
                nom: userData.nom || "",
                prenom: userData.prenom || "",
                email: userData.email || "",
            });

            setLoading(false);
        } catch (err) {
            console.error("Erreur lors de la récupération des données administrateur:", err);
            setError("Impossible de charger les données administrateur");
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
        setPasswordMode(false);
        setError("");
        setSuccess("");
    };

    const handlePasswordToggle = () => {
        setPasswordMode(!passwordMode);
        setEditMode(false);
        setError("");
        setSuccess("");
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const currentUser = AuthService.getCurrentUser();

            // Mettre à jour le profil administrateur
            await axios.put(`${API_URL}/api/admin/${currentUser.userId}`, formData);

            // Mettre à jour les données utilisateur après la modification
            fetchUserData(currentUser);

            setSuccess("Profil administrateur mis à jour avec succès");
            setEditMode(false);
        } catch (err) {
            console.error("Erreur lors de la mise à jour du profil:", err);
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du profil");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");

        // Vérification des mots de passe
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setSubmitting(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            setSubmitting(false);
            return;
        }

        try {
            const currentUser = AuthService.getCurrentUser();

            await axios.post(`${API_URL}/api/admin/${currentUser.userId}/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setSuccess("Mot de passe administrateur modifié avec succès");
            setPasswordMode(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            console.error("Erreur lors du changement de mot de passe:", err);
            setError(err.response?.data?.message || "Erreur lors du changement de mot de passe");
        } finally {
            setSubmitting(false);
        }
    };

    // Si l'utilisateur n'est pas administrateur, afficher un message d'erreur
    if (error && error.includes("Accès non autorisé")) {
        return (
            <div className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
                >
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-red-500 mr-2" />
                        <p>{error}</p>
                    </div>
                    <p className="mt-2 text-sm">Redirection en cours...</p>
                </motion.div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-[#41729F]" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-2" />
                    <p>Impossible de charger les données administrateur. Veuillez vous reconnecter.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Messages d'erreur ou de succès */}
            {error && !error.includes("Accès non autorisé") && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
                >
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-red-500 mr-2" />
                        <p>{error}</p>
                    </div>
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md"
                >
                    <div className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        <p>{success}</p>
                    </div>
                </motion.div>
            )}

            {/* Mode Édition du profil administrateur */}
            {editMode ? (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto border border-[#C3CFE2]"
                >
                    <h2 className="text-2xl font-bold text-[#41729F] mb-6">Modifier mon profil administrateur</h2>

                    <form onSubmit={handleSubmitProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nom" className="block text-sm font-medium text-[#274472] mb-1">Nom</label>
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="prenom" className="block text-sm font-medium text-[#274472] mb-1">Prénom</label>
                                <input
                                    type="text"
                                    id="prenom"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-[#274472] mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleEditToggle}
                                className="px-4 py-2 border border-[#41729F] text-[#41729F] rounded-lg hover:bg-[#F5F7FA] transition"
                                disabled={submitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#41729F] text-white rounded-lg hover:bg-[#5885AF] transition flex items-center gap-2"
                                disabled={submitting}
                            >
                                {submitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : passwordMode ? (
                // Mode changement de mot de passe administrateur
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto border border-[#C3CFE2]"
                >
                    <h2 className="text-2xl font-bold text-[#41729F] mb-6">Changer mon mot de passe administrateur</h2>

                    <form onSubmit={handleSubmitPassword} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-[#274472] mb-1">Mot de passe actuel</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-[#274472] mb-1">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#274472] mb-1">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handlePasswordToggle}
                                className="px-4 py-2 border border-[#41729F] text-[#41729F] rounded-lg hover:bg-[#F5F7FA] transition"
                                disabled={submitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#41729F] text-white rounded-lg hover:bg-[#5885AF] transition flex items-center gap-2"
                                disabled={submitting}
                            >
                                {submitting ? <FaSpinner className="animate-spin" /> : <FaLock />}
                                Changer
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                // Mode affichage du profil administrateur
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto border border-[#C3CFE2] flex flex-col md:flex-row items-center gap-10"
                >
                    {/* Avatar administrateur */}
                    <div className="relative flex-shrink-0">
                        <div className="w-40 h-40 rounded-full flex items-center justify-center bg-[#E5EAF0] border-4 border-[#41729F]">
                            <span className="text-6xl font-bold text-[#41729F]">
                                {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                            </span>
                        </div>
                    </div>

                    {/* Infos administrateur */}
                    <div className="flex-1 w-full space-y-3">
                        <h2 className="text-3xl font-bold text-[#41729F] mb-2 flex items-center gap-2">
                            <FaShieldAlt className="text-[#5885AF]" /> {user.prenom} {user.nom}
                        </h2>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FaEnvelope className="text-[#5885AF]" />
                                <span className="font-semibold text-[#274472]">Email :</span>
                                <span className="ml-1 text-gray-700">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaUserCircle className="text-[#5885AF]" />
                                <span className="font-semibold text-[#274472]">Rôle :</span>
                                <span className="ml-1 text-gray-700 bg-blue-100 px-2 py-0.5 rounded-full text-blue-800">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4 flex-wrap">
                            <button
                                onClick={handleEditToggle}
                                className="px-6 py-2 rounded-lg font-semibold text-white bg-[#41729F] hover:bg-[#5885AF] transition flex items-center gap-2"
                            >
                                <FaEdit /> Modifier profil
                            </button>
                            <button
                                onClick={handlePasswordToggle}
                                className="px-6 py-2 rounded-lg font-semibold text-[#41729F] border border-[#41729F] bg-white/80 hover:bg-[#B7C9E2]/60 transition flex items-center gap-2"
                            >
                                <FaLock /> Changer mot de passe
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}