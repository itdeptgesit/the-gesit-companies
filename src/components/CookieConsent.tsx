import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consented = localStorage.getItem('cookie_consent');
        if (!consented) {
            // Show after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);


    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 pointer-events-none"
                >
                    <div className="bg-white/95 backdrop-blur-md p-6 rounded-card border border-slate-200 shadow-2xl pointer-events-auto">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#BA9B32]/10 flex items-center justify-center text-[#BA9B32] shrink-0">
                                <Cookie size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-display font-bold text-navy-deep text-sm">We use cookies</h4>
                                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                                    We use cookies to analyze site traffic and enhance your user experience. By continuing, you agree to our use of cookies. <a href="/cookie-policy" className="text-navy-deep hover:text-[#BA9B32] underline decoration-slate-300 underline-offset-2 transition-all">Read our Cookie Policy</a>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-slate-400 hover:text-navy-deep transition-colors"
                                aria-label="Close cookie consent banner"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    localStorage.setItem('cookie_consent', 'false');
                                    setIsVisible(false);
                                    window.dispatchEvent(new Event('cookie_consent_updated'));
                                }}
                                className="px-6 py-2 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-slate-50 transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem('cookie_consent', 'true');
                                    setIsVisible(false);
                                    window.dispatchEvent(new Event('cookie_consent_updated'));
                                }}
                                className="px-6 py-2 bg-navy-deep text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#BA9B32] transition-colors shadow-lg"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
