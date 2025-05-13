import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    useEffect(() => {
        // Configurer les intercepteurs d'Axios
        AuthService.setupAxiosInterceptors();
    }, []);

    const isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // TODO: Si adminOnly est true, vérifier que l'utilisateur est un admin
    // Ceci nécessiterait d'ajouter le rôle dans le token JWT ou de faire une requête supplémentaire

    return children;
};

export default ProtectedRoute;