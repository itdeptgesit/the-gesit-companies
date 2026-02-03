import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12"
            >
                <Link to="/" className="flex flex-col items-center gap-6 group">
                    <img src="/logo gesit.png" alt="Logo" className="h-12 md:h-14 group-hover:scale-105 transition-transform duration-500" />
                    <span className="block text-[14px] md:text-[16px] font-black text-navy-deep uppercase tracking-[0.15em]">THE GESIT COMPANIES</span>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 mb-16"
            >
                <h1 className="text-[70px] md:text-[80px] font-display font-bold leading-none text-[#BA9B32]">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-display text-navy-deep font-bold">
                    Page Not Found
                </h2>
                <p className="text-slate-400 text-base max-w-md mx-auto font-light leading-relaxed">
                    The page you are looking for may have been moved, deleted or is temporarily unavailable.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className=""
            >
                <Link
                    to="/"
                    className="inline-flex items-center gap-3 border-2 border-navy-deep text-navy-deep px-10 py-4 rounded-full font-bold text-[12px] uppercase tracking-widest hover:bg-navy-deep hover:text-white transition-all duration-500 group"
                >
                    Return to Homepage
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>

            <div className="mt-32">
                <p className="text-slate-300 text-[10px] uppercase tracking-[0.4em] font-bold">
                    © {new Date().getFullYear()} The Gesit Companies. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
