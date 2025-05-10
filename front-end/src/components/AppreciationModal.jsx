import {motion} from "framer-motion";
import {FaFileAlt} from "react-icons/fa";

export default  function AppreciationModal({ isOpen, onClose, appreciation }) {
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
                        </div>
                    </div>

                    {/* Description et objectif du stage */}
                    <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                        <h4 className="text-xl font-semibold text-[#41729F] mb-2">Stage</h4>
                        <div className="mb-3">
                            <span className="font-medium text-[#274472]">Entreprise:</span>
                            <p className="mt-1">{appreciation.entreprise || "-"}</p>
                        </div>
                        <div className="mb-3">
                            <span className="font-medium text-[#274472]">Période:</span>
                            <p className="mt-1">
                                {appreciation.dateDebut && appreciation.dateFin ? (
                                    `${appreciation.dateDebut} → ${appreciation.dateFin}`
                                ) : (
                                    "Dates non définies"
                                )}
                            </p>
                        </div>
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

                    {/* Évaluations */}
                    {appreciation.evaluations && appreciation.evaluations.length > 0 && (
                        <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                            <h4 className="text-xl font-semibold text-[#41729F] mb-2">Évaluations</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {appreciation.evaluations.map((evaluation, evalIdx) => (
                                    <div key={evalIdx} className="flex justify-between p-2 bg-white rounded shadow-sm">
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
                            {appreciation.competences.map((comp, compIdx) => (
                                <div key={compIdx} className="mb-4 p-3 bg-white rounded shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">{comp.intitule}</span>
                                        <span className="font-bold px-2 py-1 bg-[#41729F] text-white rounded-lg">{comp.note}</span>
                                    </div>

                                    {comp.categories && comp.categories.length > 0 && (
                                        <div className="mt-2 border-t pt-2">
                                            <div className="font-medium text-[#274472] text-sm mb-1">Détails:</div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {comp.categories.map((cat, catIdx) => (
                                                    <div key={catIdx} className="flex justify-between text-sm p-1 bg-[#F5F7FA] rounded">
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
