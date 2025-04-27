import { FaBell } from "react-icons/fa";

export default function Header({ title = "Dashboard" }) {
    return (
        <header
            className="
                sticky top-0 z-20
                flex items-center justify-between
                px-8 py-4 mb-6
                bg-[#F5F7FA]/90 backdrop-blur-md
                rounded-2xl shadow
                mx-2 mt-4
            "
            style={{
                border: "none",
                boxShadow: "0 4px 24px 0 #41729F12",
            }}
        >
            <h2 className="text-2xl font-bold text-[#41729F] tracking-tight">{title}</h2>
            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-[#B7C9E2]/60 transition">
                    <FaBell className="text-xl text-[#5885AF]" />
                    {/* Badge notification */}
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#41729F] rounded-full border-2 border-white"></span>
                </button>
                {/* Avatar ou initiales user */}
                <div className="w-10 h-10 rounded-full bg-[#B7C9E2] flex items-center justify-center text-[#274472] font-bold shadow-md text-lg">
                    YL
                </div>
            </div>
        </header>
    );
}