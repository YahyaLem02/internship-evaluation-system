import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaUniversity, FaBuilding, FaCalendarAlt, FaSpinner, FaEnvelope, FaSignInAlt, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { API_URL } from "../api";

export default function PublicStageForm() {
    const { token } = useParams();
    const [annee, setAnnee] = useState(null);
    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        institution: "",
        entreprise: "",
        dateDebut: "",
        dateFin: ""
    });
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState("");
    const [dateErrors, setDateErrors] = useState({
        dateDebut: "",
        dateFin: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // État pour les dates min et max acceptables
    const [dateConstraints, setDateConstraints] = useState({
        minDate: "",
        maxDate: "",
        formatFr: ""
    });

    useEffect(() => {
        axios.get(`${API_URL}/api/stageAnnee/token/${token}`)
            .then(res => {
                setAnnee(res.data);

                // Définir les contraintes de date en fonction de l'année universitaire
                if (res.data && res.data.anneeUniversitaire) {
                    const anneeStr = res.data.anneeUniversitaire;
                    // Extraire les années (ex: "2024-2025" -> ["2024", "2025"])
                    const match = anneeStr.match(/(\d{4})[^\d]*(\d{4})/);

                    if (match && match[1] && match[2]) {
                        const anneeDebut = parseInt(match[1]);
                        const anneeFin = parseInt(match[2]);

                        // Définir une plage de dates raisonnable pour un stage universitaire
                        // Par exemple: du 1er septembre de l'année de début au 31 octobre de l'année de fin
                        const minDate = `${anneeDebut}-09-01`;
                        const maxDate = `${anneeFin}-10-31`;

                        setDateConstraints({
                            minDate,
                            maxDate,
                            formatFr: `du 01/09/${anneeDebut} au 31/10/${anneeFin}`
                        });
                    }
                }
            })
            .catch(() => setErr("Lien invalide ou expiré"));
    }, [token]);

    // Fonction pour formater la date au format français
    const formatDateFr = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));

        // Réinitialiser les erreurs lorsque l'utilisateur modifie les champs
        if (name === 'dateDebut' || name === 'dateFin') {
            setDateErrors(prev => ({ ...prev, [name]: "" }));

            // Valider les dates lorsqu'elles changent
            validateDates({ ...form, [name]: value });
        }
    }

    // Fonction pour valider les dates
    function validateDates(formData) {
        const newErrors = { dateDebut: "", dateFin: "" };
        let isValid = true;

        // Vérifier si les dates sont dans la plage autorisée
        if (formData.dateDebut) {
            if (dateConstraints.minDate && formData.dateDebut < dateConstraints.minDate) {
                newErrors.dateDebut = `La date de début doit être après le ${formatDateFr(dateConstraints.minDate)}`;
                isValid = false;
            }

            if (dateConstraints.maxDate && formData.dateDebut > dateConstraints.maxDate) {
                newErrors.dateDebut = `La date de début doit être avant le ${formatDateFr(dateConstraints.maxDate)}`;
                isValid = false;
            }
        }

        if (formData.dateFin) {
            if (dateConstraints.minDate && formData.dateFin < dateConstraints.minDate) {
                newErrors.dateFin = `La date de fin doit être après le ${formatDateFr(dateConstraints.minDate)}`;
                isValid = false;
            }

            if (dateConstraints.maxDate && formData.dateFin > dateConstraints.maxDate) {
                newErrors.dateFin = `La date de fin doit être avant le ${formatDateFr(dateConstraints.maxDate)}`;
                isValid = false;
            }
        }

        // Vérifier que la date de fin est après la date de début
        if (formData.dateDebut && formData.dateFin && formData.dateFin < formData.dateDebut) {
            newErrors.dateFin = "La date de fin doit être après la date de début";
            isValid = false;
        }

        // Vérifier que la durée du stage est raisonnable (par exemple, entre 1 mois et 6 mois)
        if (formData.dateDebut && formData.dateFin) {
            const debut = new Date(formData.dateDebut);
            const fin = new Date(formData.dateFin);
            const diffTime = Math.abs(fin - debut);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 30) {
                newErrors.dateFin = "La durée du stage doit être d'au moins 1 mois";
                isValid = false;
            }

            if (diffDays > 180) {
                newErrors.dateFin = "La durée du stage ne peut pas dépasser 6 mois";
                isValid = false;
            }
        }

        setDateErrors(newErrors);
        return isValid;
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Vérifier si le formulaire est déjà en cours de soumission
        if (isSubmitting) return;

        // Valider les dates
        if (!validateDates(form)) {
            return; // Ne pas soumettre si les dates sont invalides
        }

        setErr("");
        setIsSubmitting(true);

        axios.post(`${API_URL}/api/stage/public/add`, { ...form, shareToken: token })
            .then(() => setSuccess(true))
            .catch((error) => {
                console.error("Erreur lors de la soumission:", error);
                setErr(error.response?.data?.message || "Erreur lors de l'envoi");
            })
            .finally(() => setIsSubmitting(false));
    }

    if (!annee && !err) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-[#41729F] mx-auto mb-4" />
                    <p className="text-[#41729F]">Chargement...</p>
                </div>
            </div>
        );
    }

    if (err) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto bg-white/80 rounded-2xl shadow-2xl p-8 mt-10 border border-[#C3CFE2] text-center"
            >
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-600 mb-4">{err}</h2>
                <p className="text-gray-600 mb-6">Veuillez vérifier le lien et réessayer ou contacter l'administrateur.</p>
                <button
                    className="px-6 py-2 rounded-xl bg-[#41729F] text-white font-semibold hover:bg-[#5885AF] transition"
                    onClick={() => navigate("/")}
                >
                    Aller à la page de connexion
                </button>
            </motion.div>
        );
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto bg-white/80 rounded-2xl shadow-2xl p-8 mt-10 border border-[#C3CFE2] text-center"
            >
                <h2 className="text-2xl font-bold text-[#41729F] mb-4">Inscription réussie !</h2>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                        <FaEnvelope className="text-[#41729F] mr-3 text-xl" />
                        <p className="text-[#274472]">
                            Consultez votre boîte mail pour accéder à votre compte.
                        </p>
                    </div>
                </div>

                <button
                    className="w-full py-3 rounded-xl bg-[#41729F] text-white font-bold shadow hover:bg-[#5885AF] transition flex items-center justify-center"
                    onClick={() => navigate("/")}
                >
                    <FaSignInAlt className="mr-2" /> Se connecter
                </button>
            </motion.div>
        );
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white/80 rounded-2xl shadow-2xl p-8 mt-10 border border-[#C3CFE2] space-y-6"
        >
            <h2 className="text-2xl font-bold text-[#41729F] mb-2">
                Inscription au stage de l'année universitaire {annee?.anneeUniversitaire}
            </h2>

            {dateConstraints.formatFr && (
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                    <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <p className="text-blue-800 font-medium">Période d'étude</p>
                        <p className="text-blue-700 text-sm mt-1">
                            Pour l'année universitaire {annee?.anneeUniversitaire}, veuillez sélectionner une période
                            de stage comprise {dateConstraints.formatFr}.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-[#274472] font-medium mb-1"><FaUser className="inline mr-1" />Nom</label>
                    <input
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F] disabled:bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1">Prénom</label>
                    <input
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F] disabled:bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F] disabled:bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1"><FaUniversity className="inline mr-1" />Institution</label>
                    <input
                        name="institution"
                        value={form.institution}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F] disabled:bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1"><FaBuilding className="inline mr-1" />Entreprise</label>
                    <input
                        name="entreprise"
                        value={form.entreprise}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F] disabled:bg-gray-100"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[#274472] font-medium mb-1">
                            <FaCalendarAlt className="inline mr-1" />Date début
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="dateDebut"
                                value={form.dateDebut}
                                onChange={handleChange}
                                required
                                min={dateConstraints.minDate}
                                max={dateConstraints.maxDate}
                                disabled={isSubmitting}
                                className={`w-full px-3 py-2 rounded-xl border ${dateErrors.dateDebut ? 'border-red-300 focus:ring-red-500' : 'border-[#B7C9E2] focus:ring-[#41729F]'} bg-white text-[#41729F] disabled:bg-gray-100 focus:outline-none focus:ring-2`}
                            />
                            {form.dateDebut && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5885AF] bg-white px-1">
                                    {formatDateFr(form.dateDebut)}
                                </div>
                            )}
                        </div>
                        {dateErrors.dateDebut && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <FaExclamationTriangle className="mr-1" /> {dateErrors.dateDebut}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-[#274472] font-medium mb-1">
                            <FaCalendarAlt className="inline mr-1" />Date fin
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="dateFin"
                                value={form.dateFin}
                                onChange={handleChange}
                                required
                                min={form.dateDebut || dateConstraints.minDate}
                                max={dateConstraints.maxDate}
                                disabled={isSubmitting}
                                className={`w-full px-3 py-2 rounded-xl border ${dateErrors.dateFin ? 'border-red-300 focus:ring-red-500' : 'border-[#B7C9E2] focus:ring-[#41729F]'} bg-white text-[#41729F] disabled:bg-gray-100 focus:outline-none focus:ring-2`}
                            />
                            {form.dateFin && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5885AF] bg-white px-1">
                                    {formatDateFr(form.dateFin)}
                                </div>
                            )}
                        </div>
                        {dateErrors.dateFin && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <FaExclamationTriangle className="mr-1" /> {dateErrors.dateFin}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {err && (
                <div className="text-red-600 font-semibold bg-red-50 p-3 rounded-lg flex items-center">
                    <span className="mr-2">⚠️</span> {err}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting || Object.values(dateErrors).some(error => error)}
                className={`w-full py-3 rounded-xl ${isSubmitting || Object.values(dateErrors).some(error => error) ? 'bg-[#7aa0c7] cursor-not-allowed' : 'bg-[#41729F] hover:bg-[#5885AF] cursor-pointer'} text-white font-bold shadow transition flex items-center justify-center`}
            >
                {isSubmitting ? (
                    <>
                        <FaSpinner className="animate-spin mr-2" />
                        Traitement en cours...
                    </>
                ) : (
                    'Envoyer'
                )}
            </button>

            <div className="text-sm text-gray-500 text-center">
                Un compte sera créé et les identifiants seront envoyés à votre adresse email.
            </div>
        </motion.form>
    );
}