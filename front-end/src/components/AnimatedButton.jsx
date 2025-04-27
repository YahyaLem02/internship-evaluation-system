import { motion } from "framer-motion";
export default function AnimatedButton({ children, ...props }) {
    return (
        <motion.button
            whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(99,102,241,0.25)" }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold shadow-lg backdrop-blur-sm"
            {...props}
        >
            {children}
        </motion.button>
    );
}