import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { motion } from "framer-motion";
import AppreciationModal from "../components/AppreciationModal";
import {
    FaChevronLeft,
    FaUserGraduate,
    FaCalendarAlt,
    FaBuilding,
    FaPrint,
    FaGraduationCap,
    FaLink,
    FaFileAlt,
    FaInfoCircle,
    FaRegClipboard,
    FaExclamationTriangle,
    FaCheck,
    FaExternalLinkAlt,
    FaDownload,
    FaEye,
    FaEnvelope,
    FaTimes,
    FaPaperPlane,
    FaShareAlt,
    FaListAlt
} from "react-icons/fa";

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
    const [copySuccess, setCopySuccess] = useState(false);
    const [activeTab, setActiveTab] = useState("nonEvaluated");

    // États pour les modales d'envoi d'email
    const [showInscriptionEmailModal, setShowInscriptionEmailModal] = useState(false);
    const [showAppreciationEmailModal, setShowAppreciationEmailModal] = useState(false);
    const [selectedStudentForEmail, setSelectedStudentForEmail] = useState(null);
    const [emailContent, setEmailContent] = useState({
        subject: "",
        body: "",
        to: "",
        cc: "",
        bcc: ""
    });
    const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectAllStudents, setSelectAllStudents] = useState(false);

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

                // Filtrer les Stagiaires ici
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

                console.log("Stagiaires évalués:", evaluated);
                console.log("Stagiaires non évalués:", nonEvaluated);

                setEvaluatedStudents(evaluated);
                setNonEvaluatedStudents(nonEvaluated);
            })
            .catch(error => {
                console.error("Erreur lors du chargement des Stagiaires:", error);
                setErr("Erreur de chargement des Stagiaires");
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Effet pour mettre à jour l'état de sélection de tous les étudiants
    useEffect(() => {
        if (selectAllStudents) {
            if (activeTab === 'nonEvaluated') {
                setSelectedStudents(nonEvaluatedStudents.map(s => s.id));
            } else {
                setSelectedStudents(evaluatedStudents.map(s => s.id));
            }
        } else if (selectedStudents.length === (activeTab === 'nonEvaluated' ? nonEvaluatedStudents.length : evaluatedStudents.length)) {
            // Si tous sont sélectionnés manuellement, mettre selectAll à true
            setSelectAllStudents(true);
        }
    }, [selectAllStudents, activeTab]);

    // Fonction pour ouvrir la modale avec une appréciation spécifique
    const openAppreciationModal = (appreciation, student) => {
        const enrichedAppreciation = {
            ...appreciation,
            stagiaireNom: student.nom,
            stagiairePrenom: student.prenom,
            stagiaireEmail: student.email,
            entreprise: student.entreprise,
            dateDebut: student.dateDebut,
            dateFin: student.dateFin,
        };

        setSelectedAppreciation(enrichedAppreciation);
        setIsModalOpen(true);
    };

    // Fonction pour fermer la modale
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppreciation(null);
    };

    // Fonction pour copier le lien d'inscription
    const copyInscriptionLink = () => {
        const publicUrl = `${window.location.origin}/stage-inscription/${data?.shareToken}`;
        navigator.clipboard.writeText(publicUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    // Fonction pour ouvrir la modale d'envoi par email du lien d'inscription
    const openInscriptionEmailModal = () => {
        const publicUrl = `${window.location.origin}/stage-inscription/${data?.shareToken}`;
        setEmailContent({
            subject: `Inscription au stage - Année universitaire ${data?.anneeUniversitaire}`,
            body: `Bonjour,

Nous vous invitons à vous inscrire au stage pour l'année universitaire ${data?.anneeUniversitaire}.

Veuillez cliquer sur le lien ci-dessous pour compléter votre inscription :
${publicUrl}

Cordialement,
L'équipe administrative`,
            to: "",
            cc: "",
            bcc: ""
        });
        setShowInscriptionEmailModal(true);
    };

    // Fonction pour ouvrir la modale d'envoi par email du lien d'appréciation
    const openAppreciationEmailModal = (student) => {
        const appreciationUrl = `${window.location.origin}/appreciation/${student.appreciationToken}`;
        setSelectedStudentForEmail(student);
        setEmailContent({
            subject: `Formulaire d'appréciation pour ${student.prenom} ${student.nom} - Stage ${data?.anneeUniversitaire}`,
            body: `Bonjour,

En tant que tuteur/tutrice de stage de ${student.prenom} ${student.nom}, nous vous invitons à compléter le formulaire d'appréciation.

Veuillez cliquer sur le lien ci-dessous pour accéder au formulaire :
${appreciationUrl}

Nous vous remercions pour votre collaboration.

Cordialement,
L'équipe administrative`,
            to: "",
            cc: "",
            bcc: ""
        });
        setShowAppreciationEmailModal(true);
    };

    // Fonction pour ouvrir la modale d'envoi en masse
    const openBulkEmailModal = (type) => {
        // Réinitialiser les sélections
        setSelectedStudents([]);
        setSelectAllStudents(false);

        // Définir l'onglet actif en fonction du type
        setActiveTab(type === 'evaluation' ? 'nonEvaluated' : 'evaluated');

        // Ouvrir la modale
        setShowBulkEmailModal(true);
    };

    // Fonction pour envoyer un email
    const sendEmail = (e) => {
        e.preventDefault();

        // Construction de l'URL mailto
        let mailtoUrl = `mailto:${emailContent.to}`;

        // Ajout des champs CC et BCC s'ils sont remplis
        if (emailContent.cc) mailtoUrl += `?cc=${emailContent.cc}`;
        if (emailContent.bcc) {
            mailtoUrl += mailtoUrl.includes('?') ? `&bcc=${emailContent.bcc}` : `?bcc=${emailContent.bcc}`;
        }

        // Ajout du sujet et du corps
        mailtoUrl += mailtoUrl.includes('?') ? `&` : `?`;
        mailtoUrl += `subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.body)}`;

        // Ouvrir le client de messagerie
        window.location.href = mailtoUrl;

        // Fermer les modales
        setShowInscriptionEmailModal(false);
        setShowAppreciationEmailModal(false);
        setSelectedStudentForEmail(null);
    };

    // Fonction pour envoyer un email en masse
    const sendBulkEmail = (e) => {
        e.preventDefault();

        // Créer le contenu de l'email en fonction de l'onglet actif
        let subject, body, urls = [];

        // Récupérer les étudiants sélectionnés
        const studentsToProcess = (activeTab === 'nonEvaluated' ? nonEvaluatedStudents : evaluatedStudents)
            .filter(student => selectedStudents.includes(student.id));

        if (activeTab === 'nonEvaluated') {
            // Email pour les formulaires d'appréciation
            subject = `Formulaires d'appréciation - Année universitaire ${data?.anneeUniversitaire}`;

            // Créer la liste des stagiaires et leurs liens
            const studentsList = studentsToProcess.map(student =>
                `- ${student.prenom} ${student.nom} : ${window.location.origin}/appreciation/${student.appreciationToken}`
            ).join('\n');

            body = `Bonjour,

Vous trouverez ci-dessous les liens vers les formulaires d'appréciation pour les stagiaires sous votre tutelle pour l'année universitaire ${data?.anneeUniversitaire} :

${studentsList}

Nous vous remercions pour votre collaboration.

Cordialement,
L'équipe administrative`;
        } else {
            // Email pour les résultats d'évaluation
            subject = `Résultats des évaluations - Année universitaire ${data?.anneeUniversitaire}`;

            // Créer la liste des stagiaires évalués
            const studentsList = studentsToProcess.map(student =>
                `- ${student.prenom} ${student.nom} - Évalué par : ${student.appreciations.map(a => `${a.tuteurPrenom} ${a.tuteurNom}`).join(', ')}`
            ).join('\n');

            body = `Bonjour,

Les stagiaires suivants ont été évalués pour l'année universitaire ${data?.anneeUniversitaire} :

${studentsList}

Vous pouvez consulter les détails des évaluations dans votre espace administrateur.

Cordialement,
L'équipe administrative`;
        }

        // Construction de l'URL mailto
        let mailtoUrl = `mailto:`;
        mailtoUrl += `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Ouvrir le client de messagerie
        window.location.href = mailtoUrl;

        // Fermer la modale
        setShowBulkEmailModal(false);
        setSelectedStudents([]);
        setSelectAllStudents(false);
    };

    // Fonction pour gérer la sélection d'un étudiant
    const handleStudentSelection = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            // Désélectionner
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
            setSelectAllStudents(false);
        } else {
            // Sélectionner
            setSelectedStudents([...selectedStudents, studentId]);

            // Vérifier si tous sont sélectionnés
            const allStudents = activeTab === 'nonEvaluated' ? nonEvaluatedStudents : evaluatedStudents;
            if ([...selectedStudents, studentId].length === allStudents.length) {
                setSelectAllStudents(true);
            }
        }
    };

    // Fonction pour gérer la sélection de tous les étudiants
    const handleSelectAllStudents = () => {
        setSelectAllStudents(!selectAllStudents);
        if (!selectAllStudents) {
            const allStudents = activeTab === 'nonEvaluated' ? nonEvaluatedStudents : evaluatedStudents;
            setSelectedStudents(allStudents.map(s => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    // Formatage des dates pour un affichage plus professionnel
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Calcul du pourcentage d'évaluation
    const calculateEvaluationRate = () => {
        const total = students.length;
        if (total === 0) return 0;
        return Math.round((evaluatedStudents.length / total) * 100);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto mt-10 p-8 bg-white/80 rounded-2xl shadow-xl border border-[#C3CFE2] text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#41729F] mx-auto mb-4"></div>
                <div className="text-[#41729F] font-medium">Chargement des données de l'année universitaire...</div>
            </div>
        );
    }

    if (err) {
        return (
            <div className="max-w-6xl mx-auto mt-10 p-8 bg-white/80 rounded-2xl shadow-xl border border-red-200 text-center">
                <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                <div className="text-red-600 font-bold text-xl mb-2">Erreur</div>
                <div className="text-red-500">{err}</div>
                <Link to="/stage-annee" className="inline-block mt-6 px-6 py-2 bg-[#41729F] text-white rounded-xl hover:bg-[#5885AF] transition">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    const publicUrl = `${window.location.origin}/stage-inscription/${data?.shareToken}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto bg-white/80 rounded-2xl shadow-2xl p-8 mt-10 border border-[#C3CFE2]"
        >
            <Link to="/stage-annee" className="flex items-center text-[#41729F] font-semibold mb-5 hover:underline">
                <FaChevronLeft className="mr-2" /> Retour à la liste des années universitaires
            </Link>

            {/* Header Section */}
            <div className="flex justify-between items-start mb-6 flex-wrap">
                <div>
                    <h2 className="text-2xl font-bold text-[#41729F] mb-2 flex items-center">
                        <FaGraduationCap className="mr-2" />
                        Année universitaire {data?.anneeUniversitaire}
                    </h2>
                    <p className="text-[#5885AF] text-sm">
                        Gestion des stages et des évaluations
                    </p>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                    <Link
                        to={`/stage-annee/${id}/edit`}
                        className="flex items-center gap-1 px-4 py-2 bg-[#41729F] text-white rounded-xl hover:bg-[#5885AF] transition font-medium"
                    >
                        <FaFileAlt className="mr-1" /> Modifier
                    </Link>
                </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#F5F7FA] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="font-semibold text-[#274472] mb-2">Statistiques des stages</div>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-3xl font-bold text-[#41729F]">{students.length}</div>
                            <div className="text-sm text-[#5885AF]">Stagiaires inscrits</div>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-[#B7C9E2]/30 flex items-center justify-center">
                            <FaUserGraduate className="text-xl text-[#41729F]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#F5F7FA] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="font-semibold text-[#274472] mb-2">Taux d'évaluation</div>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-3xl font-bold text-[#41729F]">{calculateEvaluationRate()}%</div>
                            <div className="text-sm text-[#5885AF]">{evaluatedStudents.length}/{students.length} évalués</div>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-[#B7C9E2]/30 flex items-center justify-center">
                            <FaCheck className="text-xl text-[#41729F]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#F5F7FA] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="font-semibold text-[#274472] mb-2">Période académique</div>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-xl font-bold text-[#41729F]">{data?.anneeUniversitaire}</div>
                            <div className="text-sm text-[#5885AF]">Année universitaire</div>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-[#B7C9E2]/30 flex items-center justify-center">
                            <FaCalendarAlt className="text-xl text-[#41729F]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & Rules Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl border border-[#C3CFE2] shadow-sm">
                    <h3 className="font-bold text-[#41729F] mb-3 flex items-center">
                        <FaInfoCircle className="mr-2" /> Description
                    </h3>
                    <p className="text-[#274472]">
                        {data?.description || <span className="italic text-gray-400">Aucune description disponible pour cette année universitaire.</span>}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#C3CFE2] shadow-sm">
                    <h3 className="font-bold text-[#41729F] mb-3 flex items-center">
                        <FaRegClipboard className="mr-2" /> Règles et modalités
                    </h3>
                    <p className="text-[#274472]">
                        {data?.regles || <span className="italic text-gray-400">Aucune règle spécifique n'a été définie pour cette année universitaire.</span>}
                    </p>
                </div>
            </div>

            {/* Inscription Link Section */}
            <div className="bg-gradient-to-r from-[#E5EAF0] to-[#F5F7FA] p-5 rounded-xl border border-[#C3CFE2] mb-8">
                <h3 className="font-bold text-[#41729F] mb-3 flex items-center">
                    <FaLink className="mr-2" /> Lien d'inscription stagiaires
                </h3>
                <div className="flex items-center flex-wrap">
                    <input
                        type="text"
                        value={publicUrl}
                        readOnly
                        className="flex-1 bg-white p-3 rounded-l-lg border border-r-0 border-[#C3CFE2] font-mono text-[#41729F] min-w-0"
                    />
                    <div className="flex flex-wrap">
                        <button
                            onClick={copyInscriptionLink}
                            className={`px-4 py-3 ${copySuccess ? 'bg-green-500 text-white' : 'bg-[#41729F] text-white'} font-medium`}
                            title="Copier le lien"
                        >
                            {copySuccess ? 'Copié !' : 'Copier'}
                        </button>
                        <a
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 bg-[#274472] text-white font-medium hover:bg-[#1a2e4c] transition flex items-center"
                        >
                            <FaExternalLinkAlt className="mr-1" /> Ouvrir
                        </a>
                        <button
                            onClick={openInscriptionEmailModal}
                            className="px-4 py-3 bg-[#5885AF] text-white rounded-r-lg font-medium hover:bg-[#41729F] transition flex items-center"
                            title="Envoyer par email"
                        >
                            <FaEnvelope className="mr-1" /> Envoyer
                        </button>
                    </div>
                </div>
                <p className="text-sm text-[#5885AF] mt-2">
                    Partagez ce lien avec les étudiants pour leur permettre de s'inscrire à un stage pour l'année universitaire {data?.anneeUniversitaire}.
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-[#E5EAF0] mb-6">
                <div className="flex space-x-4">
                    <button
                        className={`py-3 px-4 font-medium relative ${activeTab === 'nonEvaluated' ? 'text-[#41729F]' : 'text-[#5885AF] hover:text-[#41729F]'} transition`}
                        onClick={() => setActiveTab('nonEvaluated')}
                    >
                        Stagiaires à évaluer ({nonEvaluatedStudents.length})
                        {activeTab === 'nonEvaluated' && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#41729F]"
                            />
                        )}
                    </button>
                    <button
                        className={`py-3 px-4 font-medium relative ${activeTab === 'evaluated' ? 'text-[#41729F]' : 'text-[#5885AF] hover:text-[#41729F]'} transition`}
                        onClick={() => setActiveTab('evaluated')}
                    >
                        Stagiaires évalués ({evaluatedStudents.length})
                        {activeTab === 'evaluated' && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#41729F]"
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Actions groupées pour l'onglet actif */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => openBulkEmailModal(activeTab === 'nonEvaluated' ? 'evaluation' : 'results')}
                    className="flex items-center gap-1 px-4 py-2 bg-[#5885AF] text-white rounded-lg hover:bg-[#41729F] transition"
                >
                    <FaEnvelope className="mr-1" />
                    {activeTab === 'nonEvaluated'
                        ? "Envoyer des liens d'appréciation"
                        : "Partager les résultats d'évaluation"}
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'nonEvaluated' && (
                <div className="mt-4">
                    {nonEvaluatedStudents.length === 0 ? (
                        <div className="text-center py-10 bg-[#F5F7FA] rounded-xl border border-[#E5EAF0]">
                            <FaCheck className="text-green-500 text-4xl mx-auto mb-3" />
                            <p className="text-[#41729F] font-medium">Tous les stagiaires ont été évalués.</p>
                            <p className="text-[#5885AF] mt-1">Consultez l'onglet "Stagiaires évalués" pour voir les appréciations.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl shadow-xl border border-[#C3CFE2]">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gradient-to-r from-[#41729F] to-[#5885AF] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold">Nom</th>
                                    <th className="px-6 py-4 text-left font-bold">Prénom</th>
                                    <th className="px-6 py-4 text-left font-bold">Email</th>
                                    <th className="px-6 py-4 text-left font-bold"><FaBuilding className="inline-block mr-1" /> Entreprise</th>
                                    <th className="px-6 py-4 text-left font-bold"><FaCalendarAlt className="inline-block mr-1" /> Période</th>
                                    <th className="px-6 py-4 text-center font-bold">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {nonEvaluatedStudents.map((student, index) => (
                                    <tr key={student.id} className={`hover:bg-[#F5F7FA] transition ${index % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]/50'}`}>
                                        <td className="px-6 py-4 font-semibold text-[#274472]">{student.nom}</td>
                                        <td className="px-6 py-4 text-[#274472]">{student.prenom}</td>
                                        <td className="px-6 py-4 text-[#274472]">{student.email}</td>
                                        <td className="px-6 py-4 text-[#274472]">{student.entreprise || <span className="italic text-gray-400">Non renseigné</span>}</td>
                                        <td className="px-6 py-4 text-[#274472]">
                                            {student.dateDebut && student.dateFin ? (
                                                <span>{formatDate(student.dateDebut)} → {formatDate(student.dateFin)}</span>
                                            ) : (
                                                <span className="italic text-gray-400">Dates non définies</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <a
                                                    href={`/appreciation/${student.appreciationToken}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-2 py-1.5 bg-[#41729F] text-white rounded-lg hover:bg-[#5885AF] transition text-sm"
                                                >
                                                    <FaExternalLinkAlt className="mr-1" />
                                                    Ouvrir
                                                </a>
                                                <button
                                                    onClick={() => openAppreciationEmailModal(student)}
                                                    className="inline-flex items-center px-2 py-1.5 bg-[#5885AF] text-white rounded-lg hover:bg-[#41729F] transition text-sm"
                                                >
                                                    <FaEnvelope className="mr-1" />
                                                    Envoyer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'evaluated' && (
                <div className="mt-4">
                    {evaluatedStudents.length === 0 ? (
                        <div className="text-center py-10 bg-[#F5F7FA] rounded-xl border border-[#E5EAF0]">
                            <FaExclamationTriangle className="text-amber-500 text-4xl mx-auto mb-3" />
                            <p className="text-[#41729F] font-medium">Aucun stagiaire n'a encore été évalué.</p>
                            <p className="text-[#5885AF] mt-1">Les appréciations apparaîtront ici une fois complétées par les tuteurs.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl shadow-xl border border-[#C3CFE2]">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gradient-to-r from-[#41729F] to-[#5885AF] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold">Nom</th>
                                    <th className="px-6 py-4 text-left font-bold">Prénom</th>
                                    <th className="px-6 py-4 text-left font-bold"><FaBuilding className="inline-block mr-1" /> Entreprise</th>
                                    <th className="px-6 py-4 text-left font-bold"><FaCalendarAlt className="inline-block mr-1" /> Période</th>
                                    <th className="px-6 py-4 text-left font-bold">Appréciations</th>
                                </tr>
                                </thead>
                                <tbody>
                                {evaluatedStudents.map((student, index) => (
                                    <tr key={student.id} className={`hover:bg-[#F5F7FA] transition ${index % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]/50'}`}>
                                        <td className="px-6 py-4 font-semibold text-[#274472]">{student.nom}</td>
                                        <td className="px-6 py-4 text-[#274472]">{student.prenom}</td>
                                        <td className="px-6 py-4 text-[#274472]">{student.entreprise || <span className="italic text-gray-400">Non renseigné</span>}</td>
                                        <td className="px-6 py-4 text-[#274472]">
                                            {student.dateDebut && student.dateFin ? (
                                                <span>{formatDate(student.dateDebut)} → {formatDate(student.dateFin)}</span>
                                            ) : (
                                                <span className="italic text-gray-400">Dates non définies</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.appreciations.map((app, index) => (
                                                <div key={index} className={`${index > 0 ? 'mt-4 pt-3 border-t border-[#E5EAF0]' : ''}`}>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="font-semibold text-[#274472]">{app.tuteurNom} {app.tuteurPrenom}</div>
                                                            <div className="text-sm text-[#5885AF]">{app.tuteurEmail}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => openAppreciationModal(app, student)}
                                                            className="px-3 py-1.5 bg-[#F5F7FA] text-[#41729F] rounded-lg hover:bg-[#E5EAF0] transition text-sm flex items-center"
                                                        >
                                                            <FaEye className="mr-1.5" />
                                                            Voir détails
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Modale d'envoi par email du lien d'inscription */}
            {showInscriptionEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-[#E5EAF0]">
                            <h3 className="text-xl font-bold text-[#41729F] flex items-center">
                                <FaEnvelope className="mr-2" /> Envoyer le lien d'inscription par email
                            </h3>
                            <button
                                onClick={() => setShowInscriptionEmailModal(false)}
                                className="text-[#41729F] hover:text-[#274472] transition"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={sendEmail} className="p-6">
                            <div className="mb-4">
                                <label className="block text-[#274472] font-medium mb-2">Destinataire</label>
                                <input
                                    type="email"
                                    value={emailContent.to}
                                    onChange={(e) => setEmailContent({...emailContent, to: e.target.value})}
                                    placeholder="Adresses email séparées par des virgules"
                                    className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[#274472] font-medium mb-2">Cc</label>
                                    <input
                                        type="text"
                                        value={emailContent.cc}
                                        onChange={(e) => setEmailContent({...emailContent, cc: e.target.value})}
                                        className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#274472] font-medium mb-2">Cci</label>
                                    <input
                                        type="text"
                                        value={emailContent.bcc}
                                        onChange={(e) => setEmailContent({...emailContent, bcc: e.target.value})}
                                        className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-[#274472] font-medium mb-2">Sujet</label>
                                <input
                                    type="text"
                                    value={emailContent.subject}
                                    onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
                                    className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[#274472] font-medium mb-2">Message</label>
                                <textarea
                                    value={emailContent.body}
                                    onChange={(e) => setEmailContent({...emailContent, body: e.target.value})}
                                    rows={8}
                                    className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none resize-none"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowInscriptionEmailModal(false)}
                                    className="px-4 py-2 bg-[#E5EAF0] text-[#41729F] rounded-lg hover:bg-[#D4E1F5] transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#41729F] text-white rounded-lg hover:bg-[#5885AF] transition flex items-center"
                                >
                                    <FaPaperPlane className="mr-2" /> Envoyer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modale d'envoi par email du lien d'appréciation */}
            {showAppreciationEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-[#E5EAF0]">
                            <h3 className="text-xl font-bold text-[#41729F] flex items-center">
                                <FaEnvelope className="mr-2" /> Envoyer le lien d'appréciation
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAppreciationEmailModal(false);
                                    setSelectedStudentForEmail(null);
                                }}
                                className="text-[#41729F] hover:text-[#274472] transition"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="px-6 py-3 bg-[#F5F7FA]">
                            <div className="flex items-center">
                                <FaUserGraduate className="text-[#41729F] mr-2" />
                                <span className="font-medium text-[#274472]">
                                    {selectedStudentForEmail?.prenom} {selectedStudentForEmail?.nom}
                                </span>
                            </div>
                        </div>
                        <form onSubmit={sendEmail} className="p-6">
                            <div className="mb-4">
                                <label className="block text-[#274472] font-medium mb-2">Destinataire (Tuteur)</label>
                                <input
                                    type="email"
                                    value={emailContent.to}
                                    onChange={(e) => setEmailContent({...emailContent, to: e.target.value})}
                                    placeholder="Adresse email du tuteur"
                                    className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[#274472] font-medium mb-2">Cc</label>
                                    <input
                                        type="text"
                                        value={emailContent.cc}
                                        onChange={(e) => setEmailContent({...emailContent, cc: e.target.value})}
                                        className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#274472] font-medium mb-2">Cci</label>
                                    <input
                                        type="text"
                                        value={emailContent.bcc}
                                        onChange={(e) => setEmailContent({...emailContent, bcc: e.target.value})}
                                        className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-[#274472] font-medium mb-2">Sujet</label>
                                <input
                                    type="text"
                                    value={emailContent.subject}
                                    onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
                                    className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[#274472] font-medium mb-2">Message</label>
                                <textarea
                                    value={emailContent.body}
                                    onChange={(e) => setEmailContent({...emailContent, body: e.target.value})}
                                    rows={8}
                                    className="w-full p-2.5 border border-[#C3CFE2] rounded-lg focus:ring-2 focus:ring-[#41729F] focus:outline-none resize-none"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAppreciationEmailModal(false);
                                        setSelectedStudentForEmail(null);
                                    }}
                                    className="px-4 py-2 bg-[#E5EAF0] text-[#41729F] rounded-lg hover:bg-[#D4E1F5] transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#41729F] text-white rounded-lg hover:bg-[#5885AF] transition flex items-center"
                                >
                                    <FaPaperPlane className="mr-2" /> Envoyer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modale pour l'envoi en masse */}
            {showBulkEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-[#E5EAF0]">
                            <h3 className="text-xl font-bold text-[#41729F] flex items-center">
                                <FaEnvelope className="mr-2" />
                                {activeTab === 'nonEvaluated'
                                    ? "Envoyer des liens d'appréciation"
                                    : "Partager les résultats d'évaluation"}
                            </h3>
                            <button
                                onClick={() => setShowBulkEmailModal(false)}
                                className="text-[#41729F] hover:text-[#274472] transition"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-[#F5F7FA] p-4 rounded-lg mb-6 flex items-start">
                                <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-blue-800 font-medium">
                                        {activeTab === 'nonEvaluated'
                                            ? "Envoi des liens d'appréciation"
                                            : "Partage des résultats d'évaluation"}
                                    </p>
                                    <p className="text-blue-700 text-sm mt-1">
                                        {activeTab === 'nonEvaluated'
                                            ? "Sélectionnez les stagiaires pour lesquels vous souhaitez envoyer les liens d'appréciation aux tuteurs."
                                            : "Sélectionnez les stagiaires dont vous souhaitez partager les résultats d'évaluation."}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 flex items-center">
                                <input
                                    type="checkbox"
                                    id="selectAll"
                                    checked={selectAllStudents}
                                    onChange={handleSelectAllStudents}
                                    className="w-4 h-4 text-[#41729F] border-[#C3CFE2] rounded focus:ring-[#41729F]"
                                />
                                <label htmlFor="selectAll" className="ml-2 text-[#274472] font-medium">
                                    Sélectionner tous les stagiaires ({activeTab === 'nonEvaluated' ? nonEvaluatedStudents.length : evaluatedStudents.length})
                                </label>
                            </div>

                            <div className="overflow-y-auto max-h-60 border border-[#E5EAF0] rounded-lg mb-4">
                                <table className="min-w-full divide-y divide-[#E5EAF0]">
                                    <thead className="bg-[#F5F7FA]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#274472] uppercase tracking-wider">
                                            Sélection
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#274472] uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#274472] uppercase tracking-wider">
                                            Prénom
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#274472] uppercase tracking-wider">
                                            {activeTab === 'nonEvaluated' ? 'Email' : 'Entreprise'}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-[#E5EAF0]">
                                    {(activeTab === 'nonEvaluated' ? nonEvaluatedStudents : evaluatedStudents).map((student) => (
                                        <tr key={student.id} className="hover:bg-[#F5F7FA]">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    id={`student-${student.id}`}
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={() => handleStudentSelection(student.id)}
                                                    className="w-4 h-4 text-[#41729F] border-[#C3CFE2] rounded focus:ring-[#41729F]"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#274472]">
                                                {student.nom}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#274472]">
                                                {student.prenom}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#5885AF] truncate max-w-xs">
                                                {activeTab === 'nonEvaluated' ? student.email : student.entreprise || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="text-right text-[#274472]">
                                {selectedStudents.length} stagiaire(s) sélectionné(s)
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowBulkEmailModal(false)}
                                    className="px-4 py-2 bg-[#E5EAF0] text-[#41729F] rounded-lg hover:bg-[#D4E1F5] transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={sendBulkEmail}
                                    disabled={selectedStudents.length === 0}
                                    className={`px-4 py-2 ${selectedStudents.length === 0 ? 'bg-[#7aa0c7] cursor-not-allowed' : 'bg-[#41729F] hover:bg-[#5885AF] cursor-pointer'} text-white rounded-lg transition flex items-center`}
                                >
                                    <FaPaperPlane className="mr-2" />
                                    Préparer l'email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Component */}
            <AppreciationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                appreciation={selectedAppreciation}
            />
        </motion.div>
    );
}