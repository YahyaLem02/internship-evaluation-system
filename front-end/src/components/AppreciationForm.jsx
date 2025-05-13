import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../api";
import { FaUser, FaUniversity, FaBuilding, FaCalendarAlt, FaClipboardCheck, FaBook, FaStar, FaAward, FaCheckCircle, FaArrowRight, FaExclamationCircle, FaSpinner, FaEnvelope } from "react-icons/fa";

const EVALUATION_CHOICES = {
    implication: [
        "Paresseux", "Le juste nécessaire", "Bonne", "Très forte", "Dépasse ses objectifs"
    ],
    ouverture: [
        "Isolé(e) ou en opposition", "Renfermé(e) ou obtus", "Bonne", "Très bonne", "Excellente"
    ],
    qualite: [
        "Médiocre", "Acceptable", "Bonne", "Très bonne", "Très professionnelle"
    ]
};

const COMPETENCE_LEVELS = ["NA", "DÉBUTANT", "AUTONOME", "AUTONOME +"];

const COMPETENCES_META = [
    {
        intitule: "Compétences liées à l'individu",
        categories: [
            "Être capable d'analyse et de synthèse",
            "Être capable de proposer des méthodes et des axes de travail",
            "Être capable de faire adhérer les acteurs",
            "Être capable de travailler dans un contexte international et interculturel (langues, adaptation culturelle)",
            "Être capable de s'autoévaluer",
            "Être capable d'identifier des problèmes complexes"
        ]
    },
    {
        intitule: "Compétences liées à l'entreprise",
        categories: [
            "Être capable d'analyser le fonctionnement de l'environnement de l'accueil",
            "Être capable d'identifier la réglementation (hiérarchie, droit du travail, RSE, CHSCT, etc.)",
            "Être capable d'analyser la démarche projet, et d'organiser et de structurer un projet",
            "Être capable d'apprendre à déceler et à comprendre la politique environnementale de l'entreprise",
            "Être capable de rechercher, de sélectionner l'information nécessaire à ses activités"
        ]
    },
    {
        intitule: "Compétences liées à la conception",
        categories: [
            "Être capable d'assurer la conception préliminaire de produits / services / processus / usages"
        ]
    },
    {
        intitule: "Compétences spécifiques au métier",
        categories: [] // catégories libres
    }
];

// Animations
const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

export default function AppreciationForm({ initialStage, onSubmit }) {
    const [step, setStep] = useState(1); // Commencer à l'étape 1 (Tuteur)
    const [completedSteps, setCompletedSteps] = useState([]);
    const [errors, setErrors] = useState({});
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);
    const [tuteurExistsMessage, setTuteurExistsMessage] = useState(null);
    const [emailVerificationSent, setEmailVerificationSent] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [enteredCode, setEnteredCode] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);

    // Nouvel état pour le tuteur
    const [tuteur, setTuteur] = useState({
        nom: "",
        prenom: "",
        email: "",
        entreprise: ""
    });

    const [stage, setStage] = useState({
        description: initialStage?.stageDescription || "",
        objectif: initialStage?.stageObjectif || ""
    });

    const [evaluations, setEvaluations] = useState({
        implication: "",
        ouverture: "",
        qualite: "",
        observations: ""
    });

    const [competences, setCompetences] = useState(
        COMPETENCES_META.map(c => ({
            intitule: c.intitule,
            note: "",
            categories: c.categories.map(cat => ({ intitule: cat, valeur: "" })),
            extraCategories: []
        }))
    );

    // Fonction pour vérifier l'existence du tuteur par email
    const checkTuteurExists = async (email) => {
        if (!email || !email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
            setEmailChecked(false);
            setTuteurExistsMessage(null);
            return;
        }

        try {
            setCheckingEmail(true);
            const response = await axios.get(`${API_URL}/api/tuteurs/check-email?email=${encodeURIComponent(email)}`);
            setCheckingEmail(false);
            setEmailChecked(true);

            if (response.data && response.data.exists) {
                // Le tuteur existe, on récupère ses informations
                setTuteur({
                    nom: response.data.nom || "",
                    prenom: response.data.prenom || "",
                    email: email,
                    entreprise: response.data.entreprise || ""
                });
                setTuteurExistsMessage({
                    type: "success",
                    text: "Tuteur trouvé ! Les informations ont été pré-remplies."
                });
            } else {
                setTuteurExistsMessage({
                    type: "info",
                    text: "Nouveau tuteur. Veuillez remplir tous les champs."
                });
            }
        } catch (error) {
            console.error("Erreur lors de la vérification de l'email:", error);
            setCheckingEmail(false);
            setEmailChecked(true);
            setTuteurExistsMessage({
                type: "error",
                text: "Erreur lors de la vérification de l'email."
            });
        }
    };

    // Gérer le changement d'email avec debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (tuteur.email) {
                checkTuteurExists(tuteur.email);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [tuteur.email]);

    // Validation des étapes
    const validateStep = (currentStep) => {
        let isValid = true;
        const newErrors = {};

        switch (currentStep) {
            case 1:
                if (!tuteur.nom.trim()) {
                    newErrors.nom = "Le nom est requis";
                    isValid = false;
                }
                if (!tuteur.prenom.trim()) {
                    newErrors.prenom = "Le prénom est requis";
                    isValid = false;
                }
                if (!tuteur.email.trim()) {
                    newErrors.email = "L'email est requis";
                    isValid = false;
                } else if (!/^\S+@\S+\.\S+$/.test(tuteur.email)) {
                    newErrors.email = "Format d'email invalide";
                    isValid = false;
                }
                if (!tuteur.entreprise.trim()) {
                    newErrors.entreprise = "L'entreprise est requise";
                    isValid = false;
                }
                if (!emailVerified) {
                    newErrors.verification = "Veuillez vérifier votre email avant de continuer";
                    isValid = false;
                }
                break;
            case 2:
                if (!stage.description.trim()) {
                    newErrors.description = "La description est requise";
                    isValid = false;
                }
                if (!stage.objectif.trim()) {
                    newErrors.objectif = "L'objectif est requis";
                    isValid = false;
                }
                break;
            case 3:
                if (!evaluations.implication) {
                    newErrors.implication = "Ce champ est requis";
                    isValid = false;
                }
                if (!evaluations.ouverture) {
                    newErrors.ouverture = "Ce champ est requis";
                    isValid = false;
                }
                if (!evaluations.qualite) {
                    newErrors.qualite = "Ce champ est requis";
                    isValid = false;
                }
                if (!evaluations.observations.trim()) {
                    newErrors.observations = "Ce champ est requis";
                    isValid = false;
                }
                break;
            case 4:
                let validCompetences = true;
                const compErrors = {};

                competences.forEach((comp, idx) => {
                    if (!comp.note || parseInt(comp.note) < 0 || parseInt(comp.note) > 20) {
                        compErrors[`note_${idx}`] = "Note valide requise (0-20)";
                        validCompetences = false;
                    }

                    comp.categories.forEach((cat, catIdx) => {
                        if (!cat.valeur) {
                            compErrors[`cat_${idx}_${catIdx}`] = "Sélection requise";
                            validCompetences = false;
                        }
                    });

                    if (idx === 3) {
                        comp.extraCategories.forEach((cat, catIdx) => {
                            if (!cat.intitule.trim()) {
                                compErrors[`extra_title_${catIdx}`] = "Intitulé requis";
                                validCompetences = false;
                            }
                            if (!cat.valeur) {
                                compErrors[`extra_val_${catIdx}`] = "Sélection requise";
                                validCompetences = false;
                            }
                        });
                    }
                });

                if (!validCompetences) {
                    newErrors.competences = compErrors;
                    isValid = false;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return isValid;
    };

    function addCompetence4Category() {
        setCompetences(comps => comps.map((c, idx) =>
            idx === 3 ? { ...c, extraCategories: [...c.extraCategories, { intitule: "", valeur: "" }] } : c
        ));
    }

    function updateCompetence4Category(catIdx, field, value) {
        setCompetences(comps => comps.map((c, idx) =>
            idx === 3
                ? {
                    ...c,
                    extraCategories: c.extraCategories.map((cat, i) =>
                        i === catIdx ? { ...cat, [field]: value } : cat
                    )
                }
                : c
        ));
    }

    const sendVerificationEmail = async () => {
        if (!tuteur.email || !tuteur.email.trim() || !/^\S+@\S+\.\S+$/.test(tuteur.email)) {
            setErrors(prev => ({ ...prev, email: "Email invalide" }));
            return;
        }

        try {
            setIsVerifyingEmail(true);

            // Générer un code à 6 chiffres
            const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            setVerificationCode(generatedCode);

            // Appel API pour envoyer l'email avec le code
            await axios.post(`${API_URL}/api/appreciation/send-verification-code`, {
                email: tuteur.email,
                nom: tuteur.nom,
                prenom: tuteur.prenom,
                code: generatedCode
            });

            setEmailVerificationSent(true);
            setVerificationError("");
        } catch (error) {
            console.error("Erreur lors de l'envoi du code de vérification:", error);
            setVerificationError("Impossible d'envoyer le code de vérification. Veuillez réessayer.");
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    // Fonction pour vérifier le code
    const verifyCode = () => {
        if (enteredCode === verificationCode) {
            setEmailVerified(true);
            setVerificationError("");
        } else {
            setVerificationError("Code incorrect. Veuillez réessayer.");
        }
    };

    function nextStep() {
        if (validateStep(step)) {
            if (!completedSteps.includes(step)) {
                setCompletedSteps([...completedSteps, step]);
            }
            setStep(s => s + 1);
        }
    }

    function prevStep() {
        setStep(s => s - 1);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (validateStep(step)) {
            const payload = {
                // Ajouter les informations du tuteur
                tuteur: {
                    nom: tuteur.nom,
                    prenom: tuteur.prenom,
                    email: tuteur.email,
                    entreprise: tuteur.entreprise
                },
                stageDescription: stage.description,
                stageObjectif: stage.objectif,
                evaluations: [
                    { categorie: "IMPLICATION DANS SES ACTIVITES", valeur: evaluations.implication },
                    { categorie: "OUVERTURE AUX AUTRES", valeur: evaluations.ouverture },
                    { categorie: "QUALITE DE SES \"PRODUCTIONS\"", valeur: evaluations.qualite },
                    { categorie: "OBSERVATIONS SUR L'ENSEMBLE DU TRAVAIL ACCOMPLI", valeur: evaluations.observations }
                ],
                competences: competences.map((c, idx) => ({
                    intitule: c.intitule,
                    note: c.note,
                    categories: [
                        ...c.categories.map(cat => ({ intitule: cat.intitule, valeur: cat.valeur })),
                        ...(idx === 3 ? c.extraCategories : [])
                    ]
                }))
            };
            if (onSubmit) onSubmit(payload);
        }
    }

    // Icônes pour chaque étape
    const stepIcons = [
        <FaUser />,
        <FaBook />,
        <FaStar />,
        <FaAward />,
        <FaClipboardCheck />
    ];

    const stepLabels = ["Tuteur", "Objectifs", "Évaluation", "Compétences", "Récapitulatif"];

    return (
        <motion.form
            className="max-w-2xl mx-auto bg-white/80 rounded-2xl shadow-2xl p-8 mt-8 border border-[#C3CFE2]"
            onSubmit={handleSubmit}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
            transition={{ duration: 0.3 }}
        >
            {/* Stepper professionnel avec connexions et icônes */}
            <div className="flex mb-10 justify-between relative">
                {/* Ligne de connexion sous les étapes */}
                <div className="absolute top-7 left-0 h-1 bg-[#C3CFE2] w-full z-0"></div>

                {stepLabels.map((label, i) => {
                    const isActive = step === i+1;
                    const isCompleted = completedSteps.includes(i+1);

                    return (
                        <div key={i} className="flex flex-col items-center relative z-10">
                            <div
                                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                                    isCompleted
                                        ? "bg-green-500 text-white"
                                        : isActive
                                            ? "bg-[#41729F] text-white"
                                            : "bg-[#C3CFE2] text-[#274472]"
                                }`}
                            >
                                {isCompleted ? <FaCheckCircle className="text-xl" /> : <span className="text-xl">{stepIcons[i]}</span>}
                            </div>
                            <span className={`mt-2 text-xs font-bold transition-colors duration-300 ${
                                isActive || isCompleted ? "text-[#41729F]" : "text-[#8DA9C4]"
                            }`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Étape 1 : Informations du Tuteur */}
            {step === 1 && (
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={fadeIn}
                    className="bg-white/70 rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-2xl font-bold mb-6 text-[#41729F] flex items-center">
                        <FaUser className="mr-2" />Informations du Tuteur
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-[#274472] font-medium mb-1">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className={`w-full px-3 py-2 rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                    value={tuteur.email}
                                    onChange={e => {
                                        setTuteur(t => ({ ...t, email: e.target.value }));
                                        setEmailChecked(false);
                                        setTuteurExistsMessage(null);
                                        setEmailVerified(false);
                                        setEmailVerificationSent(false);
                                    }}
                                    disabled={emailVerified}
                                />
                                {checkingEmail && (
                                    <div className="absolute right-3 top-2">
                                        <FaSpinner className="animate-spin text-[#41729F]" />
                                    </div>
                                )}
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

                            {tuteurExistsMessage && (
                                <div className={`mt-2 p-2 rounded-md text-sm flex items-center ${
                                    tuteurExistsMessage.type === 'success'
                                        ? 'bg-green-100 text-green-800'
                                        : tuteurExistsMessage.type === 'error'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-blue-100 text-blue-800'
                                }`}>
                                    <FaExclamationCircle className="mr-2" />
                                    {tuteurExistsMessage.text}
                                </div>
                            )}

                            {/* Section de vérification d'email */}
                            {!emailVerified && tuteur.email && !/^\S+@\S+\.\S+$/.test(tuteur.email) === false && (
                                <div className="mt-4 border border-[#B7C9E2] rounded-xl p-4 bg-[#F0F4F8]">
                                    <h3 className="text-[#41729F] font-semibold mb-2 flex items-center">
                                        <FaEnvelope className="mr-2" />Vérification de l'email
                                    </h3>

                                    {!emailVerificationSent ? (
                                        <div>
                                            <p className="text-sm text-[#274472] mb-3">
                                                Nous devons vérifier que vous êtes bien le propriétaire de cette adresse email.
                                            </p>
                                            <button
                                                type="button"
                                                className={`py-2 px-4 rounded-lg ${isVerifyingEmail ? 'bg-gray-300' : 'bg-[#41729F]'} text-white font-medium flex items-center`}
                                                onClick={sendVerificationEmail}
                                                disabled={isVerifyingEmail}
                                            >
                                                {isVerifyingEmail ? (
                                                    <>
                                                        <FaSpinner className="animate-spin mr-2" />
                                                        Envoi en cours...
                                                    </>
                                                ) : (
                                                    <>Envoyer un code de vérification</>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm text-[#274472] mb-3">
                                                Un code de vérification a été envoyé à {tuteur.email}.
                                                Veuillez entrer ce code ci-dessous:
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    className="w-40 px-3 py-2 rounded-xl border border-[#B7C9E2] bg-white text-[#41729F] text-center text-xl font-bold tracking-widest"
                                                    value={enteredCode}
                                                    onChange={e => setEnteredCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                                                    placeholder="123456"
                                                    maxLength={6}
                                                />
                                                <button
                                                    type="button"
                                                    className="py-2 px-4 rounded-lg bg-[#41729F] text-white font-medium"
                                                    onClick={verifyCode}
                                                >
                                                    Vérifier
                                                </button>

                                                <button
                                                    type="button"
                                                    className="py-2 px-4 rounded-lg bg-gray-200 text-[#274472] font-medium text-sm"
                                                    onClick={sendVerificationEmail}
                                                    disabled={isVerifyingEmail}
                                                >
                                                    {isVerifyingEmail ? 'Envoi...' : 'Renvoyer'}
                                                </button>
                                            </div>
                                            {verificationError && (
                                                <p className="text-red-500 text-xs mt-2">{verificationError}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Message de confirmation lorsque l'email est vérifié */}
                            {emailVerified && (
                                <div className="mt-2 p-2 rounded-md text-sm flex items-center bg-green-100 text-green-800">
                                    <FaCheckCircle className="mr-2" />
                                    Email vérifié avec succès !
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[#274472] font-medium mb-1">Nom</label>
                            <input
                                type="text"
                                className={`w-full px-3 py-2 rounded-xl border ${errors.nom ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                value={tuteur.nom}
                                onChange={e => setTuteur(t => ({ ...t, nom: e.target.value }))}
                            />
                            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                        </div>
                        <div>
                            <label className="block text-[#274472] font-medium mb-1">Prénom</label>
                            <input
                                type="text"
                                className={`w-full px-3 py-2 rounded-xl border ${errors.prenom ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                value={tuteur.prenom}
                                onChange={e => setTuteur(t => ({ ...t, prenom: e.target.value }))}
                            />
                            {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[#274472] font-medium mb-1">
                                <FaBuilding className="inline mr-1" />Entreprise
                            </label>
                            <input
                                type="text"
                                className={`w-full px-3 py-2 rounded-xl border ${errors.entreprise ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                value={tuteur.entreprise}
                                onChange={e => setTuteur(t => ({ ...t, entreprise: e.target.value }))}
                            />
                            {errors.entreprise && <p className="text-red-500 text-xs mt-1">{errors.entreprise}</p>}
                        </div>
                    </div>

                    {errors.verification && (
                        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
                            {errors.verification}
                        </div>
                    )}

                    <div className="flex justify-end mt-6">
                        <motion.button
                            type="button"
                            className={`py-3 px-6 rounded-xl font-bold shadow transition flex items-center ${
                                emailVerified
                                    ? "bg-[#41729F] text-white hover:bg-[#5885AF]"
                                    : "bg-gray-400 text-white cursor-not-allowed"
                            }`}
                            onClick={nextStep}
                            whileHover={emailVerified ? { scale: 1.05 } : {}}
                            whileTap={emailVerified ? { scale: 0.95 } : {}}
                            disabled={!emailVerified}
                        >
                            Suivant <FaArrowRight className="ml-2" />
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* Étape 2 : Objectifs et Description */}
            {step === 2 && (
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={fadeIn}
                    className="bg-white/70 rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-2xl font-bold mb-6 text-[#41729F] flex items-center">
                        <FaBook className="mr-2" />Description & Objectifs du stage
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[#274472] font-medium mb-1">Description du stage</label>
                            <textarea
                                className={`w-full px-3 py-2 rounded-xl border ${errors.description ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                value={stage.description}
                                onChange={e => setStage(s => ({ ...s, description: e.target.value }))}
                                rows={3}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                        <div>
                            <label className="block text-[#274472] font-medium mb-1">Objectif du stage</label>
                            <textarea
                                className={`w-full px-3 py-2 rounded-xl border ${errors.objectif ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                value={stage.objectif}
                                onChange={e => setStage(s => ({ ...s, objectif: e.target.value }))}
                                rows={2}
                            />
                            {errors.objectif && <p className="text-red-500 text-xs mt-1">{errors.objectif}</p>}
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        <motion.button
                            type="button"
                            className="py-3 px-6 rounded-xl bg-[#C3CFE2] text-[#274472] font-bold hover:bg-[#B7C9E2] transition flex items-center"
                            onClick={prevStep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="mr-2">←</span> Précédent
                        </motion.button>
                        <motion.button
                            type="button"
                            className="py-3 px-6 rounded-xl bg-[#41729F] text-white font-bold shadow hover:bg-[#5885AF] transition flex items-center"
                            onClick={nextStep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Suivant <FaArrowRight className="ml-2" />
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* Les autres étapes restent inchangées */}
            {/* Étape 3 : Évaluation générale */}
            {step === 3 && (
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={fadeIn}
                    className="bg-white/70 rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-2xl font-bold mb-6 text-[#41729F] flex items-center">
                        <FaStar className="mr-2" />Évaluation générale
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[#274472] font-medium mb-1">Implication dans ses activités</label>
                            <select
                                className={`w-full px-3 py-2 rounded-xl border ${errors.implication ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                value={evaluations.implication}
                                onChange={e => setEvaluations(ev => ({ ...ev, implication: e.target.value }))}
                            >
                                <option value="">Choisir…</option>
                                {EVALUATION_CHOICES.implication.map(v => <option key={v}>{v}</option>)}
                            </select>
                            {errors.implication && <p className="text-red-500 text-xs mt-1">{errors.implication}</p>}
                        </div>
                        <div>
                            <label className="block text-[#274472] font-medium mb-1">Ouverture aux autres</label>
                            <select
                                className={`w-full px-3 py-2 rounded-xl border ${errors.ouverture ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                value={evaluations.ouverture}
                                onChange={e => setEvaluations(ev => ({ ...ev, ouverture: e.target.value }))}
                            >
                                <option value="">Choisir…</option>
                                {EVALUATION_CHOICES.ouverture.map(v => <option key={v}>{v}</option>)}
                            </select>
                            {errors.ouverture && <p className="text-red-500 text-xs mt-1">{errors.ouverture}</p>}
                        </div>
                        <div>
                            <label className="block text-[#274472] font-medium mb-1">Qualité de ses productions</label>
                            <select
                                className={`w-full px-3 py-2 rounded-xl border ${errors.qualite ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                value={evaluations.qualite}
                                onChange={e => setEvaluations(ev => ({ ...ev, qualite: e.target.value }))}
                            >
                                <option value="">Choisir…</option>
                                {EVALUATION_CHOICES.qualite.map(v => <option key={v}>{v}</option>)}
                            </select>
                            {errors.qualite && <p className="text-red-500 text-xs mt-1">{errors.qualite}</p>}
                        </div>
                        <div>
                            <label className="block text-[#274472] font-medium mb-1">Observations sur l'ensemble du travail accompli</label>
                            <textarea
                                className={`w-full px-3 py-2 rounded-xl border ${errors.observations ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                value={evaluations.observations}
                                onChange={e => setEvaluations(ev => ({ ...ev, observations: e.target.value }))}
                                rows={2}
                            />
                            {errors.observations && <p className="text-red-500 text-xs mt-1">{errors.observations}</p>}
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        <motion.button
                            type="button"
                            className="py-3 px-6 rounded-xl bg-[#C3CFE2] text-[#274472] font-bold hover:bg-[#B7C9E2] transition flex items-center"
                            onClick={prevStep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="mr-2">←</span> Précédent
                        </motion.button>
                        <motion.button
                            type="button"
                            className="py-3 px-6 rounded-xl bg-[#41729F] text-white font-bold shadow hover:bg-[#5885AF] transition flex items-center"
                            onClick={nextStep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Suivant <FaArrowRight className="ml-2" />
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* Étape 4 : Compétences */}
            {step === 4 && (
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={fadeIn}
                    className="bg-white/70 rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-2xl font-bold mb-6 text-[#41729F] flex items-center">
                        <FaAward className="mr-2" />Compétences
                    </h2>
                    {competences.map((comp, idx) => (
                        <div key={idx} className="mb-6 border-b border-[#C3CFE2] pb-6">
                            <div className="mb-2 font-bold text-[#274472]">{comp.intitule}</div>
                            <div className="mb-4">
                                <label className="text-[#41729F]">Note sur 20 : </label>
                                <input
                                    type="number" min={0} max={20}
                                    className={`border ${errors.competences?.[`note_${idx}`] ? 'border-red-500' : 'border-[#B7C9E2]'} rounded-xl w-24 px-2 py-1 ml-2 text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                    value={comp.note}
                                    onChange={e => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setCompetences(cs => cs.map((c, i) => i === idx ? { ...c, note: val } : c))
                                    }}
                                />
                                {errors.competences?.[`note_${idx}`] &&
                                    <p className="text-red-500 text-xs mt-1">{errors.competences[`note_${idx}`]}</p>
                                }
                            </div>

                            {/* Sous-catégories prédéfinies */}
                            {comp.categories.length > 0 && (
                                <div className="bg-[#F0F4F8] rounded-xl p-4 mb-4">
                                    {comp.categories.map((cat, i) => (
                                        <div key={i} className="mb-3 flex flex-wrap items-center">
                                            <label className="text-[#274472] flex-grow mb-1 md:mb-0">{cat.intitule}</label>
                                            <select
                                                className={`border ${errors.competences?.[`cat_${idx}_${i}`] ? 'border-red-500' : 'border-[#B7C9E2]'} rounded-xl px-3 py-1 text-[#41729F] w-full md:w-auto md:ml-2 focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                                value={cat.valeur}
                                                onChange={e => {
                                                    setCompetences(cs => cs.map((c, cidx) =>
                                                        cidx === idx
                                                            ? {
                                                                ...c,
                                                                categories: c.categories.map((cc, j) =>
                                                                    j === i ? { ...cc, valeur: e.target.value } : cc
                                                                )
                                                            }
                                                            : c
                                                    ));
                                                }}
                                            >
                                                <option value="">Choisir…</option>
                                                {COMPETENCE_LEVELS.map(lvl => <option key={lvl}>{lvl}</option>)}
                                            </select>
                                            {errors.competences?.[`cat_${idx}_${i}`] &&
                                                <p className="text-red-500 text-xs mt-1 w-full md:text-right">{errors.competences[`cat_${idx}_${i}`]}</p>
                                            }
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Sous-catégories libres pour compétence 4 */}
                            {idx === 3 && (
                                <div className="mt-4">
                                    <div className="mb-3 font-semibold text-[#41729F]">Sous-catégories spécifiques au métier :</div>
                                    {comp.extraCategories.map((cat, catIdx) => (
                                        <div key={catIdx} className="flex flex-wrap gap-2 mb-3">
                                            <input
                                                type="text"
                                                placeholder="Intitulé"
                                                className={`flex-1 px-3 py-2 rounded-xl border ${errors.competences?.[`extra_title_${catIdx}`] ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                                value={cat.intitule}
                                                onChange={e => updateCompetence4Category(catIdx, "intitule", e.target.value)}
                                            />
                                            <select
                                                className={`w-full md:w-auto px-3 py-2 rounded-xl border ${errors.competences?.[`extra_val_${catIdx}`] ? 'border-red-500' : 'border-[#B7C9E2]'} bg-white text-[#41729F] focus:ring-2 focus:ring-[#5885AF] focus:outline-none transition`}
                                                value={cat.valeur}
                                                onChange={e => updateCompetence4Category(catIdx, "valeur", e.target.value)}
                                            >
                                                <option value="">Choisir…</option>
                                                {COMPETENCE_LEVELS.map(lvl => <option key={lvl}>{lvl}</option>)}
                                            </select>
                                            {errors.competences?.[`extra_title_${catIdx}`] &&
                                                <p className="text-red-500 text-xs mt-1">{errors.competences[`extra_title_${catIdx}`]}</p>
                                            }
                                            {errors.competences?.[`extra_val_${catIdx}`] &&
                                                <p className="text-red-500 text-xs mt-1">{errors.competences[`extra_val_${catIdx}`]}</p>
                                            }
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="mt-2 px-4 py-2 rounded-xl bg-[#C3CFE2] text-[#274472] font-medium hover:bg-[#B7C9E2] transition"
                                        onClick={addCompetence4Category}
                                    >
                                        + Ajouter une sous-catégorie
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-between mt-6">
                        <motion.button
                            type="button"
                            className="py-3 px-6 rounded-xl bg-[#C3CFE2] text-[#274472] font-bold hover:bg-[#B7C9E2] transition flex items-center"
                            onClick={prevStep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="mr-2">←</span> Précédent
                        </motion.button>
                        <motion.button
                            type="button"
                            className="py-3 px-6 rounded-xl bg-[#41729F] text-white font-bold shadow hover:bg-[#5885AF] transition flex items-center"
                            onClick={nextStep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Suivant <FaArrowRight className="ml-2" />
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* Étape 5 : Récapitulatif */}
            {step === 5 && (
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={fadeIn}
                    className="bg-white/70 rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-2xl font-bold mb-6 text-[#41729F] flex items-center">
                        <FaClipboardCheck className="mr-2" />Récapitulatif
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-[#F0F4F8] rounded-xl p-4">
                            <h3 className="font-bold text-[#274472] mb-2 flex items-center">
                                <FaUser className="mr-2" />Tuteur
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div><span className="font-semibold">Nom :</span> {tuteur.nom}</div>
                                <div><span className="font-semibold">Prénom :</span> {tuteur.prenom}</div>
                                <div><span className="font-semibold">Email :</span> {tuteur.email}</div>
                                <div><span className="font-semibold">Entreprise :</span> {tuteur.entreprise}</div>
                            </div>
                        </div>

                        <div className="bg-[#F0F4F8] rounded-xl p-4">
                            <h3 className="font-bold text-[#274472] mb-2 flex items-center">
                                <FaBook className="mr-2" />Stage
                            </h3>
                            <div className="mb-2">
                                <div className="font-semibold">Description :</div>
                                <div className="text-[#41729F] mt-1">{stage.description}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Objectif :</div>
                                <div className="text-[#41729F] mt-1">{stage.objectif}</div>
                            </div>
                        </div>

                        <div className="bg-[#F0F4F8] rounded-xl p-4">
                            <h3 className="font-bold text-[#274472] mb-2 flex items-center">
                                <FaStar className="mr-2" />Évaluations
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div><span className="font-semibold">Implication :</span> {evaluations.implication}</div>
                                <div><span className="font-semibold">Ouverture :</span> {evaluations.ouverture}</div>
                                <div><span className="font-semibold">Qualité :</span> {evaluations.qualite}</div>
                            </div>
                            <div className="mt-2">
                                <div className="font-semibold">Observations :</div>
                                <div className="text-[#41729F] mt-1">{evaluations.observations}</div>
                            </div>
                        </div>

                        <div className="bg-[#F0F4F8] rounded-xl p-4">
                            <h3 className="font-bold text-[#274472] mb-2 flex items-center">
                                <FaAward className="mr-2" />Compétences
                            </h3>
                            {competences.map((c, i) => (
                                <div key={i} className="mb-4 pb-3 border-b border-[#C3CFE2] last:border-0 last:pb-0 last:mb-0">
                                    <div className="font-semibold text-[#41729F]">{c.intitule} <span className="ml-2">(note : {c.note}/20)</span></div>
                                    <ul className="mt-2 space-y-1">
                                        {[...c.categories, ...(i === 3 ? c.extraCategories : [])].map((cat, j) => (
                                            cat.intitule && (
                                                <li key={j} className="flex justify-between">
                                                    <span>{cat.intitule}</span>
                                                    <span>{cat.valeur}</span>
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        <motion.button
                            type="button"
                            className="py-3 px-6 rounded-xl bg-[#C3CFE2] text-[#274472] font-bold hover:bg-[#B7C9E2] transition flex items-center"
                            onClick={prevStep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="mr-2">←</span> Précédent
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="py-3 px-6 rounded-xl bg-[#41729F] text-white font-bold shadow hover:bg-[#5885AF] transition flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Soumettre <FaArrowRight className="ml-2" />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </motion.form>
    );
}