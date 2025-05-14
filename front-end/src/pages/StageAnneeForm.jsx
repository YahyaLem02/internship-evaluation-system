import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaGraduationCap, FaCalendarAlt, FaChevronDown, FaSpinner, FaInfoCircle, FaSave } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../api.js";

export default function StageAnneeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        anneeUniversitaire: "",
        description: "",
        regles: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [anneeOptions, setAnneeOptions] = useState([]);
    const [showAnneeDropdown, setShowAnneeDropdown] = useState(false);

    // Générer les options d'année universitaire (5 ans avant et 5 ans après l'année actuelle)
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const options = [];

        // Années passées (jusqu'à 5 ans)
        for (let i = 5; i > 0; i--) {
            const startYear = currentYear - i;
            options.push(`${startYear}-${startYear + 1}`);
        }

        // Année actuelle
        options.push(`${currentYear}-${currentYear + 1}`);

        // Années futures (jusqu'à 5 ans)
        for (let i = 1; i <= 5; i++) {
            const startYear = currentYear + i;
            options.push(`${startYear}-${startYear + 1}`);
        }

        setAnneeOptions(options);

        // Si pas d'année sélectionnée, définir l'année actuelle par défaut
        if (!form.anneeUniversitaire && !id) {
            setForm(prev => ({
                ...prev,
                anneeUniversitaire: `${currentYear}-${currentYear + 1}`
            }));
        }
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`${API_URL}/api/stageAnnee/${id}`)
                .then(res => setForm({
                    anneeUniversitaire: res.data.anneeUniversitaire || "",
                    description: res.data.description || "",
                    regles: res.data.regles || "",
                }))
                .catch(() => setError("Impossible de charger les données"))
                .finally(() => setLoading(false));
        }
    }, [id]);

    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    function handleSelectAnnee(annee) {
        setForm(prev => ({ ...prev, anneeUniversitaire: annee }));
        setShowAnneeDropdown(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation supplémentaire
        if (!form.anneeUniversitaire) {
            setError("Veuillez sélectionner une année universitaire");
            setLoading(false);
            return;
        }

        const method = id ? "put" : "post";
        const url = id ? `${API_URL}/api/stageAnnee/${id}` : `${API_URL}/api/stageAnnee/add`;

        axios[method](url, form)
            .then(() => navigate("/stage-annee"))
            .catch((err) => {
                console.error("Erreur:", err);
                setError(err.response?.data?.message || "Erreur lors de la sauvegarde");
            })
            .finally(() => setLoading(false));
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-[#C3CFE2] mt-8"
        >
            <div className="flex items-center gap-3 mb-5">
                <FaGraduationCap className="text-3xl text-[#41729F]" />
                <h2 className="text-2xl font-bold text-[#41729F]">
                    {id ? "Modifier l'année universitaire" : "Créer une année universitaire"}
                </h2>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                    <p className="text-blue-800 font-medium">Configuration des stages</p>
                    <p className="text-blue-700 text-sm mt-1">
                        Cette année universitaire sera utilisée pour définir les périodes de stage,
                        les règles applicables et permettra aux étudiants de s'inscrire à un stage.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[#274472] font-medium mb-1 flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        Année universitaire
                    </label>
                    <div className="relative">
                        <div
                            className={`w-full px-4 py-3 border ${form.anneeUniversitaire ? 'border-[#B7C9E2]' : 'border-red-300'} rounded-xl bg-white text-[#41729F] shadow flex justify-between items-center cursor-pointer hover:border-[#41729F] transition`}
                            onClick={() => setShowAnneeDropdown(!showAnneeDropdown)}
                        >
                            <span className="font-medium">{form.anneeUniversitaire || "Sélectionnez une année"}</span>
                            <FaChevronDown className={`transition-transform duration-200 ${showAnneeDropdown ? 'rotate-180' : ''}`} />
                        </div>

                        {showAnneeDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg max-h-56 overflow-y-auto border border-[#C3CFE2]"
                            >
                                {anneeOptions.map(annee => (
                                    <div
                                        key={annee}
                                        className={`px-4 py-3 hover:bg-[#F5F7FA] cursor-pointer ${form.anneeUniversitaire === annee ? 'bg-[#E5EAF0] text-[#41729F] font-medium' : 'text-[#274472]'}`}
                                        onClick={() => handleSelectAnnee(annee)}
                                    >
                                        {annee}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                    {!form.anneeUniversitaire && !loading && (
                        <p className="text-red-500 text-xs mt-1">Veuillez sélectionner une année universitaire</p>
                    )}
                </div>

                <div>
                    <label className="block text-[#274472] font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Décrivez les objectifs et les informations générales pour cette année universitaire"
                        className="w-full px-4 py-3 border border-[#B7C9E2] rounded-xl bg-white text-[#41729F] shadow focus:ring-2 focus:ring-[#41729F] focus:outline-none transition resize-none"
                    />
                </div>

                <div>
                    <label className="block text-[#274472] font-medium mb-1">Règles et modalités</label>
                    <textarea
                        name="regles"
                        value={form.regles}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Indiquez les règles spécifiques, délais et modalités pour les stages de cette année"
                        className="w-full px-4 py-3 border border-[#B7C9E2] rounded-xl bg-white text-[#41729F] shadow focus:ring-2 focus:ring-[#41729F] focus:outline-none transition resize-none"
                    />
                </div>

                {error && (
                    <div className="text-red-600 font-semibold bg-red-50 p-3 rounded-lg flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                <div className="flex items-center justify-between pt-2">
                    <button
                        type="button"
                        onClick={() => navigate("/stage-annee")}
                        className="px-6 py-3 rounded-xl bg-[#E5EAF0] text-[#41729F] font-semibold hover:bg-[#D4E1F5] transition"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !form.anneeUniversitaire}
                        className={`px-6 py-3 rounded-xl ${loading || !form.anneeUniversitaire ? 'bg-[#7aa0c7] cursor-not-allowed' : 'bg-[#41729F] hover:bg-[#5885AF] cursor-pointer'} text-white font-bold shadow transition flex items-center`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <FaSave className="mr-2" />
                                {id ? "Enregistrer les modifications" : "Créer l'année universitaire"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}