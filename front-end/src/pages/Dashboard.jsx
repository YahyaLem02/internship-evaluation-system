import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api";
import AuthService from "../services/AuthService";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { FaGraduationCap, FaChalkboardTeacher, FaBuilding, FaClipboardCheck } from "react-icons/fa";

// Enregistrer les composants ChartJS nécessaires
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Vérifier l'authentification
        const user = AuthService.getCurrentUser();
        if (!user || !user.token) {
            console.log("Non authentifié, redirection vers login");
            window.location.href = "/login";
            return;
        }

        // Configurer le token pour toutes les requêtes axios
        console.log("Configuration du token pour axios");
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

        // Charger les statistiques
        setLoading(true);
        axios
            .get(`${API_URL}/api/statistiques/dashboard`)
            .then((res) => {
                console.log("Statistiques chargées avec succès");
                setStats(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement des statistiques:", err);

                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    console.log("Erreur d'authentification, déconnexion");
                    AuthService.logout();
                    window.location.href = "/login";
                } else {
                    setError("Erreur lors du chargement des statistiques");
                    setLoading(false);
                }
            });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#41729F] mx-auto mb-6"></div>
                <p className="text-[#41729F] font-medium">Chargement des statistiques...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <div className="text-red-500 font-bold text-xl mb-4">Erreur</div>
                <p className="text-red-400">{error}</p>
            </div>
        </div>
    );

    if (!stats) return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center text-[#5885AF] font-medium">
                Aucune donnée statistique disponible
            </div>
        </div>
    );

    // Limiter les données pour une meilleure lisibilité
    const limitedStagesByAnnee = stats.stagesByAnnee.slice(0, 6);
    const limitedStagesByEntreprise = stats.stagesByEntreprise.slice(0, 5);
    const limitedAverageNotesByCompetence = stats.averageNotesByCompetence.slice(0, 6);
    const limitedStagiairesByInstitution = stats.stagiairesByInstitution.slice(0, 6);

    // Préparer les données pour les graphiques
    const stagesByAnneeData = {
        labels: limitedStagesByAnnee.map((item) => item.annee),
        datasets: [
            {
                label: "Nombre de stages",
                data: limitedStagesByAnnee.map((item) => item.nombre),
                backgroundColor: "rgba(65, 114, 159, 0.7)",
                borderColor: "rgba(65, 114, 159, 1)",
                borderWidth: 1,
            },
        ],
    };

    const stagesByEntrepriseData = {
        labels: limitedStagesByEntreprise.map((item) => item.entreprise),
        datasets: [
            {
                label: "Nombre de stages",
                data: limitedStagesByEntreprise.map((item) => item.nombre),
                backgroundColor: [
                    "rgba(65, 114, 159, 0.7)",
                    "rgba(88, 133, 175, 0.7)",
                    "rgba(139, 167, 196, 0.7)",
                    "rgba(183, 201, 226, 0.7)",
                    "rgba(212, 225, 245, 0.7)",
                ],
                borderColor: [
                    "rgba(65, 114, 159, 1)",
                    "rgba(88, 133, 175, 1)",
                    "rgba(139, 167, 196, 1)",
                    "rgba(183, 201, 226, 1)",
                    "rgba(212, 225, 245, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const stagesByEvaluationStatusData = {
        labels: stats.stagesByEvaluationStatus.map((item) => item.evalue ? "Évalués" : "Non évalués"),
        datasets: [
            {
                label: "Stages",
                data: stats.stagesByEvaluationStatus.map((item) => item.nombre),
                backgroundColor: ["rgba(75, 192, 192, 0.7)", "rgba(255, 99, 132, 0.7)"],
                borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
                borderWidth: 1,
            },
        ],
    };

    const averageNotesByCompetenceData = {
        labels: limitedAverageNotesByCompetence.map((item) => item.competence),
        datasets: [
            {
                label: "Note moyenne",
                data: limitedAverageNotesByCompetence.map((item) => item.moyenne),
                backgroundColor: "rgba(255, 159, 64, 0.7)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
            },
        ],
    };

    const stagiairesByInstitutionData = {
        labels: limitedStagiairesByInstitution.map((item) => item.institution || "Non spécifié"),
        datasets: [
            {
                label: "Nombre de stagiaires",
                data: limitedStagiairesByInstitution.map((item) => item.nombre),
                backgroundColor: "rgba(88, 133, 175, 0.7)",
                borderColor: "rgba(88, 133, 175, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Options communes pour tous les graphiques
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: 20
        }
    };

    // Options pour les graphiques circulaires
    const pieOptions = {
        ...commonOptions,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '50%' // Pour le Doughnut, utilisé également pour la cohérence avec Pie
    };

    // Options pour les graphiques à barres
    const barOptions = {
        ...commonOptions,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 10
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 10
                    },
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    // Options pour les graphiques à barres horizontales
    const horizontalBarOptions = {
        ...commonOptions,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 10
                    }
                }
            },
            y: {
                ticks: {
                    font: {
                        size: 10
                    }
                }
            }
        }
    };

    return (
        <div className="p-6 bg-[#F5F7FA]">
            <h1 className="text-2xl font-bold text-[#41729F] mb-6">Tableau de bord</h1>

            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Stagiaires"
                    value={stats.totalStagiaires}
                    icon={<FaGraduationCap />}
                    color="bg-[#41729F]"
                    textColor="text-[#41729F]"
                />
                <StatCard
                    title="Tuteurs"
                    value={stats.totalTuteurs}
                    icon={<FaChalkboardTeacher />}
                    color="bg-[#5885AF]"
                    textColor="text-[#5885AF]"
                />
                <StatCard
                    title="Stages"
                    value={stats.totalStages}
                    icon={<FaBuilding />}
                    color="bg-[#274472]"
                    textColor="text-[#274472]"
                />
                <StatCard
                    title="Appréciations"
                    value={stats.totalAppreciations}
                    icon={<FaClipboardCheck />}
                    color="bg-[#B7C9E2]"
                    textColor="text-[#5885AF]"
                />
            </div>

            {/* Première rangée de graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Stages par année universitaire */}
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold text-[#41729F] mb-2">Stages par année universitaire</h2>
                    <div className="h-72">
                        <Bar data={stagesByAnneeData} options={barOptions} />
                    </div>
                </div>

                {/* Notes moyennes par compétence */}
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold text-[#41729F] mb-2">Notes moyennes par compétence</h2>
                    <div className="h-72">
                        <Bar data={averageNotesByCompetenceData} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* Deuxième rangée de graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Diagrammes circulaires ensemble */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Top entreprises d'accueil */}
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <h2 className="text-lg font-bold text-[#41729F] mb-2 text-center">Top entreprises d'accueil</h2>
                        <div className="h-72 flex items-center justify-center">
                            <div className="w-full h-full max-w-[350px]">
                                <Pie data={stagesByEntrepriseData} options={pieOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Stages évalués vs non évalués */}
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <h2 className="text-lg font-bold text-[#41729F] mb-2 text-center">Stages évalués vs non évalués</h2>
                        <div className="h-72 flex items-center justify-center">
                            <div className="w-full h-full max-w-[350px]">
                                <Doughnut data={stagesByEvaluationStatusData} options={pieOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stagiaires par institution */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                <h2 className="text-lg font-bold text-[#41729F] mb-2 text-center">Stagiaires par institution</h2>
                <div className="h-72">
                    <Bar data={stagiairesByInstitutionData} options={horizontalBarOptions} />
                </div>
            </div>
        </div>
    );
}

// Composant pour les cartes statistiques
function StatCard({ title, value, icon, color, textColor }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
                </div>
                <div className={`p-2 rounded-full ${color} text-white flex items-center justify-center`} style={{ width: '40px', height: '40px' }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}