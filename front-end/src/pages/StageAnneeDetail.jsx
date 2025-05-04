import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import { FaChevronLeft, FaUserGraduate, FaCalendarAlt, FaBuilding } from "react-icons/fa";

export default function StageAnneeDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        // Charger les détails de la StageAnnee
        axios.get(`${API_URL}/api/stageAnnee/${id}`)
            .then(res => setData(res.data))
            .catch(() => setErr("Erreur de chargement"));

        // Charger la liste des étudiants associés
        axios.get(`${API_URL}/api/stageAnnee/${id}/students`)
            .then(res => setStudents(res.data))
            .catch(() => setErr("Erreur de chargement des étudiants"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center mt-10 text-[#41729F]">Chargement…</div>;
    if (err) return <div className="text-center mt-10 text-red-500 font-bold">{err}</div>;

    const publicUrl = `${window.location.origin}/stage-inscription/${data?.shareToken}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto bg-white/80 rounded-2xl shadow-2xl p-8 mt-10 border border-[#C3CFE2]"
        >
            <Link to="/stage-annee" className="flex items-center text-[#41729F] font-semibold mb-5 hover:underline">
                <FaChevronLeft className="mr-2" /> Retour à la liste
            </Link>
            <h2 className="text-2xl font-bold text-[#41729F] mb-4">Détail de l'espace StageAnnée</h2>
            <div className="mb-6">
                <div><span className="font-semibold text-[#274472]">Année universitaire : </span>{data?.anneeUniversitaire}</div>
                <div><span className="font-semibold text-[#274472]">Description : </span>{data?.description || <span className="italic text-gray-400">—</span>}</div>
                <div><span className="font-semibold text-[#274472]">Règles : </span>{data?.regles || <span className="italic text-gray-400">—</span>}</div>
            </div>
            <div className="mt-6">
                <div className="font-semibold text-[#274472] mb-2">
                    Lien d'inscription :
                </div>
                <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#F5F7FA] text-[#41729F] px-3 py-2 rounded-xl font-mono hover:bg-[#C3CFE2] transition break-all"
                >
                    {publicUrl}
                </a>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold text-[#41729F] mb-3 flex items-center gap-2">
                    <FaUserGraduate /> Étudiants inscrits
                </h3>
                {students.length === 0 ? (
                    <div className="italic text-gray-400">Aucun étudiant inscrit pour cette année.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-[#C3CFE2] bg-white/70 rounded-xl shadow-xl">
                            <thead className="bg-[#41729F] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold">Nom</th>
                                <th className="px-6 py-4 text-left font-bold">Prénom</th>
                                <th className="px-6 py-4 text-left font-bold">Email</th>
                                <th className="px-6 py-4 text-left font-bold">Institution</th>
                                <th className="px-6 py-4 text-left font-bold"><FaBuilding className="inline-block mr-1" /> Entreprise</th>
                                <th className="px-6 py-4 text-left font-bold"><FaCalendarAlt className="inline-block mr-1" /> Période</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5EAF0]">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-[#F5F7FA] transition">
                                    <td className="px-6 py-4 font-semibold text-[#274472]">{student.nom}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.prenom}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.email}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.institution}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.entreprise || <span className="italic text-gray-400">—</span>}</td>
                                    <td className="px-6 py-4 text-[#274472]">
                                        {student.dateDebut && student.dateFin ? (
                                            <span>{student.dateDebut} → {student.dateFin}</span>
                                        ) : (
                                            <span className="italic text-gray-400">Dates non définies</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
}