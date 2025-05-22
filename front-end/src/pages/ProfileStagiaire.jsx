import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaEnvelope,
    FaUser,
    FaEdit,
    FaLock,
    FaSpinner,
    FaCheck,
    FaExclamationTriangle,
    FaUniversity,
    FaBuilding,
    FaCalendarAlt,
    FaGraduationCap,
    FaStar,
    FaClipboardList,
    FaInfoCircle
} from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../api";
import AuthService from "../services/AuthService";

export default function ProfileStagiaire() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    // État pour le formulaire d'édition - adapté pour les stagiaires
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        institution: ""
    });

    // État pour le changement de mot de passe
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // État pour les validations de mot de passe
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        match: false
    });

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        // Vérifier si l'utilisateur est connecté et s'il est stagiaire
        if (currentUser && currentUser.role === "STAGIAIRE") {
            fetchUserData(currentUser);
        } else {
            // Rediriger vers la page de connexion ou d'accueil si l'utilisateur n'est pas stagiaire
            setError("Accès non autorisé. Seuls les stagiaires peuvent accéder à cette page.");
            setTimeout(() => {
                navigate('/'); // Redirection vers la page d'accueil
            }, 2000);
        }
    }, [navigate]);

    // Vérifier la validité du mot de passe lors de la saisie
    useEffect(() => {
        if (passwordMode) {
            setPasswordValidation({
                length: passwordData.newPassword.length >= 6,
                match: passwordData.newPassword === passwordData.confirmPassword &&
                    passwordData.newPassword.length > 0
            });
        }
    }, [passwordData, passwordMode]);

    const fetchUserData = async (currentUser) => {
        try {
            setLoading(true);

            // Utiliser l'endpoint /me pour récupérer les informations du stagiaire connecté
            const response = await axios.get(`${API_URL}/api/stagaire/me`);

            const userData = response.data;
            setUser(userData);

            // Initialiser le formulaire avec les données utilisateur
            setFormData({
                nom: userData.nom || "",
                prenom: userData.prenom || "",
                email: userData.email || "",
                institution: userData.institution || ""
            });

            setLoading(false);
        } catch (err) {
            console.error("Erreur lors de la récupération des données stagiaire:", err);
            setError("Impossible de charger les données du stagiaire");
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
        setPasswordValidation({
            length: false,
            match: false
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

            // Mettre à jour le profil stagiaire
            await axios.put(`${API_URL}/api/stagaire/${currentUser.userId}`, formData);

            // Mettre à jour les données utilisateur après la modification
            fetchUserData(currentUser);

            setSuccess("Profil mis à jour avec succès");
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

        // Vérifications supplémentaires
        if (!passwordData.currentPassword) {
            setError("Veuillez saisir votre mot de passe actuel");
            setSubmitting(false);
            return;
        }

        // Vérification des mots de passe
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas");
            setSubmitting(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("Le nouveau mot de passe doit contenir au moins 6 caractères");
            setSubmitting(false);
            return;
        }

        // Vérification que le nouveau mot de passe est différent de l'ancien
        if (passwordData.currentPassword === passwordData.newPassword) {
            setError("Le nouveau mot de passe doit être différent de l'ancien");
            setSubmitting(false);
            return;
        }

        try {
            const currentUser = AuthService.getCurrentUser();

            // Appel API pour changer le mot de passe
            await axios.post(`${API_URL}/api/stagaire/${currentUser.userId}/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setSuccess("Mot de passe modifié avec succès");
            setPasswordMode(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            console.error("Erreur lors du changement de mot de passe:", err);

            // Message d'erreur plus spécifique pour les erreurs courantes
            if (err.response?.status === 400 && err.response?.data?.message?.includes("incorrect")) {
                setError("Mot de passe actuel incorrect");
            } else {
                setError(err.response?.data?.message || "Erreur lors du changement de mot de passe");
            }
        } finally {
            setSubmitting(false);
        }
    };

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
                    <p>Impossible de charger les données du stagiaire. Veuillez vous reconnecter.</p>
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

            {/* Mode Édition du profil stagiaire */}
            {editMode ? (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto border border-[#C3CFE2]"
                >
                    <h2 className="text-2xl font-bold text-[#41729F] mb-6 flex items-center gap-2">
                        <FaEdit /> Modifier mon profil
                    </h2>

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
                            <div>
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
                            <div>
                                <label htmlFor="institution" className="block text-sm font-medium text-[#274472] mb-1">Institution</label>
                                <input
                                    type="text"
                                    id="institution"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
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
                // Mode changement de mot de passe
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto border border-[#C3CFE2]"
                >
                    <h2 className="text-2xl font-bold text-[#41729F] mb-6 flex items-center gap-2">
                        <FaLock /> Changer mon mot de passe
                    </h2>

                    <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg flex items-start gap-3">
                        <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Important :</p>
                            <p className="text-sm mt-1">
                                Pour changer votre mot de passe, vous devez d'abord saisir votre mot de passe actuel.
                                Cette vérification est nécessaire pour des raisons de sécurité.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitPassword} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-[#274472] mb-1">
                                    Mot de passe actuel <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                                    required
                                    placeholder="Saisissez votre mot de passe actuel"
                                />
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-[#274472] mb-1">
                                    Nouveau mot de passe <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 
                                    ${passwordValidation.length ? 'border-green-300 focus:ring-green-500' : 'border-[#C3CFE2] focus:ring-[#5885AF]'}`}
                                    required
                                    minLength={6}
                                    placeholder="6 caractères minimum"
                                />
                                <div className={`text-xs mt-1 ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`inline-block w-4 h-4 text-center rounded-full mr-1 
                                    ${passwordValidation.length ? 'bg-green-100 text-green-600' : 'bg-gray-200'}`}>
                                        {passwordValidation.length ? '✓' : '!'}
                                    </span>
                                    Au moins 6 caractères
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#274472] mb-1">
                                    Confirmer le mot de passe <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 
                                    ${passwordValidation.match ? 'border-green-300 focus:ring-green-500' : 'border-[#C3CFE2] focus:ring-[#5885AF]'}`}
                                    required
                                    placeholder="Retapez votre nouveau mot de passe"
                                />
                                <div className={`text-xs mt-1 ${passwordValidation.match ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`inline-block w-4 h-4 text-center rounded-full mr-1 
                                    ${passwordValidation.match ? 'bg-green-100 text-green-600' : 'bg-gray-200'}`}>
                                        {passwordValidation.match ? '✓' : '!'}
                                    </span>
                                    Les mots de passe correspondent
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
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
                                disabled={submitting || !passwordValidation.length || !passwordValidation.match || !passwordData.currentPassword}
                            >
                                {submitting ? <FaSpinner className="animate-spin" /> : <FaLock />}
                                Changer
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                // Mode affichage du profil stagiaire
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-3xl mx-auto border border-[#C3CFE2] flex flex-col md:flex-row items-center gap-10"
                    >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-40 h-40 rounded-full flex items-center justify-center bg-[#E5EAF0] border-4 border-[#41729F]">
                                <span className="text-6xl font-bold text-[#41729F]">
                                    {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                                </span>
                            </div>
                        </div>

                        {/* Infos principales */}
                        <div className="flex-1 w-full space-y-3">
                            <h2 className="text-3xl font-bold text-[#41729F] mb-2 flex items-center gap-2">
                                <FaGraduationCap className="text-[#5885AF]" /> {user.prenom} {user.nom}
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <FaEnvelope className="text-[#5885AF]" />
                                    <span className="font-semibold text-[#274472]">Email :</span>
                                    <span className="ml-1 text-gray-700">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaUniversity className="text-[#5885AF]" />
                                    <span className="font-semibold text-[#274472]">Institution :</span>
                                    <span className="ml-1 text-gray-700">{user.institution || "-"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaBuilding className="text-[#5885AF]" />
                                    <span className="font-semibold text-[#274472]">Entreprise :</span>
                                    <span className="ml-1 text-gray-700">{user.entreprise || "-"}</span>
                                </div>
                                {(user.dateDebut || user.dateFin) && (
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-[#5885AF]" />
                                        <span className="font-semibold text-[#274472]">Période de stage :</span>
                                        <span className="ml-1 text-gray-700">
                                            {user.dateDebut ? new Date(user.dateDebut).toLocaleDateString() : "-"}
                                            {" → "}
                                            {user.dateFin ? new Date(user.dateFin).toLocaleDateString() : "-"}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <FaClipboardList className="text-[#5885AF]" />
                                    <span className="font-semibold text-[#274472]">Statut d'évaluation :</span>
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-sm ${user.evaluated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {user.evaluated ? 'Évalué' : 'Non évalué'}
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

                    {/* Section des stages */}
                    {user.stages && user.stages.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-3xl mx-auto border border-[#C3CFE2]"
                        >
                            <h3 className="text-xl font-bold text-[#41729F] mb-4 flex items-center gap-2">
                                <FaBuilding /> Mes Stages
                            </h3>
                            <div className="space-y-4">
                                {user.stages.map((stage, index) => (
                                    <div key={index} className="bg-white/80 p-4 rounded-lg border border-[#E5EAF0] hover:shadow-md transition">
                                        <h4 className="text-lg font-semibold text-[#274472]">{stage.entreprise}</h4>
                                        <div className="mt-2 space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-[#5885AF]" />
                                                <span className="font-medium">Période :</span>
                                                <span>
                                                    {stage.dateDebut ? new Date(stage.dateDebut).toLocaleDateString() : "-"}
                                                    {" → "}
                                                    {stage.dateFin ? new Date(stage.dateFin).toLocaleDateString() : "-"}
                                                </span>
                                            </div>
                                            {stage.anneeUniversitaire && (
                                                <div className="flex items-center gap-2">
                                                    <FaUniversity className="text-[#5885AF]" />
                                                    <span className="font-medium">Année universitaire :</span>
                                                    <span>{stage.anneeUniversitaire}</span>
                                                </div>
                                            )}
                                            {stage.description && (
                                                <div className="mt-2">
                                                    <p className="font-medium text-[#274472]">Description :</p>
                                                    <p className="mt-1 text-gray-700">{stage.description}</p>
                                                </div>
                                            )}
                                            {stage.objectif && (
                                                <div className="mt-2">
                                                    <p className="font-medium text-[#274472]">Objectifs :</p>
                                                    <p className="mt-1 text-gray-700">{stage.objectif}</p>
                                                </div>
                                            )}
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stage.evaluated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {stage.evaluated ? 'Évalué' : 'Non évalué'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    {/* Section des appréciations (si disponibles) */}
                    {user.appreciations && user.appreciations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-3xl mx-auto border border-[#C3CFE2]"
                        >
                            <h3 className="text-xl font-bold text-[#41729F] mb-4 flex items-center gap-2">
                                <FaStar /> Mes Évaluations
                            </h3>
                            <div className="space-y-4">
                                {user.appreciations.map((appreciation, index) => (
                                    <div key={index} className="bg-white/80 p-4 rounded-lg border border-[#E5EAF0] hover:shadow-md transition">
                                        <h4 className="text-lg font-semibold text-[#274472]">
                                            Évaluation par {appreciation.tuteurNom} {appreciation.tuteurPrenom}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {appreciation.tuteurEmail} • {appreciation.tuteurEntreprise}
                                        </p>

                                        {/* Affichage des compétences */}
                                        {appreciation.competences && appreciation.competences.length > 0 && (
                                            <div className="mt-4">
                                                <h5 className="font-medium text-[#274472] mb-2">Compétences évaluées</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {appreciation.competences.map((competence, idx) => {
                                                        // Déterminer la couleur du badge en fonction de la note
                                                        const getBadgeColorClass = (note) => {
                                                            const noteNum = parseInt(note);
                                                            if (isNaN(noteNum)) return "bg-gray-100 text-gray-800";
                                                            if (noteNum >= 15) return "bg-green-100 text-green-800";
                                                            if (noteNum >= 10) return "bg-blue-100 text-blue-800";
                                                            if (noteNum >= 5) return "bg-yellow-100 text-yellow-800";
                                                            return "bg-red-100 text-red-800";
                                                        };

                                                        return (
                                                            <div key={idx} className="bg-blue-50 p-3 rounded-md">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-medium text-[#274472]">{competence.intitule}</span>
                                                                    <span className={`${getBadgeColorClass(competence.note)} px-2 py-0.5 rounded-full font-medium`}>
                                                    {competence.note}
                                                </span>
                                                                </div>
                                                                {competence.categories && competence.categories.length > 0 && (
                                                                    <div className="mt-2 space-y-1 border-t border-blue-100 pt-2">
                                                                        {competence.categories.map((categorie, catIdx) => {
                                                                            // Déterminer le style pour les valeurs des catégories
                                                                            const getCategoryValueStyle = (value) => {
                                                                                if (!value) return "text-gray-500";

                                                                                switch(value) {
                                                                                    case "AUTONOME +":
                                                                                        return "font-medium text-green-600";
                                                                                    case "AUTONOME":
                                                                                        return "font-medium text-blue-600";
                                                                                    case "DÉBUTANT":
                                                                                        return "font-medium text-yellow-600";
                                                                                    case "NA":
                                                                                        return "font-medium text-gray-500 italic";
                                                                                    default:
                                                                                        // Pour les valeurs numériques (si présentes)
                                                                                        if (!isNaN(parseInt(value))) {
                                                                                            return "font-medium text-[#41729F] bg-blue-50 px-1.5 py-0.5 rounded";
                                                                                        }
                                                                                        return "font-medium text-[#41729F]";
                                                                                }
                                                                            };

                                                                            return (
                                                                                <div key={catIdx} className="flex justify-between text-sm p-1">
                                                                                    <span className="text-gray-700">{categorie.intitule}</span>
                                                                                    <span className={getCategoryValueStyle(categorie.valeur)}>
                                                                    {categorie.valeur}
                                                                </span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Affichage des évaluations générales */}
                                        {appreciation.evaluations && appreciation.evaluations.length > 0 && (
                                            <div className="mt-4">
                                                <h5 className="font-medium text-[#274472] mb-2">Évaluations générales</h5>
                                                <div className="space-y-2">
                                                    {appreciation.evaluations.map((evaluation, evalIdx) => {
                                                        // Déterminer le style pour les valeurs des évaluations
                                                        const getEvaluationValueStyle = (value) => {
                                                            if (!value) return "text-gray-500 italic";

                                                            // Si c'est un texte long comme une observation
                                                            if (value.length > 20) {
                                                                return "text-gray-700 italic text-sm";
                                                            }

                                                            // Pour les évaluations courtes
                                                            switch(value) {
                                                                case "Excellente":
                                                                    return "font-medium text-green-600";
                                                                case "Acceptable":
                                                                    return "font-medium text-blue-600";
                                                                case "Le juste nécessaire":
                                                                    return "font-medium text-yellow-600";
                                                                default:
                                                                    // Pour les valeurs numériques (si présentes)
                                                                    if (!isNaN(parseInt(value))) {
                                                                        return "font-medium text-[#41729F] bg-blue-50 px-1.5 py-0.5 rounded";
                                                                    }
                                                                    return "font-medium text-[#41729F]";
                                                            }
                                                        };

                                                        // Vérifier si la valeur est un texte long
                                                        const isLongText = evaluation.valeur && evaluation.valeur.length > 20;

                                                        return (
                                                            <div key={evalIdx} className="bg-gray-50 p-2 rounded">
                                                                <div className="font-medium text-[#274472]">{evaluation.categorie}</div>
                                                                {isLongText ? (
                                                                    <div className="mt-1 p-2 bg-white/80 rounded text-gray-700 italic text-sm">
                                                                        {evaluation.valeur}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex justify-end mt-1">
                                                    <span className={getEvaluationValueStyle(evaluation.valeur)}>
                                                        {evaluation.valeur}
                                                    </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}