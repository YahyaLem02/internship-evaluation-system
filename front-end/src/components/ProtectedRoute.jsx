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
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;