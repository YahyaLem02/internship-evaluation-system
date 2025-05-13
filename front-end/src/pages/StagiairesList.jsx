import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaGraduationCap, FaBuilding, FaCalendarAlt, FaEye, FaTrash, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

export default function StagiairesList() {
    const [stagiaires, setStagiaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [stagiaireToDelete, setStagiaireToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // État pour l'alerte de succès
    const [successAlert, setSuccessAlert] = useState({ show: false, message: "" });

    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState("");
    const [evaluationFilter, setEvaluationFilter] = useState("all"); // 'all', 'evaluated', 'non-evaluated'

    // Fonction pour afficher l'alerte de succès temporairement
    const showSuccessAlert = (message) => {
        setSuccessAlert({ show: true, message });
        // Masquer l'alerte après 5 secondes
        setTimeout(() => {
            setSuccessAlert({ show: false, message: "" });
        }, 5000);
    };

    const fetchStagiaires = () => {
        setLoading(true);
        axios.get(`${API_URL}/api/stagaire`)
            .then(res => {
                console.log("Données des stagiaires:", res.data);
                setStagiaires(res.data);
            })
            .catch(err => {
                console.error("Erreur de chargement des stagiaires:", err);
                setError("Erreur lors du chargement des stagiaires");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        // Charger tous les stagiaires
        fetchStagiaires();
    }, []);

    // Fonction pour supprimer un stagiaire
    const deleteStagiaire = async (id) => {
        setDeleteLoading(true);
        try {
            await axios.delete(`${API_URL}/api/stagaire/${id}`);

            // Rafraîchir la liste après suppression
            fetchStagiaires();

            // Fermer le modal
            setDeleteModalOpen(false);
            setStagiaireToDelete(null);

            // Afficher l'alerte de succès
            showSuccessAlert(`Le stagiaire a été supprimé avec succès.`);
        } catch (err) {
            console.error("Erreur lors de la suppression du stagiaire:", err);
            setError("Une erreur est survenue lors de la suppression");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Ouvrir le modal de confirmation de suppression
    const openDeleteModal = (stagiaire) => {
        setStagiaireToDelete(stagiaire);
        setDeleteModalOpen(true);
    };

    // Filtrer les stagiaires
    const filteredStagiaires = stagiaires.filter(stagiaire => {
        // Filtre par recherche (nom, prénom, email)
        const matchesSearch = searchTerm === "" ||
            stagiaire.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stagiaire.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stagiaire.email?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtre par évaluation
        const matchesEvaluation = evaluationFilter === "all" ||
            (evaluationFilter === "evaluated" && stagiaire.evaluated) ||
            (evaluationFilter === "non-evaluated" && !stagiaire.evaluated);

        return matchesSearch && matchesEvaluation;
    });

    if (loading) return (
        <div className="p-6 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#41729F]"></div>
        </div>
    );

    if (error) return (
        <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">
            <FaExclamationTriangle className="inline-block mr-2" />
            {error}
        </div>
    );

    return (
        <div className="p-6 relative">
            {/* Alerte de succès */}
            {successAlert.show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 flex items-center"
                >
                    <FaCheckCircle className="text-green-500 mr-2" />
                    {successAlert.message}
                </motion.div>
            )}

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
                                        {stagiaire.entreprise || "-"}
                                    </td>
                                    <td className="px-6 py-4">
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
                                        <div className="flex items-center justify-center gap-3">
                                            <Link
                                                to={`/stagiaires/${stagiaire.id}`}
                                                className="text-[#41729F] hover:text-[#274472] flex items-center gap-1"
                                            >
                                                <FaEye /> Voir
                                            </Link>
                                            {/* Afficher le bouton de suppression uniquement pour les stagiaires non évalués */}
                                            {!stagiaire.evaluated && (
                                                <button
                                                    onClick={() => openDeleteModal(stagiaire)}
                                                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                                >
                                                    <FaTrash /> Supprimer
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de confirmation de suppression */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-xl font-bold text-[#41729F] mb-4 flex items-center gap-2">
                            <FaExclamationTriangle className="text-red-500" /> Confirmation de suppression
                        </h3>
                        <p className="mb-6">
                            Êtes-vous sûr de vouloir supprimer le stagiaire <strong>{stagiaireToDelete?.prenom} {stagiaireToDelete?.nom}</strong> ?
                            Cette action est irréversible.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 font-medium hover:bg-gray-300 transition"
                                disabled={deleteLoading}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => deleteStagiaire(stagiaireToDelete.id)}
                                className="px-4 py-2 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition flex items-center gap-2"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                        Suppression...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash /> Supprimer
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}