import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaChevronRight, FaLayerGroup } from "react-icons/fa";
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
                    <FaLayerGroup className="text-[#5885AF]" /> Espaces StageAnnée
                </h1>
                <Link
                    to="/stage-annee/create"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#41729F] text-white font-semibold shadow hover:bg-[#5885AF] transition"
                >
                    <FaPlus /> Nouveau StageAnnée
                </Link>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-[#C3CFE2]">
                <table className="min-w-full divide-y divide-[#E5EAF0]">
                    <thead>
                    <tr>
                        <th className="px-6 py-4 text-left font-bold text-[#274472]">Année universitaire</th>
                        <th className="px-6 py-4 text-left font-bold text-[#274472]">Description</th>
                        <th className="px-6 py-4 text-left font-bold text-[#274472]">Règles</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="py-10 text-center text-[#5885AF]">Chargement…</td>
                        </tr>
                    ) : stageAnnees.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-10 text-center text-[#41729F]">Aucun espace StageAnnée</td>
                        </tr>
                    ) : (
                        stageAnnees.map((a) => (
                            <tr key={a.id} className="hover:bg-[#F5F7FA] transition">
                                <td className="px-6 py-4 font-semibold text-[#41729F]">{a.anneeUniversitaire}</td>
                                <td className="px-6 py-4 text-[#274472]">{a.description || <span className="italic text-gray-300">—</span>}</td>
                                <td className="px-6 py-4 text-[#274472]">{a.regles || <span className="italic text-gray-300">—</span>}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <Link
                                        to={`/stage-annee/${a.id}/edit`}
                                        className="text-[#5885AF] hover:text-[#41729F] transition"
                                        title="Modifier"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <Link
                                        to={`/stage-annee/${a.id}`}
                                        className="text-[#41729F] hover:text-[#274472] transition"
                                        title="Voir"
                                    >
                                        <FaChevronRight />
                                    </Link>
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