import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import StageAnneeList from "./pages/StageAnneeList.jsx";
import StageAnneeForm from "./pages/StageAnneeForm.jsx";
import PublicStageForm from "./pages/PublicStageForm.jsx";
import StageAnneeDetail from "./pages/StageAnneeDetail.jsx";
import AppreciationForm from "./components/AppreciationForm.jsx";
import AppreciationFormPage from "./pages/AppreciationFormPage.jsx";
import StagiairesList from "./pages/StagiairesList.jsx"; // Changé de EtudiantsList
import StagiaireDetail from "./pages/StagiaireDetail.jsx"; // Changé de EtudiantDetail
import TuteursList from "./pages/TuteursList.jsx";
import TuteurDetail from "./pages/TuteurDetail.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/stage-inscription/:token" element={<PublicStageForm />} />
                <Route path="/appreciation/:token" element={<AppreciationFormPage />} />
                {/* Route parent avec layout et Outlet */}
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Routes pour les stages */}
                    <Route path="/stage-annee" element={<StageAnneeList />} />
                    <Route path="/stage-annee/create" element={<StageAnneeForm />} />
                    <Route path="/stage-annee/:id/edit" element={<StageAnneeForm />} />
                    <Route path="/stage-annee/:id" element={<StageAnneeDetail />} />

                    {/* Routes pour les stagiaires */}
                    <Route path="/stagiaires" element={<StagiairesList />} />
                    <Route path="/stagiaires/:id" element={<StagiaireDetail />} />

                    {/* Routes pour les tuteurs */}
                    <Route path="/tuteurs" element={<TuteursList />} />
                    <Route path="/tuteurs/:id" element={<TuteurDetail />} />

                    {/* Route pour les appréciations */}

                    {/* Autres routes */}
                    <Route path="/settings" element={<div className="p-6">Page de paramètres</div>} />
                </Route>
                <Route path="*" element={<div>Page non trouvée</div>} />
            </Routes>
        </BrowserRouter>
    );
}