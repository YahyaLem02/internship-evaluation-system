import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import { FaChevronLeft, FaGraduationCap, FaBuilding, FaCalendarAlt, FaEnvelope, FaUniversity, FaEye, FaFileAlt } from "react-icons/fa";

export default function StagiaireDetail() {
    const { id } = useParams();
    const [stagiaire, setStagiaire] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppreciation, setSelectedAppreciation] = useState(null);

    useEffect(() => {
        axios.get(`${API_URL}/api/stagaire/${id}`) // Correction de stagaire à stagiaires
            .then(res => {
                console.log("Données du stagiaire:", res.data);
                setStagiaire(res.data);
            })
            .catch(err => {
                console.error("Erreur de chargement du stagiaire:", err);
                setError("Erreur lors du chargement du stagiaire");
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

    if (loading) return <div className="p-6 text-center">Chargement...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!stagiaire) return <div className="p-6 text-center">Stagiaire non trouvé</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
        >
            <Link to="/stagiaires" className="flex items-center text-[#41729F] mb-6 hover:underline">
                <FaChevronLeft className="mr-2" /> Retour à la liste
            </Link>

            <div className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5] mb-6">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-[#41729F] mb-4 flex items-center gap-2">
                        <FaGraduationCap /> {stagiaire.nom} {stagiaire.prenom}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-start gap-2">
                            <FaEnvelope className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Email</div>
                                <div>{stagiaire.email}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FaUniversity className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Institution</div>
                                <div>{stagiaire.institution || "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Afficher les informations principales du stage */}
            <div className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5] mb-6">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#41729F] mb-4">Stage actuel</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-start gap-2">
                            <FaBuilding className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Entreprise</div>
                                <div>{stagiaire.entreprise || "-"}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FaCalendarAlt className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Période</div>
                                <div>
                                    {stagiaire.dateDebut && stagiaire.dateFin ? (
                                        <span>{stagiaire.dateDebut} → {stagiaire.dateFin}</span>
                                    ) : (
                                        <span className="text-gray-400 italic">Non définie</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appréciations du stagiaire */}
            <h2 className="text-xl font-bold text-[#41729F] mb-4">Appréciations</h2>

            {stagiaire.appreciations && stagiaire.appreciations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stagiaire.appreciations.map((appreciation, index) => (
                        <div key={index} className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5]">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-medium">
                                            {appreciation.tuteurNom} {appreciation.tuteurPrenom}
                                        </div>
                                        <div className="text-sm text-[#5885AF]">
                                            {appreciation.tuteurEmail}
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => openAppreciationModal(appreciation)}
                                            className="text-[#41729F] hover:text-[#274472] flex items-center gap-1 text-sm"
                                        >
                                            <FaEye /> Détails
                                        </button>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <div className="flex justify-between mb-1">
                                        <span>Entreprise:</span>
                                        <span className="font-medium">{appreciation.tuteurEntreprise || "-"}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#5885AF]">
                                        <FaFileAlt className="text-xs" />
                                        {appreciation.evaluations ?
                                            `${appreciation.evaluations.length} évaluations` :
                                            "Aucune évaluation"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-6 bg-[#F5F7FA] rounded-xl text-gray-500 italic">
                    Ce stagiaire n'a pas encore d'appréciations
                </div>
            )}

            {/* Stages du stagiaire si disponibles */}
            {stagiaire.stages && stagiaire.stages.length > 0 && (
                <>
                    <h2 className="text-xl font-bold text-[#41729F] mb-4 mt-6">Historique des stages</h2>

                    {stagiaire.stages.map(stage => (
                        <div key={stage.id} className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5] mb-6">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#41729F]">{stage.entreprise}</h3>
                                        <div className="text-[#5885AF] flex items-center gap-1 mt-1">
                                            <FaCalendarAlt className="text-sm" />
                                            {stage.dateDebut && stage.dateFin ? (
                                                <span>{stage.dateDebut} → {stage.dateFin}</span>
                                            ) : (
                                                <span className="italic">Dates non définies</span>
                                            )}
                                        </div>
                                    </div>

                                    {stage.stageAnneeId && (
                                        <Link
                                            to={`/stage-annee/${stage.stageAnneeId}`}
                                            className="bg-[#F5F7FA] text-[#41729F] px-3 py-1 rounded-lg hover:bg-[#E5EAF0] transition text-sm"
                                        >
                                            Année: {stage.anneeUniversitaire}
                                        </Link>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <div className="text-sm font-medium text-[#274472] mb-1">Description</div>
                                    <div className="bg-[#F5F7FA] p-3 rounded-lg">
                                        {stage.description || <span className="italic text-gray-400">Aucune description disponible</span>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="text-sm font-medium text-[#274472] mb-1">Objectif</div>
                                    <div className="bg-[#F5F7FA] p-3 rounded-lg">
                                        {stage.objectif || <span className="italic text-gray-400">Aucun objectif disponible</span>}
                                    </div>
                                </div>

                                {/* Appréciations du stage si disponibles et différentes des appréciations principales */}
                                {stage.appreciations && stage.appreciations.length > 0 && (
                                    <div>
                                        <h4 className="text-md font-bold text-[#41729F] mb-2">Appréciations pour ce stage</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {stage.appreciations.map((appreciation, index) => (
                                                <div key={index} className="border border-[#D4E1F5] rounded-lg p-4 bg-white">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <div className="font-medium">
                                                                {appreciation.tuteurNom} {appreciation.tuteurPrenom}
                                                            </div>
                                                            <div className="text-sm text-[#5885AF]">
                                                                {appreciation.tuteurEmail}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <button
                                                                onClick={() => openAppreciationModal(appreciation)}
                                                                className="text-[#41729F] hover:text-[#274472] flex items-center gap-1 text-sm"
                                                            >
                                                                <FaEye /> Détails
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </>
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

// Composant Modal pour l'appréciation reste inchangé
function AppreciationModal({ isOpen, onClose, appreciation }) {
    if (!isOpen || !appreciation) return null;

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={stopPropagation}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2 pb-4 border-b border-gray-200">
                        <h3 className="text-2xl font-bold text-[#41729F]">Détails de l'appréciation</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Informations du tuteur */}
                    <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                        <h4 className="text-xl font-semibold text-[#41729F] mb-2">Tuteur</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <span className="font-medium text-[#274472]">Nom:</span>
                                <span className="ml-2">{appreciation.tuteurNom} {appreciation.tuteurPrenom}</span>
                            </div>
                            <div>
                                <span className="font-medium text-[#274472]">Email:</span>
                                <span className="ml-2">{appreciation.tuteurEmail}</span>
                            </div>
                            {appreciation.tuteurEntreprise && (
                                <div>
                                    <span className="font-medium text-[#274472]">Entreprise:</span>
                                    <span className="ml-2">{appreciation.tuteurEntreprise}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description et objectif du stage */}
                    {(appreciation.stageDescription || appreciation.stageObjectif) && (
                        <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                            <h4 className="text-xl font-semibold text-[#41729F] mb-2">Stage</h4>
                            {appreciation.stageDescription && (
                                <div className="mb-3">
                                    <span className="font-medium text-[#274472]">Description:</span>
                                    <p className="mt-1">{appreciation.stageDescription}</p>
                                </div>
                            )}
                            {appreciation.stageObjectif && (
                                <div>
                                    <span className="font-medium text-[#274472]">Objectif:</span>
                                    <p className="mt-1">{appreciation.stageObjectif}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Évaluations */}
                    {appreciation.evaluations && appreciation.evaluations.length > 0 && (
                        <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                            <h4 className="text-xl font-semibold text-[#41729F] mb-2">Évaluations</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {appreciation.evaluations.map((evaluation, evalIndex) => (
                                    <div key={evalIndex} className="flex justify-between p-2 bg-white rounded shadow-sm">
                                        <span>{evaluation.categorie}</span>
                                        <span className="font-bold text-[#41729F]">{evaluation.valeur}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Compétences */}
                    {appreciation.competences && appreciation.competences.length > 0 && (
                        <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                            <h4 className="text-xl font-semibold text-[#41729F] mb-2">Compétences</h4>
                            {appreciation.competences.map((comp, compIndex) => (
                                <div key={compIndex} className="mb-4 p-3 bg-white rounded shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">{comp.intitule}</span>
                                        <span className="font-bold px-2 py-1 bg-[#41729F] text-white rounded-lg">{comp.note}</span>
                                    </div>

                                    {comp.categories && comp.categories.length > 0 && (
                                        <div className="mt-2 border-t pt-2">
                                            <div className="font-medium text-[#274472] text-sm mb-1">Détails:</div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {comp.categories.map((cat, catIndex) => (
                                                    <div key={catIndex} className="flex justify-between text-sm p-1 bg-[#F5F7FA] rounded">
                                                        <span>{cat.intitule}</span>
                                                        <span>{cat.valeur}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            <FaFileAlt /> Imprimer
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}