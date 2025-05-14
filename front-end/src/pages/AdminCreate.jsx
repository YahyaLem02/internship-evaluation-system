import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaPlus, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import AuthService from '../services/AuthService';

export default function AdminManagement() {
    const [admins, setAdmins] = useState([]);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    // Récupérer l'utilisateur actuel
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
        console.log("Current user:", user); // Vérifier les données utilisateur
    }, []);

    // Charger les administrateurs depuis l'API
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await AuthService.getAdmins();
                console.log("Admins loaded:", response.data); // Vérifier les données
                setAdmins(response.data);
            } catch (err) {
                console.error("Erreur lors du chargement des administrateurs:", err);
            }
        };

        fetchAdmins();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (formData.motDePasse !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);

        try {
            // Enlever confirmPassword avant d'envoyer
            const { confirmPassword, ...dataToSend } = formData;
            const newAdmin = await AuthService.registerAdmin(dataToSend);

            setSuccess(true);
            setAdmins([newAdmin.data, ...admins]); // Ajouter le nouvel admin à la liste
            setFormData({
                nom: '',
                prenom: '',
                email: '',
                motDePasse: '',
                confirmPassword: ''
            });

            // Attendre un moment pour montrer le message de succès avant de fermer
            setTimeout(() => {
                setIsModalOpen(false);
            }, 1500);

        } catch (err) {
            console.error("Erreur lors de la création de l'admin:", err);
            setError(err.response?.data?.message || "Une erreur est survenue lors de la création de l'administrateur");
        } finally {
            setLoading(false);
        }
    };

    // Correction: Fonction débogué pour la gestion du clic sur le bouton de suppression
    const handleDeleteClick = (admin) => {
        console.log("Delete click for admin:", admin); // Vérification de l'admin en console
        if (!admin) {
            console.error("Admin is undefined");
            return;
        }

        setAdminToDelete(admin);
        setIsDeleteModalOpen(true);
        console.log("Delete modal should be open now");
    };

    const handleDeleteConfirm = async () => {
        if (!adminToDelete) {
            console.error("No admin to delete");
            return;
        }

        console.log("Confirming delete for admin:", adminToDelete);
        setDeleteLoading(true);
        setDeleteSuccess(false);

        try {
            // S'assurer que l'ID est disponible
            const adminId = adminToDelete.id || adminToDelete._id;

            if (!adminId) {
                throw new Error("ID d'administrateur invalide");
            }

            await AuthService.deleteAdmin(adminId);
            console.log("Admin deleted successfully");
            setDeleteSuccess(true);

            // Mettre à jour la liste des admins
            setAdmins(admins.filter(admin => (admin.id || admin._id) !== adminId));

            // Fermer le modal après un court délai pour montrer le message de succès
            setTimeout(() => {
                setIsDeleteModalOpen(false);
                setAdminToDelete(null);
            }, 1500);

        } catch (err) {
            console.error("Erreur lors de la suppression de l'admin:", err);
            setError("Impossible de supprimer cet administrateur: " + (err.message || "Erreur inconnue"));
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#41729F]">Gestion des administrateurs</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-[#41729F] text-white px-4 py-2 rounded-lg hover:bg-[#5885AF] transition"
                >
                    <FaPlus className="mr-2" /> Ajouter un administrateur
                </button>
            </div>

            {/* Message d'erreur global */}
            {error && !isModalOpen && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p className="flex items-center">
                        <FaExclamationTriangle className="mr-2" />
                        {error}
                    </p>
                </div>
            )}

            {/* Tableau des administrateurs avec bordures améliorées */}
            <div className="overflow-x-auto rounded-xl shadow-lg">
                <table className="min-w-full border-collapse bg-white">
                    <thead>
                    <tr className="bg-gradient-to-r from-[#41729F] to-[#5885AF] text-white">
                        <th className="px-6 py-4 text-left font-bold rounded-tl-xl">Nom</th>
                        <th className="px-6 py-4 text-left font-bold">Prénom</th>
                        <th className="px-6 py-4 text-left font-bold">Email</th>
                        <th className="px-6 py-4 text-right font-bold rounded-tr-xl">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5EAF0]">
                    {admins.length > 0 ? (
                        admins.map((admin) => (
                            <tr key={admin.id || admin._id || `admin-${admin.email}`} className="hover:bg-[#F5F7FA] transition">
                                <td className="px-6 py-4 font-semibold text-[#274472]">{admin.nom || "—"}</td>
                                <td className="px-6 py-4 text-[#274472]">{admin.prenom || "—"}</td>
                                <td className="px-6 py-4 text-[#274472]">{admin.email}</td>
                                <td className="px-6 py-4 text-right">
                                    {/* Bouton avec un onClick plus prononcé et une meilleure visibilité */}
                                    <button
                                        onClick={() => handleDeleteClick(admin)}
                                        className="inline-flex items-center justify-center text-red-500 hover:text-white bg-white hover:bg-red-500 rounded-lg px-3 py-1.5 transition-colors border border-red-500"
                                        disabled={currentUser && (currentUser.id === admin.id || currentUser._id === admin._id)}
                                        title={currentUser && (currentUser.id === admin.id || currentUser._id === admin._id)
                                            ? "Vous ne pouvez pas supprimer votre propre compte"
                                            : "Supprimer cet administrateur"}
                                    >
                                        <FaTrashAlt className="mr-1" />
                                        <span>Supprimer</span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                Aucun administrateur trouvé
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal pour ajouter un administrateur */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl max-w-xl w-full p-6 shadow-lg"
                    >
                        <h2 className="text-xl font-bold text-[#41729F] mb-4">Ajouter un administrateur</h2>

                        {error && isModalOpen && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4">
                                Administrateur créé avec succès !
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#274472] font-medium mb-1">Nom</label>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-[#B7C9E2] focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#274472] font-medium mb-1">Prénom</label>
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-[#B7C9E2] focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[#274472] font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#B7C9E2] focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[#274472] font-medium mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    name="motDePasse"
                                    value={formData.motDePasse}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#B7C9E2] focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-[#274472] font-medium mb-1">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#B7C9E2] focus:ring-2 focus:ring-[#41729F] focus:outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Annuler
                                </button>
                                <motion.button
                                    type="submit"
                                    className="px-4 py-2 bg-[#41729F] text-white rounded-lg hover:bg-[#5885AF] transition"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                >
                                    {loading ? "En cours..." : "Ajouter"}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Modal de confirmation de suppression */}
            {isDeleteModalOpen && adminToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg"
                    >
                        <div className="text-center mb-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Êtes-vous sûr de vouloir supprimer l'administrateur <span className="font-semibold">{adminToDelete.prenom || ""} {adminToDelete.nom || ""}</span> ? Cette action est irréversible.
                                </p>
                            </div>
                        </div>

                        {deleteSuccess && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4">
                                Administrateur supprimé avec succès !
                            </div>
                        )}

                        <div className="flex justify-center gap-4 mt-5">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                disabled={deleteLoading}
                            >
                                Annuler
                            </button>
                            <motion.button
                                type="button"
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={deleteLoading || deleteSuccess}
                            >
                                {deleteLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Suppression...
                                    </>
                                ) : (
                                    <>
                                        <FaTrashAlt className="mr-2" /> Supprimer
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}