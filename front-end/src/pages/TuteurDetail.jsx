import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import AppreciationModal from "../components/AppreciationModal";
import { FaChevronLeft, FaChalkboardTeacher, FaBuilding, FaEnvelope, FaEye, FaGraduationCap, FaFileAlt } from "react-icons/fa";

export default function TuteurDetail() {
    const { id } = useParams();
    const [tuteur, setTuteur] = useState(null);
    const [appreciations, setAppreciations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppreciation, setSelectedAppreciation] = useState(null);

    useEffect(() => {
        // Charger les données du tuteur
        axios.get(`${API_URL}/api/tuteurs/${id}`)
            .then(res => {
                console.log("Données du tuteur:", res.data);
                setTuteur(res.data);

                // Si le tuteur a des appréciations, les charger séparément
                if (res.data.nbAppreciations > 0) {
                    return axios.get(`${API_URL}/api/appreciation/tuteur/${id}`);
                } else {
                    return Promise.resolve({ data: [] });
                }
            })
            .then(res => {
                if (res.data) {
                    console.log("Appréciations du tuteur:", res.data);
                    setAppreciations(res.data);
                }
            })
            .catch(err => {
                console.error("Erreur de chargement:", err);
                setError("Erreur lors du chargement des données");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const openAppreciationModal = (appreciation) => {
        setSelectedAppreciation(appreciation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppreciation(null);
    };

    // Fonction pour déterminer le style de la valeur d'évaluation
    const getEvaluationValueStyle = (value) => {
        if (!value) return "text-gray-500 italic";

        // Si c'est un texte long comme une observation
        if (value.length > 20) {
            return "text-gray-700 italic text-sm";
        }

        // Pour les évaluations courtes
        switch(value) {
            case "Excellente":
                return "font-medium text-green-600";
            case "Acceptable":
                return "font-medium text-blue-600";
            case "Le juste nécessaire":
                return "font-medium text-yellow-600";
            default:
                return "font-medium text-[#41729F]";
        }
    };

    if (loading) return <div className="p-6 text-center">Chargement...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!tuteur) return <div className="p-6 text-center">Tuteur non trouvé</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
        >
            <Link to="/tuteurs" className="flex items-center text-[#41729F] mb-6 hover:underline">
                <FaChevronLeft className="mr-2" /> Retour à la liste
            </Link>

            <div className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5] mb-6">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-[#41729F] mb-4 flex items-center gap-2">
                        <FaChalkboardTeacher /> {tuteur.nom} {tuteur.prenom}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-start gap-2">
                            <FaEnvelope className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Email</div>
                                <div>{tuteur.email}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FaBuilding className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Entreprise</div>
                                <div>{tuteur.entreprise || "-"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-[#F5F7FA] p-4 rounded-lg border border-[#D4E1F5]">
                            <div className="text-sm font-medium text-[#274472]">Stagiaires encadrés</div>
                            <div className="text-2xl font-bold text-[#41729F]">{tuteur.nbStagiaires}</div>
                        </div>
                        <div className="bg-[#F5F7FA] p-4 rounded-lg border border-[#D4E1F5]">
                            <div className="text-sm font-medium text-[#274472]">Appréciations données</div>
                            <div className="text-2xl font-bold text-[#41729F]">{tuteur.nbAppreciations}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appréciations données par le tuteur */}
            <h2 className="text-xl font-bold text-[#41729F] mb-4">Appréciations données</h2>

            {appreciations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {appreciations.map((appreciation, index) => (
                        <div
                            key={index}
                            className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5]"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaGraduationCap className="text-[#41729F]" />
                                        <div>
                                            <div className="font-bold text-[#274472]">
                                                {appreciation.stagiaireNom} {appreciation.stagiairePrenom}
                                            </div>
                                            <div className="text-sm text-[#5885AF]">
                                                {appreciation.stagiaireEmail}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openAppreciationModal(appreciation)}
                                        className="text-[#41729F] hover:text-[#274472] flex items-center gap-1 text-sm"
                                    >
                                        <FaEye /> Détails
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <div className="text-sm font-medium text-[#274472] mb-1">Stage</div>
                                    <div className="bg-[#F5F7FA] p-3 rounded-lg">
                                        <div className="font-medium">{appreciation.entreprise || "-"}</div>
                                        <div className="text-sm">
                                            {appreciation.dateDebut && appreciation.dateFin ? (
                                                <span>{appreciation.dateDebut} → {appreciation.dateFin}</span>
                                            ) : (
                                                <span className="italic text-gray-400">Dates non définies</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Résumé des évaluations */}
                                <div>
                                    <div className="text-sm font-medium text-[#274472] mb-1">Évaluations</div>
                                    {appreciation.evaluations && appreciation.evaluations.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-2">
                                            {appreciation.evaluations.slice(0, 4).map((evaluation, evalIdx) => (
                                                <div key={evalIdx} className="p-2 bg-[#F5F7FA] rounded">
                                                    <div className="text-sm text-[#274472]">{evaluation.categorie}</div>
                                                    <div className={`text-right ${getEvaluationValueStyle(evaluation.valeur)}`}>
                                                        {evaluation.valeur && evaluation.valeur.length > 20
                                                            ? `${evaluation.valeur.substring(0, 20)}...`
                                                            : evaluation.valeur}
                                                    </div>
                                                </div>
                                            ))}
                                            {appreciation.evaluations.length > 4 && (
                                                <div className="text-center text-sm text-[#5885AF] italic">
                                                    + {appreciation.evaluations.length - 4} autres évaluations
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center p-2 bg-[#F5F7FA] rounded-lg text-gray-500 italic text-sm">
                                            Aucune évaluation disponible
                                        </div>
                                    )}
                                </div>

                                {/* Résumé des compétences */}
                                {appreciation.competences && appreciation.competences.length > 0 && (
                                    <div className="mt-4">
                                        <div className="text-sm font-medium text-[#274472] mb-1">Compétences</div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {appreciation.competences.slice(0, 3).map((comp, compIdx) => (
                                                <div key={compIdx} className="flex justify-between items-center p-2 bg-[#F5F7FA] rounded">
                                                    <div className="text-sm flex-1 mr-2">{comp.intitule}</div>
                                                    <div className="flex-shrink-0 px-2 py-0.5 bg-[#41729F] text-white rounded text-xs">
                                                        {comp.note}
                                                    </div>
                                                </div>
                                            ))}
                                            {appreciation.competences.length > 3 && (
                                                <div className="text-center text-sm text-[#5885AF] italic p-1">
                                                    + {appreciation.competences.length - 3} autres compétences
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-6 bg-[#F5F7FA] rounded-xl text-gray-500 italic">
                    Ce tuteur n'a pas encore donné d'appréciations
                </div>
            )}

            {/* Modal pour afficher les détails d'une appréciation */}
            <AppreciationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                appreciation={selectedAppreciation}
            />
        </motion.div>
    );
}