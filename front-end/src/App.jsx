import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import StageAnneeList from "./pages/StageAnneeList.jsx";
import StageAnneeForm from "./pages/StageAnneeForm.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                {/* Route parent avec layout et Outlet */}
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/stage-annee" element={<StageAnneeList />} />
                    <Route path="/stage-annee/create" element={<StageAnneeForm />} />
                    <Route path="/stage-annee/:id/edit" element={<StageAnneeForm />} />
                </Route>
                <Route path="*" element={<div>Page non trouvée</div>} />
            </Routes>
        </BrowserRouter>
    );
}