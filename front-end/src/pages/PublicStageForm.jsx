import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaUniversity, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import { API_URL } from "../api";

export default function PublicStageForm() {
    const { token } = useParams();
    const [annee, setAnnee] = useState(null);
    const [form, setForm] = useState({
        nom: "", prenom: "", email: "", institution: "",
        entreprise: "",
        dateDebut: "", dateFin: ""
    });
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/api/stageAnnee/token/${token}`)
            .then(res => setAnnee(res.data))
            .catch(() => setErr("Lien invalide ou expiré"));
    }, [token]);

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }

function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    axios.post(`${API_URL}/api/stage/public/add`, { ...form, shareToken: token })
        .then(() => setSuccess(true))
        .catch(() => setErr("Erreur lors de l'envoi"));
}

    if (!annee && !err) return <div className="text-center mt-10 text-[#41729F]">Chargement…</div>;
    if (err) return <div className="text-center mt-10 text-red-500 font-bold">{err}</div>;
    if (success) return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto bg-white/80 rounded-2xl shadow-2xl p-8 mt-10 border border-[#C3CFE2] text-center"
        >
            <h2 className="text-2xl font-bold text-[#41729F] mb-2">Merci !</h2>
            <p className="text-[#274472]">Votre inscription a bien été prise en compte.</p>
            <button
                className="mt-6 px-6 py-2 rounded-xl bg-[#41729F] text-white font-semibold hover:bg-[#5885AF] transition"
                onClick={() => navigate("/")}
            >
                Retour à l'accueil
            </button>
        </motion.div>
    );

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white/80 rounded-2xl shadow-2xl p-8 mt-10 border border-[#C3CFE2] space-y-6"
        >
            <h2 className="text-2xl font-bold text-[#41729F] mb-2">
                Inscription à l'espace stage {annee?.anneeUniversitaire}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-[#274472] font-medium mb-1"><FaUser className="inline mr-1" />Nom</label>
                    <input name="nom" value={form.nom} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F]" />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1">Prénom</label>
                    <input name="prenom" value={form.prenom} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F]" />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F]" />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1"><FaUniversity className="inline mr-1" />Institution</label>
                    <input name="institution" value={form.institution} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F]" />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1"><FaBuilding className="inline mr-1" />Entreprise</label>
                    <input name="entreprise" value={form.entreprise} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F]" />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1"><FaCalendarAlt className="inline mr-1" />Date début</label>
                    <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F]" />
                </div>
                <div>
                    <label className="block text-[#274472] font-medium mb-1"><FaCalendarAlt className="inline mr-1" />Date fin</label>
                    <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F]" />
                </div>
            </div>
            {err && <div className="text-red-600 font-semibold">{err}</div>}
            <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#41729F] text-white font-bold shadow hover:bg-[#5885AF] transition"
            >Envoyer</button>
        </motion.form>
    );
}