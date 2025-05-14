import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaChevronRight, FaCalendarAlt, FaGraduationCap } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../api.js";

export default function StageAnneeList() {
    const [stageAnnees, setStageAnnees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/api/stageAnnee/all`)
            .then(res => setStageAnnees(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-[#41729F] flex items-center gap-2">
                    <FaGraduationCap className="text-[#5885AF]" /> Gestion des années universitaires
                </h1>
                <Link
                    to="/stage-annee/create"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#41729F] text-white font-semibold shadow hover:bg-[#5885AF] transition"
                >
                    <FaPlus /> Nouvelle année
                </Link>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-[#C3CFE2]">
                <table className="min-w-full divide-y divide-[#E5EAF0]">
                    <thead>
                    <tr>
                        <th className="px-6 py-4 text-left font-bold text-[#274472]">Année universitaire</th>
                        <th className="px-6 py-4 text-left font-bold text-[#274472]">Description</th>
                        <th className="px-6 py-4 text-left font-bold text-[#274472]">Règles</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="py-10 text-center text-[#5885AF]">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#41729F] mr-2"></div>
                                    Chargement des données...
                                </div>
                            </td>
                        </tr>
                    ) : stageAnnees.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-10 text-center text-[#41729F]">
                                <div className="flex flex-col items-center justify-center">
                                    <FaCalendarAlt className="text-3xl text-[#C3CFE2] mb-2" />
                                    <p>Aucune année universitaire configurée</p>
                                    <Link
                                        to="/stage-annee/create"
                                        className="mt-3 text-sm px-4 py-1 bg-[#F5F7FA] hover:bg-[#E5EAF0] text-[#41729F] rounded-lg transition"
                                    >
                                        Créer une année
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        stageAnnees.map((a) => (
                            <tr key={a.id} className="hover:bg-[#F5F7FA] transition">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-[#41729F] flex items-center">
                                        <FaCalendarAlt className="mr-2 text-[#5885AF]" />
                                        {a.anneeUniversitaire}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#274472]">
                                    {a.description || <span className="italic text-gray-400">Non renseigné</span>}
                                </td>
                                <td className="px-6 py-4 text-[#274472]">
                                    {a.regles || <span className="italic text-gray-400">Non renseigné</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <Link
                                            to={`/stage-annee/${a.id}/edit`}
                                            className="p-2 rounded-lg text-[#5885AF] hover:bg-[#E5EAF0] hover:text-[#41729F] transition"
                                            title="Modifier l'année universitaire"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <Link
                                            to={`/stage-annee/${a.id}`}
                                            className="p-2 rounded-lg text-[#41729F] hover:bg-[#E5EAF0] hover:text-[#274472] transition"
                                            title="Voir les détails"
                                        >
                                            <FaChevronRight />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}