import { motion } from "framer-motion";
import { Mail, Phone, Settings } from "lucide-react";

const MaintenancePage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12"
            >
                <div className="flex flex-col items-center gap-6">
                    <img src="/logo gesit.png" alt="Logo" className="h-12 md:h-14" />
                    <span className="block text-[14px] md:text-[16px] font-black text-navy-deep uppercase tracking-[0.15em]">THE GESIT COMPANIES</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 mb-16"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-[#BC9C33]">
                        <Settings size={40} className="animate-spin-slow" />
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-display text-navy-deep font-bold leading-tight uppercase tracking-tight">
                    Under <span className="text-[#BC9C33]">Maintenance</span>
                </h1>
                <p className="text-slate-400 text-base max-w-md mx-auto font-light leading-relaxed">
                    Our digital workspace is currently being refined to provide a better experience. We'll be back online shortly.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-16 flex flex-col md:flex-row gap-8 items-center"
            >
                <div className="flex items-center gap-3 text-navy-deep font-medium">
                    <Mail size={18} className="text-[#BC9C33]" />
                    <a href="mailto:contact@gesit.co.id" className="hover:text-[#BC9C33] transition-colors uppercase tracking-widest text-[11px] font-bold">contact@gesit.co.id</a>
                </div>
                <div className="flex items-center gap-3 text-navy-deep font-medium">
                    <Phone size={18} className="text-[#BC9C33]" />
                    <a href="tel:+62213101601" className="hover:text-[#BC9C33] transition-colors uppercase tracking-widest text-[11px] font-bold">+62 21 3101 601</a>
                </div>
            </motion.div>

            <div className="mt-32">
                <p className="text-slate-300 text-[10px] uppercase tracking-[0.4em] font-bold">
                    © {new Date().getFullYear()} The Gesit Companies. All rights reserved.
                </p>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default MaintenancePage;



