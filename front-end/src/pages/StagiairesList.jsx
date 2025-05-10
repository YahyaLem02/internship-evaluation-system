import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaGraduationCap, FaBuilding, FaCalendarAlt, FaEye } from "react-icons/fa";

export default function StagiairesList() {
    const [stagiaires, setStagiaires] = useState([]);
    const [stageAnnees, setStageAnnees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState("");
    const [stageAnneeFilter, setStageAnneeFilter] = useState("");
    const [evaluationFilter, setEvaluationFilter] = useState("all"); // 'all', 'evaluated', 'non-evaluated'

    useEffect(() => {
        // Charger tous les stagiaires
        axios.get(`${API_URL}/api/stagaire`) // Correction de stagaire à stagiaires
            .then(res => {
                console.log("Données des stagiaires:", res.data);
                setStagiaires(res.data);
            })
            .catch(err => {
                console.error("Erreur de chargement des stagiaires:", err);
                setError("Erreur lors du chargement des stagiaires");
            });

        // Charger les stages-années pour le filtre
        axios.get(`${API_URL}/api/stageAnnee`)
            .then(res => {
                setStageAnnees(res.data);
            })
            .catch(err => {
                console.error("Erreur de chargement des stages-années:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Filtrer les stagiaires
    const filteredStagiaires = stagiaires.filter(stagiaire => {
        // Filtre par recherche (nom, prénom, email)
        const matchesSearch = searchTerm === "" ||
            stagiaire.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stagiaire.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stagiaire.email?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtre par année de stage
        let matchesStageAnnee = true;
        if (stageAnneeFilter !== "") {
            // Vérifier d'abord dans les stages (s'il y en a)
            if (stagiaire.stages && stagiaire.stages.length > 0) {
                matchesStageAnnee = stagiaire.stages.some(stage =>
                    stage.stageAnneeId === parseInt(stageAnneeFilter)
                );
            } else {
                // Si pas de stages, vérifier si le stagiaire a un champ entreprise
                // (ce qui suggère qu'il a au moins un stage, même si le tableau stages est absent)
                matchesStageAnnee = false;
            }
        }

        // Filtre par évaluation
        const matchesEvaluation = evaluationFilter === "all" ||
            (evaluationFilter === "evaluated" && stagiaire.evaluated) ||
            (evaluationFilter === "non-evaluated" && !stagiaire.evaluated);

        return matchesSearch && matchesStageAnnee && matchesEvaluation;
    });

    if (loading) return <div className="p-6 text-center">Chargement...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#41729F] mb-6 flex items-center gap-2">
                <FaGraduationCap /> Gestion des Stagiaires
            </h1>

            {/* Filtres et recherche */}
            <div className="bg-white/70 p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4 items-end">
                {/* Recherche */}
                <div className="flex-1">
                    <label className="text-sm font-medium text-[#274472] block mb-1">Recherche</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher par nom, prénom ou email..."
                            className="w-full p-2 pr-10 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                        />
                        <FaSearch className="absolute right-3 top-3 text-[#5885AF]" />
                    </div>
                </div>

                {/* Filtre par année */}
                <div className="md:w-1/4">
                    <label className="text-sm font-medium text-[#274472] block mb-1">Année de Stage</label>
                    <select
                        value={stageAnneeFilter}
                        onChange={(e) => setStageAnneeFilter(e.target.value)}
                        className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                    >
                        <option value="">Toutes les années</option>
                        {stageAnnees.map(annee => (
                            <option key={annee.id} value={annee.id}>
                                {annee.anneeUniversitaire}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtre par évaluation */}
                <div className="md:w-1/4">
                    <label className="text-sm font-medium text-[#274472] block mb-1">Évaluation</label>
                    <select
                        value={evaluationFilter}
                        onChange={(e) => setEvaluationFilter(e.target.value)}
                        className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                    >
                        <option value="all">Tous les stagiaires</option>
                        <option value="evaluated">Évalués</option>
                        <option value="non-evaluated">Non évalués</option>
                    </select>
                </div>

                {/* Bouton de réinitialisation des filtres */}
                <button
                    onClick={() => {
                        setSearchTerm("");
                        setStageAnneeFilter("");
                        setEvaluationFilter("all");
                    }}
                    className="bg-[#F5F7FA] text-[#41729F] px-4 py-2 rounded-lg hover:bg-[#E5EAF0] transition flex items-center gap-2"
                >
                    <FaFilter /> Réinitialiser
                </button>
            </div>

            {/* Tableau des stagiaires */}
            <div className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5]">
                {filteredStagiaires.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Aucun stagiaire ne correspond aux critères de recherche
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#41729F] text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">Nom & Prénom</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Institution</th>
                                <th className="px-6 py-3 text-left">
                                    <FaBuilding className="inline mr-1" /> Entreprise
                                </th>
                                <th className="px-6 py-3 text-left">
                                    <FaCalendarAlt className="inline mr-1" /> Période
                                </th>
                                <th className="px-6 py-3 text-center">Évalué</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5EAF0]">
                            {filteredStagiaires.map(stagiaire => (
                                <tr key={stagiaire.id} className="hover:bg-[#F5F7FA] transition">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-[#274472]">{stagiaire.nom} {stagiaire.prenom}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[#5885AF]">{stagiaire.email}</td>
                                    <td className="px-6 py-4">{stagiaire.institution || "-"}</td>
                                    <td className="px-6 py-4">
                                        {/* Utiliser directement le champ entreprise */}
                                        {stagiaire.entreprise || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Utiliser directement les champs dateDebut et dateFin */}
                                        {stagiaire.dateDebut && stagiaire.dateFin ? (
                                            <span>{stagiaire.dateDebut} → {stagiaire.dateFin}</span>
                                        ) : (
                                            <span className="text-gray-400 italic">Non définie</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {stagiaire.evaluated ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                                                    Oui
                                                </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                                                    Non
                                                </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link
                                            to={`/stagiaires/${stagiaire.id}`}
                                            className="text-[#41729F] hover:text-[#274472] flex items-center gap-1 justify-center"
                                        >
                                            <FaEye /> Voir
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}