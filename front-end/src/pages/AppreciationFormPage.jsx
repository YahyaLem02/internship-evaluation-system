import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppreciationForm from "../components/AppreciationForm";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaSpinner, FaCheckCircle, FaThumbsUp, FaEnvelope, FaGraduationCap } from "react-icons/fa";

export default function AppreciationFormPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [initialStage, setInitialStage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        if (!token || token.length < 10) {
            setError("Le token d'appréciation est invalide ou manquant.");
            setLoading(false);
            return;
        }

        axios.get(`${API_URL}/api/appreciation/form/${token}`)
            .then(res => {
                setInitialStage(res.data || {});
            })
            .catch(err => {
                console.error("Erreur lors du chargement des données:", err);
                setError(err.response?.data?.message || "Impossible de charger les informations du stage");
            })
            .finally(() => setLoading(false));
    }, [token]);

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        try {
            await axios.post(`${API_URL}/api/appreciation/submit`, {
                ...formData,
                token
            });
            setSubmitSuccess(true);
            // Délai augmenté pour laisser plus de temps pour lire le message
            setTimeout(() => {
                navigate('/appreciation/success');
            }, 8000);
        } catch (err) {
            console.error("Erreur lors de la soumission:", err);
            setError(err.response?.data?.message || "Erreur lors de l'envoi de l'appréciation");
            setSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-[#5885AF]/10 to-[#274472]/10 min-h-screen flex items-center justify-center">
                <motion.div
                    className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-lg text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaSpinner className="animate-spin text-[#41729F] text-4xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#274472]">Chargement des données...</h2>
                    <p className="text-[#5885AF] mt-2">Veuillez patienter pendant que nous récupérons les informations du stage.</p>
                </motion.div>
            </div>
        );
    }

    if (error && !initialStage) {
        return (
            <div className="bg-gradient-to-b from-[#5885AF]/10 to-[#274472]/10 min-h-screen flex items-center justify-center">
                <motion.div
                    className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-lg text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#274472]">Lien d'appréciation invalide</h2>
                    <p className="text-[#5885AF] mt-2">{error}</p>
                    <button
                        className="mt-6 px-6 py-2 bg-[#41729F] text-white rounded-xl font-bold hover:bg-[#5885AF] transition"
                        onClick={() => navigate('/')}
                    >
                        Retour à l'accueil
                    </button>
                </motion.div>
            </div>
        );
    }

    if (submitSuccess) {
        return (
            <div className="bg-gradient-to-b from-[#5885AF]/10 to-[#274472]/10 min-h-screen flex items-center justify-center">
                <motion.div
                    className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                duration: 0.5,
                                type: "spring",
                                stiffness: 200
                            }}
                            className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6"
                        >
                            <FaCheckCircle className="text-green-500 text-4xl" />
                        </motion.div>

                        <h2 className="text-2xl font-bold text-[#274472] mb-4">Merci pour votre appréciation !</h2>

                        <p className="text-[#5885AF] mb-4">
                            Votre évaluation a bien été reçue et sera précieuse pour l'accompagnement pédagogique
                            de <span className="font-semibold">{initialStage?.etudiantPrenom} {initialStage?.etudiantNom}</span>.
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 text-left rounded-r">
                            <div className="flex items-start">
                                <FaGraduationCap className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                                <p className="text-blue-800">
                                    Le service pédagogique et le stagiaire pourront maintenant consulter votre appréciation dans leur espace personnel.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-gradient-to-b from-[#5885AF]/10 to-[#274472]/10 min-h-screen py-8 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[#274472]">Formulaire d'appréciation de stage</h1>
                    {initialStage?.etudiantNom && initialStage?.etudiantPrenom ? (
                        <p className="text-[#5885AF]">
                            Évaluation pour le stagiaire : <span className="font-semibold">{initialStage.etudiantNom} {initialStage.etudiantPrenom}</span>
                        </p>
                    ) : (
                        <p className="text-[#5885AF] italic">Informations sur le stagiaire indisponibles.</p>
                    )}
                </div>

                <AppreciationForm
                    initialStage={initialStage}
                    onSubmit={handleSubmit}
                />

                {submitting && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl flex items-center space-x-4">
                            <FaSpinner className="animate-spin text-[#41729F] text-xl" />
                            <span className="font-medium">Envoi en cours...</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}