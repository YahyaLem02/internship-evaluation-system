import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api";
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
    ArcElement,
    RadialLinearScale,
} from "chart.js";
import { Bar, Pie, Line, Doughnut, Radar } from "react-chartjs-2";
import { FaGraduationCap, FaChalkboardTeacher, FaBuilding, FaClipboardCheck } from "react-icons/fa";

// Enregistrer les composants ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale
);

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios
            .get(`${API_URL}/api/statistiques/dashboard`)
            .then((res) => {
                setStats(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement des statistiques:", err);
                setError("Erreur lors du chargement des statistiques");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-6 text-center">Chargement...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!stats) return <div className="p-6 text-center">Aucune donnée disponible</div>;

    // Préparer les données pour les graphiques
    const stagesByAnneeData = {
        labels: stats.stagesByAnnee.map((item) => item.annee),
        datasets: [
            {
                label: "Nombre de stages",
                data: stats.stagesByAnnee.map((item) => item.nombre),
                backgroundColor: "rgba(65, 114, 159, 0.7)",
                borderColor: "rgba(65, 114, 159, 1)",
                borderWidth: 1,
            },
        ],
    };

    const stagesByEntrepriseData = {
        labels: stats.stagesByEntreprise.map((item) => item.entreprise),
        datasets: [
            {
                label: "Nombre de stages",
                data: stats.stagesByEntreprise.map((item) => item.nombre),
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
        labels: stats.averageNotesByCompetence.map((item) => item.competence),
        datasets: [
            {
                label: "Note moyenne",
                data: stats.averageNotesByCompetence.map((item) => item.moyenne),
                backgroundColor: "rgba(255, 159, 64, 0.7)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#41729F] mb-6">Tableau de bord</h1>

            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Stagiaires"
                    value={stats.totalStagiaires}
                    icon={<FaGraduationCap />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Tuteurs"
                    value={stats.totalTuteurs}
                    icon={<FaChalkboardTeacher />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Stages"
                    value={stats.totalStages}
                    icon={<FaBuilding />}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Appréciations"
                    value={stats.totalAppreciations}
                    icon={<FaClipboardCheck />}
                    color="bg-yellow-500"
                />
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-[#41729F] mb-4">Stages par année universitaire</h2>
                    <Bar data={stagesByAnneeData} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-[#41729F] mb-4">Top entreprises d'accueil</h2>
                    <Pie data={stagesByEntrepriseData} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-[#41729F] mb-4">Stages évalués vs non évalués</h2>
                    <Doughnut data={stagesByEvaluationStatusData} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-[#41729F] mb-4">Notes moyennes par compétence</h2>
                    <Bar data={averageNotesByCompetenceData} />
                </div>
            </div>

            {/* Distribution des stages dans le temps */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-xl font-bold text-[#41729F] mb-4">Distribution des stages dans le temps</h2>
                <Line
                    data={{
                        labels: stats.stageDistributionByMonth.map((item) => `${item.mois}/${item.annee}`),
                        datasets: [
                            {
                                label: "Nombre de stages",
                                data: stats.stageDistributionByMonth.map((item) => item.nombre),
                                backgroundColor: "rgba(65, 114, 159, 0.5)",
                                borderColor: "rgba(65, 114, 159, 1)",
                                tension: 0.3,
                                fill: true,
                            },
                        ],
                    }}
                />
            </div>

            {/* Distribution des stagiaires par institution */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-xl font-bold text-[#41729F] mb-4">Stagiaires par institution</h2>
                <Bar
                    data={{
                        labels: stats.stagiairesByInstitution.map((item) => item.institution),
                        datasets: [
                            {
                                label: "Nombre de stagiaires",
                                data: stats.stagiairesByInstitution.map((item) => item.nombre),
                                backgroundColor: "rgba(88, 133, 175, 0.7)",
                                borderColor: "rgba(88, 133, 175, 1)",
                                borderWidth: 1,
                            },
                        ],
                    }}
                />
            </div>

            {/* Top tuteurs */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-xl font-bold text-[#41729F] mb-4">Top 5 tuteurs les plus actifs</h2>
                <Bar
                    data={{
                        labels: stats.topTuteurs.map((item) => `${item.nom} ${item.prenom}`),
                        datasets: [
                            {
                                label: "Nombre d'appréciations",
                                data: stats.topTuteurs.map((item) => item.nombre),
                                backgroundColor: "rgba(75, 192, 192, 0.7)",
                                borderColor: "rgba(75, 192, 192, 1)",
                                borderWidth: 1,
                            },
                        ],
                    }}
                />
            </div>

            {/* Distribution des évaluations */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-[#41729F] mb-4">Distribution des évaluations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...new Set(stats.evaluationDistribution.map((item) => item.categorie))].map((categorie) => {
                        const categorieData = stats.evaluationDistribution.filter((item) => item.categorie === categorie);
                        return (
                            <div key={categorie} className="bg-[#F5F7FA] p-4 rounded-lg">
                                <h3 className="font-semibold text-[#274472] mb-2">{categorie}</h3>
                                <Pie
                                    data={{
                                        labels: categorieData.map((item) => item.valeur),
                                        datasets: [
                                            {
                                                data: categorieData.map((item) => item.nombre),
                                                backgroundColor: [
                                                    "rgba(255, 99, 132, 0.7)",
                                                    "rgba(54, 162, 235, 0.7)",
                                                    "rgba(255, 206, 86, 0.7)",
                                                    "rgba(75, 192, 192, 0.7)",
                                                    "rgba(153, 102, 255, 0.7)",
                                                ],
                                                borderColor: [
                                                    "rgba(255, 99, 132, 1)",
                                                    "rgba(54, 162, 235, 1)",
                                                    "rgba(255, 206, 86, 1)",
                                                    "rgba(75, 192, 192, 1)",
                                                    "rgba(153, 102, 255, 1)",
                                                ],
                                                borderWidth: 1,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                position: "right",
                                            },
                                        },
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Composant pour les cartes statistiques
function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-gray-500 text-sm">{title}</h3>
                    <p className="text-3xl font-bold text-[#274472]">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color} text-white text-xl`}>{icon}</div>
            </div>
        </div>
    );
}