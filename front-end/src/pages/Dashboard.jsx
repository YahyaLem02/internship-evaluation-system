import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "../components/AnimatedButton";
import { useState } from "react";
import { FaUserGraduate, FaCheckCircle, FaClock } from "react-icons/fa";

// Palette adaptée
const widgets = [
    {
        title: "Stages validés",
        icon: <FaCheckCircle className="text-[#009688] text-4xl" />,
        value: 12,
        color: "from-[#B2DFDB] to-[#E0F7FA]", // vert-bleu clair
    },
    {
        title: "Étudiants inscrits",
        icon: <FaUserGraduate className="text-[#41729F] text-4xl" />,
        value: 34,
        color: "from-[#C3CFE2] to-[#F5F7FA]", // bleu pétrole très clair à gris bleu doux
    },
    {
        title: "Évaluations en attente",
        icon: <FaClock className="text-[#5885AF] text-4xl" />,
        value: 5,
        color: "from-[#B7C9E2] to-[#E3ECF7]", // bleu clair à gris bleu clair
    },
];

export default function Dashboard() {
    const [show, setShow] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="space-y-10"
        >
            <motion.h1
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
                className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#41729F] via-[#009688] to-[#5885AF]"
            >
                Bienvenue sur votre Dashboard
            </motion.h1>

            <div className="flex justify-center">
                <AnimatedButton onClick={() => setShow((v) => !v)}>
                    {show ? "Masquer les widgets" : "Afficher les widgets"}
                </AnimatedButton>
            </div>

            <AnimatePresence>
                {show && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.18 } },
                            exit: { opacity: 0, transition: { staggerChildren: 0.1, staggerDirection: -1 } },
                        }}
                    >
                        {widgets.map((w, i) => (
                            <motion.div
                                key={w.title}
                                whileHover={{
                                    scale: 1.06,
                                    boxShadow: "0 6px 44px 0 #41729F33",
                                    rotate: [0, 1.5, -1.5, 0],
                                    transition: { duration: 0.4, type: "spring" },
                                }}
                                variants={{
                                    hidden: { opacity: 0, y: 60, scale: 0.92 },
                                    visible: { opacity: 1, y: 0, scale: 1 },
                                    exit: { opacity: 0, y: 60, scale: 0.85 },
                                }}
                                transition={{ duration: 0.7, type: "spring" }}
                                className={`
                  bg-gradient-to-br ${w.color} 
                  rounded-3xl p-7 shadow-2xl border border-white/40
                  flex flex-col items-center relative overflow-hidden
                  backdrop-blur-xl
                  hover:shadow-[#41729F33]
                `}
                            >
                                <div className="mb-3">{w.icon}</div>
                                <div className="text-xl font-bold text-[#274472]">{w.title}</div>
                                <motion.div
                                    initial={{ scale: 0.7 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.15, type: "spring", bounce: 0.6 }}
                                    className="text-5xl font-extrabold text-[#41729F] mt-2"
                                >
                                    {w.value}
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}