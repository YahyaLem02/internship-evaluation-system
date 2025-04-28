import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaLayerGroup } from "react-icons/fa";
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

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const method = id ? "put" : "post";
        const url = id ? `${API_URL}/api/stageAnnee/${id}` : `${API_URL}/api/stageAnnee/add`;
        axios[method](url, form)
            .then(() => navigate("/stage-annee"))
            .catch(() => setError("Erreur lors de la sauvegarde"))
            .finally(() => setLoading(false));
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-[#C3CFE2] mt-8"
        >
            <div className="flex items-center gap-3 mb-5">
                <FaLayerGroup className="text-3xl text-[#41729F]" />
                <h2 className="text-2xl font-bold text-[#41729F]">
                    {id ? "Modifier l’espace StageAnnée" : "Créer un espace StageAnnée"}
                </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[#274472] font-medium mb-1">Année universitaire</label>
                    <input
                        name="anneeUniversitaire"
                        value={form.anneeUniversitaire}
                        onChange={handleChange}
                        required
                        placeholder="ex : 2024-2025"
                        className="w-full px-4 py-3 border border-[#B7C9E2] rounded-xl bg-white text-[#41729F] shadow focus:ring-2 focus:ring-[#41729F] focus:outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Décrivez l’espace, les objectifs, etc."
                        className="w-full px-4 py-3 border border-[#B7C9E2] rounded-xl bg-white text-[#41729F] shadow focus:ring-2 focus:ring-[#41729F] focus:outline-none transition resize-none"
                    />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1">Règles</label>
                    <textarea
                        name="regles"
                        value={form.regles}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Indiquez les règles spécifiques pour cette année"
                        className="w-full px-4 py-3 border border-[#B7C9E2] rounded-xl bg-white text-[#41729F] shadow focus:ring-2 focus:ring-[#41729F] focus:outline-none transition resize-none"
                    />
                </div>
                {error && <div className="text-red-600 font-semibold">{error}</div>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#41729F] text-white font-bold shadow hover:bg-[#5885AF] transition"
                >
                    {loading ? "Enregistrement…" : id ? "Enregistrer les modifications" : "Créer l’espace"}
                </button>
            </form>
        </motion.div>
    );
}