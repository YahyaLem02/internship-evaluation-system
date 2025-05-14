import { motion } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";

export default function AppreciationModal({ isOpen, onClose, appreciation }) {
    if (!isOpen || !appreciation) return null;

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    // Fonction pour formater les dates en format français
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Fonction pour déterminer la couleur de fond en fonction de la valeur d'évaluation
    const getEvaluationBadgeColor = (value) => {
        switch (value) {
            case "Excellente":
                return "bg-green-600 text-white";
            case "Acceptable":
                return "bg-blue-500 text-white";
            case "Le juste nécessaire":
                return "bg-yellow-500 text-white";
            default:
                // Si c'est un texte long (comme une observation), on ne met pas de fond coloré
                return value && value.length > 20 ? "text-gray-700" : "bg-gray-500 text-white";
        }
    };

    // Fonction pour déterminer la couleur de badge pour les compétences
    const getCompetenceBadgeColor = (note) => {
        const noteNum = parseInt(note);
        if (isNaN(noteNum)) return "bg-gray-500";
        if (noteNum >= 15) return "bg-green-600";
        if (noteNum >= 10) return "bg-blue-500";
        if (noteNum >= 5) return "bg-yellow-500";
        return "bg-red-500";
    };

    // Fonction pour déterminer la couleur de badge pour les catégories
    const getCategoryBadgeColor = (value) => {
        switch(value) {
            case "AUTONOME +":
                return "bg-green-100 text-green-800 border border-green-200";
            case "AUTONOME":
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case "DÉBUTANT":
                return "bg-yellow-100 text-yellow-800 border border-yellow-200";
            case "NA":
                return "bg-gray-100 text-gray-600 border border-gray-200";
            default:
                return "bg-purple-100 text-purple-800 border border-purple-200";
        }
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

                    {/* Informations du stagiaire */}
                    <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                        <h4 className="text-xl font-semibold text-[#41729F] mb-2">Stagiaire</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <span className="font-medium text-[#274472]">Nom:</span>
                                <span className="ml-2">{appreciation.stagiaireNom} {appreciation.stagiairePrenom}</span>
                            </div>
                            <div>
                                <span className="font-medium text-[#274472]">Email:</span>
                                <span className="ml-2">{appreciation.stagiaireEmail}</span>
                            </div>
                            {appreciation.institution && (
                                <div>
                                    <span className="font-medium text-[#274472]">Institution:</span>
                                    <span className="ml-2">{appreciation.institution}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description et objectif du stage */}
                    <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                        <h4 className="text-xl font-semibold text-[#41729F] mb-2">Stage</h4>
                        <div className="mb-3">
                            <span className="font-medium text-[#274472]">Entreprise:</span>
                            <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-lg inline-block mt-1">
                                {appreciation.entreprise || "-"}
                            </span>
                        </div>
                        <div className="mb-3">
                            <span className="font-medium text-[#274472]">Période:</span>
                            <div className="flex items-center flex-wrap gap-2 mt-1">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-lg">
                                    Du: {formatDate(appreciation.dateDebut) || "Non définie"}
                                </span>
                                <span className="text-gray-500">→</span>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-lg">
                                    Au: {formatDate(appreciation.dateFin) || "Non définie"}
                                </span>
                            </div>
                        </div>
                        {appreciation.stageDescription && (
                            <div className="mb-3">
                                <span className="font-medium text-[#274472]">Description:</span>
                                <p className="mt-1 p-2 bg-white/80 rounded-lg">{appreciation.stageDescription}</p>
                            </div>
                        )}
                        {appreciation.stageObjectif && (
                            <div>
                                <span className="font-medium text-[#274472]">Objectif:</span>
                                <p className="mt-1 p-2 bg-white/80 rounded-lg">{appreciation.stageObjectif}</p>
                            </div>
                        )}
                    </div>

                    {/* Évaluations */}
                    {appreciation.evaluations && appreciation.evaluations.length > 0 && (
                        <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                            <h4 className="text-xl font-semibold text-[#41729F] mb-2">Évaluations</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {appreciation.evaluations.map((evaluation, evalIdx) => {
                                    // Vérifier si la valeur est un texte long (comme des observations)
                                    const isLongText = evaluation.valeur && evaluation.valeur.length > 20;

                                    return (
                                        <div key={evalIdx} className="p-3 bg-white rounded-lg shadow-sm">
                                            <div className="font-medium text-[#274472] mb-2">
                                                {evaluation.categorie}
                                            </div>
                                            {isLongText ? (
                                                // Pour les textes longs (observations), afficher comme paragraphe
                                                <div className="mt-2 p-2 bg-gray-50 rounded-lg text-gray-700 italic text-sm">
                                                    {evaluation.valeur}
                                                </div>
                                            ) : (
                                                // Pour les évaluations courtes, afficher comme badge
                                                <div className="flex justify-end">
                                                    <span className={`px-3 py-1 rounded-full font-medium ${getEvaluationBadgeColor(evaluation.valeur)}`}>
                                                        {evaluation.valeur}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Compétences */}
                    {appreciation.competences && appreciation.competences.length > 0 && (
                        <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                            <h4 className="text-xl font-semibold text-[#41729F] mb-2">Compétences</h4>
                            {appreciation.competences.map((comp, compIdx) => (
                                <div key={compIdx} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                                    <div className="flex items-center mb-3">
                                        <div className="flex-1">
                                            <h5 className="text-lg font-semibold text-[#274472]">{comp.intitule}</h5>
                                        </div>
                                        <div className="ml-2">
                                            <span className={`px-3 py-1 rounded-lg font-bold text-white ${getCompetenceBadgeColor(comp.note)}`}>
                                                {comp.note}
                                            </span>
                                        </div>
                                    </div>

                                    {comp.categories && comp.categories.length > 0 && (
                                        <div className="mt-3 border-t border-gray-200 pt-3">
                                            <div className="font-medium text-[#5885AF] text-sm mb-2">Critères d'évaluation:</div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {comp.categories.map((cat, catIdx) => (
                                                    <div key={catIdx}
                                                         className="p-3 bg-gray-50 rounded-lg">
                                                        <div className="mb-1 font-medium text-gray-700 text-sm line-clamp-2">
                                                            {cat.intitule}
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <span className={`px-2 py-1 rounded-md text-sm font-medium ${getCategoryBadgeColor(cat.valeur)}`}>
                                                                {cat.valeur}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(!comp.categories || comp.categories.length === 0) && (
                                        <div className="text-sm text-gray-500 italic mt-2">
                                            Aucun critère spécifié pour cette compétence
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