import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import { FaChevronLeft, FaUserGraduate, FaCalendarAlt, FaBuilding, FaPrint } from "react-icons/fa";

export default function StageAnneeDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppreciation, setSelectedAppreciation] = useState(null);
    const [evaluatedStudents, setEvaluatedStudents] = useState([]);
    const [nonEvaluatedStudents, setNonEvaluatedStudents] = useState([]);

    useEffect(() => {
        // Load StageAnnee details
        axios.get(`${API_URL}/api/stageAnnee/${id}`)
            .then(res => setData(res.data))
            .catch(() => setErr("Erreur de chargement"));

        // Load students with evaluations
        axios.get(`${API_URL}/api/stageAnnee/${id}/students-with-evaluations`)
            .then(res => {
                console.log("Données reçues de l'API:", res.data);
                setStudents(res.data);

                // Filtrer les étudiants ici
                const evaluated = res.data.filter(student => {
                    const hasAppreciations = student.appreciations && Array.isArray(student.appreciations) && student.appreciations.length > 0;
                    console.log(`Étudiant ${student.nom}: hasAppreciations=${hasAppreciations}`);
                    return hasAppreciations;
                });

                const nonEvaluated = res.data.filter(student => {
                    const noAppreciations = !student.appreciations || !Array.isArray(student.appreciations) || student.appreciations.length === 0;
                    console.log(`Étudiant ${student.nom}: noAppreciations=${noAppreciations}`);
                    return noAppreciations;
                });

                console.log("Étudiants évalués:", evaluated);
                console.log("Étudiants non évalués:", nonEvaluated);

                setEvaluatedStudents(evaluated);
                setNonEvaluatedStudents(nonEvaluated);
            })
            .catch(error => {
                console.error("Erreur lors du chargement des étudiants:", error);
                setErr("Erreur de chargement des étudiants");
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Fonction pour ouvrir la modale avec une appréciation spécifique
    const openAppreciationModal = (appreciation) => {
        setSelectedAppreciation(appreciation);
        setIsModalOpen(true);
    };

    // Fonction pour fermer la modale
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppreciation(null);
    };

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
                <div className="font-semibold text-[#274472] mb-2">Lien d'inscription :</div>
                <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#F5F7FA] text-[#41729F] px-3 py-2 rounded-xl font-mono hover:bg-[#C3CFE2] transition break-all"
                >
                    {publicUrl}
                </a>
            </div>

            {/* Non-Evaluated Students Section */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-[#41729F] mb-3 flex items-center gap-2">
                    <FaUserGraduate /> Étudiants non évalués
                </h3>
                {nonEvaluatedStudents.length === 0 ? (
                    <div className="italic text-gray-400">Tous les étudiants ont été évalués.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-[#C3CFE2] bg-white/70 rounded-xl shadow-xl">
                            <thead className="bg-[#41729F] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold">Nom</th>
                                <th className="px-6 py-4 text-left font-bold">Prénom</th>
                                <th className="px-6 py-4 text-left font-bold">Email</th>
                                <th className="px-6 py-4 text-left font-bold"><FaBuilding className="inline-block mr-1" /> Entreprise</th>
                                <th className="px-6 py-4 text-left font-bold"><FaCalendarAlt className="inline-block mr-1" /> Période</th>
                                <th className="px-6 py-4 text-left font-bold">Lien d'appréciation</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5EAF0]">
                            {nonEvaluatedStudents.map(student => (
                                <tr key={student.id} className="hover:bg-[#F5F7FA] transition">
                                    <td className="px-6 py-4 font-semibold text-[#274472]">{student.nom}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.prenom}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.email}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.entreprise || <span className="italic text-gray-400">—</span>}</td>
                                    <td className="px-6 py-4 text-[#274472]">
                                        {student.dateDebut && student.dateFin ? (
                                            <span>{student.dateDebut} → {student.dateFin}</span>
                                        ) : (
                                            <span className="italic text-gray-400">Dates non définies</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={`/appreciation/${student.appreciationToken}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-900"
                                        >
                                            Accéder
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Evaluated Students Section */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-[#41729F] mb-3 flex items-center gap-2">
                    <FaUserGraduate /> Étudiants évalués
                </h3>
                {evaluatedStudents.length === 0 ? (
                    <div className="italic text-gray-400">Aucun étudiant évalué pour l'instant.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-[#C3CFE2] bg-white/70 rounded-xl shadow-xl">
                            <thead className="bg-[#41729F] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold">Nom</th>
                                <th className="px-6 py-4 text-left font-bold">Prénom</th>
                                <th className="px-6 py-4 text-left font-bold">Email</th>
                                <th className="px-6 py-4 text-left font-bold"><FaBuilding className="inline-block mr-1" /> Entreprise</th>
                                <th className="px-6 py-4 text-left font-bold"><FaCalendarAlt className="inline-block mr-1" /> Période</th>
                                <th className="px-6 py-4 text-left font-bold">Appréciations</th>
                                <th className="px-6 py-4 text-left font-bold">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5EAF0]">
                            {evaluatedStudents.map(student => (
                                <tr key={student.id} className="hover:bg-[#F5F7FA] transition">
                                    <td className="px-6 py-4 font-semibold text-[#274472]">{student.nom}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.prenom}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.email}</td>
                                    <td className="px-6 py-4 text-[#274472]">{student.entreprise || <span className="italic text-gray-400">—</span>}</td>
                                    <td className="px-6 py-4 text-[#274472]">
                                        {student.dateDebut && student.dateFin ? (
                                            <span>{student.dateDebut} → {student.dateFin}</span>
                                        ) : (
                                            <span className="italic text-gray-400">Dates non définies</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-[#274472]">
                                        {student.appreciations.map((app, index) => (
                                            <div key={index} className="mb-2">
                                                <div className="font-bold">{app.tuteurNom} {app.tuteurPrenom}</div>
                                                <div className="text-sm text-gray-600">{app.tuteurEmail}</div>
                                                <button
                                                    onClick={() => openAppreciationModal(app)}
                                                    className="mt-1 text-blue-600 underline hover:text-blue-800 text-sm"
                                                >
                                                    Voir détails
                                                </button>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => window.print()}
                                            className="text-green-600 underline hover:text-green-800 flex items-center gap-1"
                                        >
                                            <FaPrint /> Imprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Component */}
            <AppreciationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                appreciation={selectedAppreciation}
            />
        </motion.div>
    );
}

// Composant Modal pour afficher les détails d'une appréciation
function AppreciationModal({ isOpen, onClose, appreciation }) {
    if (!isOpen || !appreciation) return null;

    // Fonction pour empêcher la propagation des clics à l'intérieur de la modale
    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={stopPropagation}
            >
                {/* Reste du code de la modale inchangé */}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {appreciation.evaluations.map((evaluation, evalIndex) => (
                                    <div key={evalIndex} className="flex justify-between p-2 bg-white rounded shadow-sm">
                                        <span>{evaluation.categorie}</span>
                                        <span className="font-bold text-[#41729F]">{evaluation.valeur}/5</span>
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
                                        <span className="font-bold px-2 py-1 bg-[#41729F] text-white rounded-lg">{comp.note}/5</span>
                                    </div>

                                    {comp.categories && comp.categories.length > 0 && (
                                        <div className="mt-2 border-t pt-2">
                                            <div className="font-medium text-[#274472] text-sm mb-1">Détails:</div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {comp.categories.map((cat, catIndex) => (
                                                    <div key={catIndex} className="flex justify-between text-sm p-1 bg-[#F5F7FA] rounded">
                                                        <span>{cat.intitule}</span>
                                                        <span>{cat.valeur}/5</span>
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
                            <FaPrint /> Imprimer
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