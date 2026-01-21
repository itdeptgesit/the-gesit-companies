import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

/**
 * BackToTop - Premium Navigation Component
 * Features a circular scroll progress indicator, glassmorphic styling,
 * and high-fidelity animations.
 */
const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();

    // Smooth progress for the circular ring
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    className="fixed bottom-8 right-8 z-[100]"
                >
                    <button
                        onClick={scrollToTop}
                        className="relative group p-2 flex items-center justify-center cursor-pointer"
                        aria-label="Back to top"
                    >
                        {/* Progress Ring Background */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                            {/* Static Track */}
                            <circle
                                cx="50"
                                cy="50"
                                r="46"
                                className="stroke-slate-200 fill-white/80 backdrop-blur-md"
                                strokeWidth="6"
                                fillOpacity="1"
                            />
                            {/* Dynamic Progress Stroke */}
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="46"
                                className="stroke-[#BA9B32] fill-transparent"
                                strokeWidth="6"
                                strokeLinecap="round"
                                style={{
                                    pathLength: smoothProgress,
                                }}
                            />
                        </svg>

                        {/* Interactive Icon Layer */}
                        <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-[#BA9B32] group-hover:text-white text-navy-deep">
                            <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />

                            {/* Hover Tooltip/Label */}
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-deep text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0">
                                TOP
                            </span>
                        </div>
                    </button>

                    {/* Subtle Glow Effect */}
                    <div className="absolute inset-0 bg-[#BA9B32]/10 rounded-full blur-[15px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
