import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppreciationForm from "../components/AppreciationForm";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaSpinner, FaCheckCircle } from "react-icons/fa";

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
            setTimeout(() => {
                navigate('/appreciation/success');
            }, 5000);
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
                    className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-lg text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#274472]">Appréciation envoyée avec succès!</h2>
                    <p className="text-[#5885AF] mt-2">Merci d'avoir pris le temps de compléter cette évaluation.</p>
                    <p className="text-[#5885AF] mt-1">Vous allez être redirigé dans quelques instants...</p>
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
                            Évaluation pour l'étudiant : <span className="font-semibold">{initialStage.etudiantNom} {initialStage.etudiantPrenom}</span>
                        </p>
                    ) : (
                        <p className="text-[#5885AF] italic">Informations sur l'étudiant indisponibles.</p>
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