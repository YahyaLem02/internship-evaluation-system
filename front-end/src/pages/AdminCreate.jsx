import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaPlus } from 'react-icons/fa';
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

    // Charger les administrateurs depuis l'API
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await AuthService.getAdmins(); // Assurez-vous que cette méthode existe
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
            setIsModalOpen(false); // Fermer le modal après succès
        } catch (err) {
            console.error("Erreur lors de la création de l'admin:", err);
            setError(err.response?.data?.message || "Une erreur est survenue lors de la création de l'administrateur");
        } finally {
            setLoading(false);
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

            {/* Tableau des administrateurs */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-[#C3CFE2] bg-white/70 rounded-xl shadow-xl">
                    <thead className="bg-[#41729F] text-white">
                    <tr>
                        <th className="px-6 py-4 text-left font-bold">Nom</th>
                        <th className="px-6 py-4 text-left font-bold">Prénom</th>
                        <th className="px-6 py-4 text-left font-bold">Email</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5EAF0]">
                    {admins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-[#F5F7FA] transition">
                            <td className="px-6 py-4 font-semibold text-[#274472]">{admin.nom}</td>
                            <td className="px-6 py-4 text-[#274472]">{admin.prenom}</td>
                            <td className="px-6 py-4 text-[#274472]">{admin.email}</td>
                        </tr>
                    ))}
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
                        className="bg-white rounded-xl max-w-xl w-full p-6"
                    >
                        <h2 className="text-xl font-bold text-[#41729F] mb-4">Ajouter un administrateur</h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
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
        </div>
    );
}