import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../api';
import { FaUserGraduate, FaBuilding, FaCalendarAlt, FaEnvelope, FaUniversity, FaClipboardCheck, FaExclamationCircle } from 'react-icons/fa';
import AppreciationModal from '../components/AppreciationModal';

export default function StagiareDashboard() {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppreciation, setSelectedAppreciation] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/stagaire/me`);
                console.log("Données du stagiaire:", response.data);
                setStudentData(response.data);
            } catch (err) {
                console.error("Erreur lors du chargement des données du stagiaire:", err);
                setError("Impossible de charger vos informations. Veuillez réessayer ultérieurement.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    const openAppreciationModal = (appreciation) => {
        // Enrichir l'objet appreciation avec les données du stagiaire
        const enrichedAppreciation = {
            ...appreciation,
            stagiaireNom: studentData.nom,
            stagiairePrenom: studentData.prenom,
            stagiaireEmail: studentData.email,
            entreprise: studentData.entreprise,
            dateDebut: studentData.dateDebut,
            dateFin: studentData.dateFin
        };

        setSelectedAppreciation(enrichedAppreciation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppreciation(null);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#41729F]"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <FaExclamationCircle className="text-6xl text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-[#274472] mb-2">Une erreur est survenue</h1>
            <p className="text-[#5885AF]">{error}</p>
        </div>
    );

    if (!studentData) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <FaExclamationCircle className="text-6xl text-yellow-500 mb-4" />
            <h1 className="text-2xl font-bold text-[#274472] mb-2">Aucune donnée disponible</h1>
            <p className="text-[#5885AF]">Vos informations n'ont pas pu être récupérées.</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
        >
            <h1 className="text-2xl font-bold text-[#41729F] mb-6 flex items-center">
                <FaUserGraduate className="mr-2" />
                Bienvenue, {studentData.prenom} {studentData.nom}
            </h1>

            {/* Informations personnelles */}
            <div className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5] mb-6">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#41729F] mb-4">Informations personnelles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                            <FaUserGraduate className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Nom complet</div>
                                <div>{studentData.prenom} {studentData.nom}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FaEnvelope className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Email</div>
                                <div>{studentData.email}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FaUniversity className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Institution</div>
                                <div>{studentData.institution || "Non spécifiée"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informations du stage */}
            <div className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5] mb-6">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#41729F] mb-4">Stage actuel</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                            <FaBuilding className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Entreprise</div>
                                <div>{studentData.entreprise || "Non spécifiée"}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FaCalendarAlt className="mt-1 text-[#5885AF]" />
                            <div>
                                <div className="text-sm font-medium text-[#274472]">Période</div>
                                <div>
                                    {studentData.dateDebut && studentData.dateFin ? (
                                        <span>{studentData.dateDebut} → {studentData.dateFin}</span>
                                    ) : (
                                        <span className="text-gray-400 italic">Non définie</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lien d'appréciation si disponible */}
                    {studentData.appreciationToken && (
                        <div className="mt-4 p-4 bg-[#F5F7FA] rounded-lg">
                            <h3 className="font-semibold text-[#41729F] mb-2">Lien d'appréciation pour les tuteurs</h3>
                            <p className="text-sm text-[#5885AF] mb-2">Partagez ce lien avec votre tuteur pour qu'il puisse vous évaluer :</p>
                            <div className="bg-white p-3 rounded-lg border border-[#D4E1F5] font-mono text-sm break-all">
                                {`${window.location.origin}/appreciation/${studentData.appreciationToken}`}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Appréciations */}
            <div className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5] mb-6">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#41729F] mb-4 flex items-center">
                        <FaClipboardCheck className="mr-2" /> Appréciations
                    </h2>

                    {studentData.appreciations && studentData.appreciations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {studentData.appreciations.map((appreciation, index) => (
                                <div key={index} className="bg-white/70 rounded-lg shadow-sm p-4 border border-[#D4E1F5]">
                                    <div className="mb-2">
                                        <div className="font-semibold text-[#41729F]">
                                            {appreciation.tuteurNom} {appreciation.tuteurPrenom}
                                        </div>
                                        <div className="text-sm text-[#5885AF]">{appreciation.tuteurEmail}</div>
                                        <div className="text-sm text-[#5885AF]">{appreciation.tuteurEntreprise}</div>
                                    </div>

                                    <div className="mt-3">
                                        {/* Résumé des évaluations */}
                                        {appreciation.evaluations && appreciation.evaluations.length > 0 && (
                                            <div className="mb-2">
                                                <div className="text-sm font-semibold text-[#274472] mb-1">Évaluations</div>
                                                <div className="text-xs text-[#5885AF]">{appreciation.evaluations.length} critères évalués</div>
                                            </div>
                                        )}

                                        {/* Résumé des compétences */}
                                        {appreciation.competences && appreciation.competences.length > 0 && (
                                            <div className="mb-2">
                                                <div className="text-sm font-semibold text-[#274472] mb-1">Compétences</div>
                                                <div className="text-xs text-[#5885AF]">{appreciation.competences.length} compétences évaluées</div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => openAppreciationModal(appreciation)}
                                        className="mt-3 px-3 py-1 bg-[#41729F] text-white text-sm rounded-md hover:bg-[#5885AF] transition"
                                    >
                                        Voir les détails
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#F5F7FA] rounded-lg p-6 text-center">
                            <FaExclamationCircle className="text-4xl text-[#5885AF] mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-[#41729F] mb-2">Aucune appréciation pour le moment</h3>
                            <p className="text-[#5885AF]">
                                Vous n'avez pas encore reçu d'appréciations de la part de vos tuteurs. Partagez votre lien d'appréciation avec votre tuteur pour recevoir une évaluation.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Historique des stages (si disponible) */}
            {studentData.stages && studentData.stages.length > 0 && (
                <div className="bg-white/70 rounded-xl shadow-md overflow-hidden border border-[#D4E1F5]">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-[#41729F] mb-4">Historique des stages</h2>

                        <div className="space-y-4">
                            {studentData.stages.map((stage, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border border-[#D4E1F5]">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-semibold text-[#41729F]">{stage.entreprise || "Entreprise non spécifiée"}</div>
                                            <div className="text-sm text-[#5885AF]">
                                                {stage.dateDebut && stage.dateFin ? (
                                                    <span>{stage.dateDebut} → {stage.dateFin}</span>
                                                ) : (
                                                    <span className="italic">Dates non définies</span>
                                                )}
                                            </div>
                                        </div>
                                        {stage.anneeUniversitaire && (
                                            <div className="bg-[#F5F7FA] px-2 py-1 rounded text-xs font-semibold text-[#41729F]">
                                                {stage.anneeUniversitaire}
                                            </div>
                                        )}
                                    </div>

                                    {stage.description && (
                                        <div className="mt-3">
                                            <div className="text-sm font-semibold text-[#274472]">Description:</div>
                                            <div className="text-sm mt-1 text-[#5885AF]">{stage.description}</div>
                                        </div>
                                    )}

                                    {stage.objectif && (
                                        <div className="mt-3">
                                            <div className="text-sm font-semibold text-[#274472]">Objectif:</div>
                                            <div className="text-sm mt-1 text-[#5885AF]">{stage.objectif}</div>
                                        </div>
                                    )}

                                    {/* Afficher les appréciations du stage si disponibles */}
                                    {stage.appreciations && stage.appreciations.length > 0 && (
                                        <div className="mt-3">
                                            <div className="text-sm font-semibold text-[#274472] mb-2">Appréciations:</div>
                                            <div className="space-y-2">
                                                {stage.appreciations.map((appreciation, appIndex) => (
                                                    <div key={appIndex} className="text-sm">
                                                        <div className="font-medium">{appreciation.tuteurNom} {appreciation.tuteurPrenom}</div>
                                                        <button
                                                            onClick={() => openAppreciationModal(appreciation)}
                                                            className="mt-1 text-[#41729F] underline text-xs hover:text-[#5885AF]"
                                                        >
                                                            Voir les détails
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal pour les détails d'appréciation */}
            <AppreciationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                appreciation={selectedAppreciation}
            />
        </motion.div>
    );
}