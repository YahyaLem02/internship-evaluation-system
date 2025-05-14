// AuthService.js
import axios from "axios";
import { API_URL } from "../api";

class AuthService {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/api/auth/signin`, {
                email,
                password
            });

            if (response.data && response.data.token) {
                // Stocker les données utilisateur
                console.log("Stockage des informations utilisateur:", response.data);
                localStorage.setItem('user', JSON.stringify(response.data));

                // Configurer axios pour toutes les futures requêtes
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                console.log("Token configuré pour axios:", response.data.token);
            } else {
                console.error("Token non trouvé dans la réponse:", response.data);
            }

            return response.data;
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            throw error;
        }
    }
    async registerAdmin(adminData) {
        const dataToSend = {
            ...adminData,
            role: 'ADMIN'
        };

        return axios.post(`${API_URL}/api/auth/admin/register`, dataToSend);
    }
    async getAdmins() {
        return axios.get(`${API_URL}/api/auth/admins`);
    }


    logout() {
        localStorage.removeItem('user');

        // Réinitialiser l'en-tête d'autorisation
        delete axios.defaults.headers.common['Authorization'];

        console.log("Déconnexion réussie, informations utilisateur supprimées");
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            const user = JSON.parse(userStr);
            console.log("Utilisateur récupéré du localStorage:", user);
            return user;
        } catch (error) {
            console.error("Erreur lors de l'analyse des informations utilisateur:", error);
            return null;
        }
    }

    isAuthenticated() {
        const user = this.getCurrentUser();
        return !!user && !!user.token;
    }
    setupAxiosInterceptors() {
        const user = this.getCurrentUser();
        if (user && user.token) {
            console.log("Configuration des intercepteurs axios avec le token");

            // Configurer l'en-tête Authorization global
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

            // Configurer l'intercepteur de requête
            axios.interceptors.request.use(
                (config) => {
                    if (!config.headers.Authorization) {
                        config.headers.Authorization = `Bearer ${user.token}`;
                    }
                    return config;
                },
                (error) => {
                    return Promise.reject(error);
                }
            );

            // Configurer l'intercepteur de réponse
            axios.interceptors.response.use(
                (response) => {
                    return response;
                },
                (error) => {
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        console.log("Session expirée, déconnexion");
                        this.logout();
                        window.location.href = '/login';
                    }
                    return Promise.reject(error);
                }
            );
        } else {
            console.log("Aucun utilisateur connecté, pas de configuration des intercepteurs");
        }
    }

    //delete admin
    async deleteAdmin(adminId) {
        try {
            const response = await axios.delete(`${API_URL}/api/admin/${adminId}`);
            console.log("Admin supprimé avec succès:", response.data);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la suppression de l'admin:", error);
            throw error;
        }
    }
}

export default new AuthService();