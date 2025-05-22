import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProfileAdmin from "./pages/ProfileAdmin.jsx";
import ProfileStagiaire from "./pages/ProfileStagiaire.jsx";
import Login from "./pages/Login";
import StageAnneeList from "./pages/StageAnneeList.jsx";
import StageAnneeForm from "./pages/StageAnneeForm.jsx";
import PublicStageForm from "./pages/PublicStageForm.jsx";
import StageAnneeDetail from "./pages/StageAnneeDetail.jsx";
import AppreciationForm from "./components/AppreciationForm.jsx";
import AppreciationFormPage from "./pages/AppreciationFormPage.jsx";
import StagiairesList from "./pages/StagiairesList.jsx";
import StagiaireDetail from "./pages/StagiaireDetail.jsx";
import TuteursList from "./pages/TuteursList.jsx";
import TuteurDetail from "./pages/TuteurDetail.jsx";
import AdminCreate from "./pages/AdminCreate.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import StagiareDashboard from "./pages/StagiareDashboard.jsx";
import AuthService from "./services/AuthService";

export default function App() {
    // Fonction pour déterminer le composant de profil à afficher en fonction du rôle
    const ProfileComponent = () => {
        const user = AuthService.getCurrentUser();
        if (user && user.role === "ADMIN") {
            return <ProfileAdmin />;
        } else if (user && user.role === "STAGIAIRE") {
            return <ProfileStagiaire />;
        } else {
            // Fallback si le rôle est inconnu
            return <div>Profil non disponible</div>;
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Login />} />
                <Route path="/stage-inscription/:token" element={<PublicStageForm />} />
                <Route path="/appreciation/:token" element={<AppreciationFormPage />} />

                {/* Routes protégées */}
                <Route element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                    {/* Route par défaut pour les étudiants */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Route de profil qui utilise la fonction pour déterminer le composant */}
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfileComponent />
                        </ProtectedRoute>
                    } />

                    {/*Route pour le dashboard étudiant */}
                    <Route path="/student-dashboard" element={<StagiareDashboard />} />

                    {/* Routes pour les stages (admin uniquement) */}
                    <Route path="/stage-annee" element={
                        <ProtectedRoute adminOnly={true}>
                            <StageAnneeList />
                        </ProtectedRoute>
                    } />
                    <Route path="/stage-annee/create" element={
                        <ProtectedRoute adminOnly={true}>
                            <StageAnneeForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/stage-annee/:id/edit" element={
                        <ProtectedRoute adminOnly={true}>
                            <StageAnneeForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/stage-annee/:id" element={
                        <ProtectedRoute adminOnly={true}>
                            <StageAnneeDetail />
                        </ProtectedRoute>
                    } />

                    {/* Routes pour les stagiaires */}
                    <Route path="/stagiaires" element={
                        <ProtectedRoute adminOnly={true}>
                            <StagiairesList />
                        </ProtectedRoute>
                    } />
                    <Route path="/stagiaires/:id" element={<StagiaireDetail />} />

                    {/* Routes pour les tuteurs (admin uniquement) */}
                    <Route path="/tuteurs" element={
                        <ProtectedRoute adminOnly={true}>
                            <TuteursList />
                        </ProtectedRoute>
                    } />
                    <Route path="/tuteurs/:id" element={
                        <ProtectedRoute adminOnly={true}>
                            <TuteurDetail />
                        </ProtectedRoute>
                    } />

                    {/* Route pour créer un admin (admin uniquement) */}
                    <Route path="/admin/create" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminCreate />
                        </ProtectedRoute>
                    } />

                    {/* Autres routes */}
                    <Route path="/settings" element={<div className="p-6">Page de paramètres</div>} />
                </Route>
                <Route path="*" element={<div>Page non trouvée</div>} />
            </Routes>
        </BrowserRouter>
    );
}