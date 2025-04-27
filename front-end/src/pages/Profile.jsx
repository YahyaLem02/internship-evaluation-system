import { motion } from "framer-motion";
import { FaEnvelope, FaUser, FaBriefcase, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaEdit } from "react-icons/fa";

const user = {
    photo: "https://randomuser.me/api/portraits/men/32.jpg", // Tu peux changer ce lien pour une autre photo !
    name: "John Doe",
    email: "john.doe@email.com",
    role: "Étudiant",
    phone: "+33 1 23 45 67 89",
    birth: "1999-04-12",
    location: "Paris, France",
    field: "Informatique",
    company: "Université Sorbonne",
};

export default function Profile() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto border border-[#C3CFE2] flex flex-col md:flex-row items-center gap-10"
        >
            {/* PHOTO & EDIT */}
            <div className="relative flex-shrink-0">
                <img
                    src={user.photo}
                    alt={user.name}
                    className="w-40 h-40 rounded-full object-cover border-4 border-[#41729F] shadow-lg"
                />
                <button
                    className="absolute bottom-4 right-3 bg-[#41729F] text-white p-2 rounded-full shadow-md hover:bg-[#5885AF] transition"
                    title="Modifier la photo"
                >
                    <FaEdit />
                </button>
            </div>
            {/* INFOS */}
            <div className="flex-1 w-full space-y-3">
                <h2 className="text-3xl font-bold text-[#41729F] mb-2 flex items-center gap-2">
                    <FaUser className="text-[#5885AF]" /> {user.name}
                </h2>
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="text-[#5885AF]" />
                            <span className="font-semibold text-[#274472]">Email :</span>
                            <span className="ml-1 text-gray-700">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaBriefcase className="text-[#5885AF]" />
                            <span className="font-semibold text-[#274472]">Filière :</span>
                            <span className="ml-1 text-gray-700">{user.field}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-[#5885AF]" />
                            <span className="font-semibold text-[#274472]">Lieu :</span>
                            <span className="ml-1 text-gray-700">{user.location}</span>
                        </div>
                    </div>
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                            <FaPhone className="text-[#5885AF]" />
                            <span className="font-semibold text-[#274472]">Téléphone :</span>
                            <span className="ml-1 text-gray-700">{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaBirthdayCake className="text-[#5885AF]" />
                            <span className="font-semibold text-[#274472]">Date de naissance :</span>
                            <span className="ml-1 text-gray-700">{user.birth}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUser className="text-[#5885AF]" />
                            <span className="font-semibold text-[#274472]">Rôle :</span>
                            <span className="ml-1 text-gray-700">{user.role}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex gap-4">
                    <button className="px-6 py-2 rounded-lg font-semibold text-white bg-[#41729F] hover:bg-[#5885AF] transition">
                        Modifier profil
                    </button>
                    <button className="px-6 py-2 rounded-lg font-semibold text-[#41729F] border border-[#41729F] bg-white/80 hover:bg-[#B7C9E2]/60 transition">
                        Voir mon CV
                    </button>
                </div>
                <div className="mt-8 text-sm text-gray-400">
                    Entreprise / Université : <span className="font-semibold text-[#41729F]">{user.company}</span>
                </div>
            </div>
        </motion.div>
    );
}