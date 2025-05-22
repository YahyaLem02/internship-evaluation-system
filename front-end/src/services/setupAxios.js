import axios from 'axios';

export const setupAxios = () => {
    // Récupérer l'utilisateur du localStorage au démarrage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        // Définir l'en-tête global
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        console.log("Token récupéré du localStorage et configuré pour axios");
    }

    // Configurer les intercepteurs
    axios.interceptors.request.use(
        (config) => {
            // Ajouter un timeout
            config.timeout = 10000;

            console.log(`Requête ${config.method?.toUpperCase() || 'GET'} à ${config.url}`);

            return config;
        },
        (error) => {
            console.error("Erreur lors de la préparation de la requête:", error);
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        (response) => {
            console.log(`Réponse de ${response.config.url}: ${response.status}`);
            return response;
        },
        (error) => {
            if (error.code === 'ECONNABORTED') {
                console.error('Timeout de la requête:', error.config.url);
            } else if (error.response) {
                console.error(`Erreur ${error.response.status} pour ${error.config.url}:`,
                    error.response.data);

                // Gérer les erreurs d'authentification
                if (error.response.status === 401 || error.response.status === 403) {
                    console.log('Session expirée, déconnexion...');
                    localStorage.removeItem('user');

                    // Créer une notification
                    const notification = document.createElement('div');
                    notification.style.position = 'fixed';
                    notification.style.top = '20px';
                    notification.style.right = '20px';
                    notification.style.padding = '15px';
                    notification.style.backgroundColor = '#f8d7da';
                    notification.style.color = '#721c24';
                    notification.style.borderRadius = '5px';
                    notification.style.zIndex = '9999';
                    notification.textContent = 'Session expirée, redirection vers la page de connexion...';

                    document.body.appendChild(notification);

                    // Rediriger après un délai
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                }
            }

            return Promise.reject(error);
        }
    );
};
