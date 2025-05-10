import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaChalkboardTeacher, FaBuilding, FaEnvelope, FaEye } from "react-icons/fa";

export default function TuteursList() {
    const [tuteurs, setTuteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState("");
    const [entrepriseFilter, setEntrepriseFilter] = useState("");
    const [entreprises, setEntreprises] = useState([]);

    useEffect(() => {
        // Charger tous les tuteurs
        axios.get(`${API_URL}/api/tuteurs`)
            .then(res => {
                console.log("Données des tuteurs:", res.data);
                setTuteurs(res.data);

                // Extraire la liste des entreprises uniques pour le filtre
                const uniqueEntreprises = [...new Set(res.data.map(tuteur => tuteur.entreprise).filter(Boolean))];
                setEntreprises(uniqueEntreprises);
            })
            .catch(err => {
                console.error("Erreur de chargement des tuteurs:", err);
                setError("Erreur lors du chargement des tuteurs");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Filtrer les tuteurs
    const filteredTuteurs = tuteurs.filter(tuteur => {
        // Filtre par recherche (nom, prénom, email)
        const matchesSearch = searchTerm === "" ||
            tuteur.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tuteur.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tuteur.email?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtre par entreprise
        const matchesEntreprise = entrepriseFilter === "" ||
            tuteur.entreprise?.toLowerCase() === entrepriseFilter.toLowerCase();

        return matchesSearch && matchesEntreprise;
    });

    if (loading) return <div className="p-6 text-center">Chargement...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#41729F] mb-6 flex items-center gap-2">
                <FaChalkboardTeacher /> Gestion des Tuteurs
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

                {/* Filtre par entreprise */}
                <div className="md:w-1/4">
                    <label className="text-sm font-medium text-[#274472] block mb-1">Entreprise</label>
                    <select
                        value={entrepriseFilter}
                        onChange={(e) => setEntrepriseFilter(e.target.value)}
                        className="w-full p-2 rounded-lg border border-[#C3CFE2] focus:outline-none focus:ring-2 focus:ring-[#5885AF]"
                    >
                        <option value="">Toutes les entreprises</option>
                        {entreprises.map((entreprise, index) => (
                            <option key={index} value={entreprise}>
                                {entreprise}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bouton de réinitialisation des filtres */}
                <button
                    onClick={() => {
                        setSearchTerm("");
                        setEntrepriseFilter("");
                    }}
                    className="bg-[#F5F7FA] text-[#41729F] px-4 py-2 rounded-lg hover:bg-[#E5EAF0] transition flex items-center gap-2"
                >
                    <FaFilter /> Réinitialiser
                </button>
            </div>

            {/* Tableau des tuteurs */}
            <div className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5]">
                {filteredTuteurs.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Aucun tuteur ne correspond aux critères de recherche
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#41729F] text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">Nom & Prénom</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">
                                    <FaBuilding className="inline mr-1" /> Entreprise
                                </th>
                                <th className="px-6 py-3 text-center">Nb. Étudiants</th>
                                <th className="px-6 py-3 text-center">Nb. Appréciations</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5EAF0]">
                            {filteredTuteurs.map(tuteur => (
                                <tr key={tuteur.id} className="hover:bg-[#F5F7FA] transition">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-[#274472]">{tuteur.nom} {tuteur.prenom}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[#5885AF]">{tuteur.email}</td>
                                    <td className="px-6 py-4">{tuteur.entreprise || "-"}</td>
                                    <td className="px-6 py-4 text-center">
                                        {tuteur.nbStagiaires || 0}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {tuteur.nbAppreciations || 0}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link
                                            to={`/tuteurs/${tuteur.id}`}
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