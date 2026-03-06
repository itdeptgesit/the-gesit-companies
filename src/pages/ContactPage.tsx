import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Phone, Mail, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { sendContactEmail } from "../lib/email";
import ReCAPTCHA from "react-google-recaptcha";
import { useSettings } from "../context/SettingsContext";

/**
 * ContactPage - Final Refined Corporate Design
 * Blends the reference-based split layout with a consistent hero and comprehensive contact details.
 */
const ContactPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        agreed: false
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;



    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] as any }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Spam Check: Rate Limiting (5 minutes)
        const lastContactSubmit = localStorage.getItem('contact_last_submit');
        if (lastContactSubmit) {
            const lastTime = parseInt(lastContactSubmit);
            const now = Date.now();
            if (now - lastTime < 5 * 60 * 1000) { // 5 minutes
                setErrorMessage("You have already sent a message recently. Please wait a few minutes before sending another.");
                setStatus('error');
                setShowStatusModal(true);
                return;
            }
        }

        if (!captchaToken) {
            setErrorMessage("Please complete the reCAPTCHA verification.");
            setStatus('error');
            setShowStatusModal(true);
            return;
        }

        setStatus('sending');
        setErrorMessage("");

        try {
            // 1. Save to Supabase database
            const { error: dbError } = await supabase
                .from('contact_submissions')
                .insert([{
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    message: formData.message
                }]);

            if (dbError) throw dbError;

            // 2. Send email via Email Service (SMTP via EmailJS)
            const emailResult = await sendContactEmail({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                message: formData.message
            });

            if (!emailResult.success) {
                throw new Error(emailResult.error || 'Failed to send email');
            }

            // Set cooldown
            localStorage.setItem('contact_last_submit', Date.now().toString());

            // Success!
            setStatus('success');
            setShowStatusModal(true);
            setFormData({ firstName: "", lastName: "", email: "", message: "", agreed: false });
            setCaptchaToken(null);

        } catch (error: any) {
            console.error('Contact form error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
            setShowStatusModal(true);
        }
    };


    const { settings } = useSettings();

    // Removed duplicated state hooks block that was here in original (lines 13-24 were correct, but need to make sure we don't duplicate or shadow)
    // Actually, I'll just keeping the surrounding code as I am replacing the card definition.


    return (
        <div className="bg-slate-50 min-h-screen font-body text-navy-deep overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="400" cy="200" r="300" stroke="currentColor" strokeWidth="1" />
                    <circle cx="400" cy="200" r="250" stroke="#BA9B32" strokeWidth="0.5" />
                    <circle cx="400" cy="600" r="200" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* 1. Cinematic Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.img
                        src="/contact/cover.png"
                        alt="Contact Gesit"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.15 }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "linear"
                        }}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 70%' }}
                    />
                    {/* Gradient Overlay matching CSR/News */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#103065]/80 via-[#103065]/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* Content Area - Precisely Aligned with CSR/News */}
                <div className="absolute inset-0 z-20 flex items-end pb-16 md:pb-24">
                    <div className="w-full px-8 md:px-16 lg:px-24">
                        <div className="max-w-4xl">
                            <motion.h1
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="text-white text-5xl md:text-7xl leading-tight drop-shadow-md"
                                style={{
                                    fontFamily: 'Georgia, serif',
                                    fontWeight: 400,
                                    textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                                }}
                            >
                                Contact Us
                            </motion.h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Main Content Section (Editorial Split) */}
            <section className="bg-white py-24 md:py-40">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">

                        <motion.div
                            {...fadeIn}
                            className="relative aspect-[3/4] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <img
                                src="/contact/contact.png"
                                alt="Gesit Office Reception"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* RIGHT: Info & Form */}
                        <motion.div {...fadeIn}>
                            <h2
                                className="text-3xl md:text-4xl text-navy-deep mb-8"
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                The Gesit Companies
                            </h2>

                            {/* Address & Contact Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-slate-100 pb-8">
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[.3em] text-[#BC9C33] mb-3">Address</h4>
                                    <a
                                        href={settings.googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-base font-light leading-relaxed text-slate-700 whitespace-pre-line block hover:text-[#BC9C33] transition-colors"
                                    >
                                        {settings.officeAddress || "The City Tower, 27th Floor \n Jl. M.H. Thamrin No 81 DKI \n Jakarta 10310 — Indonesia"}
                                    </a>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[.3em] text-[#BC9C33] mb-3">Contact</h4>
                                    <div className="space-y-3">
                                        <a href={`tel:${settings.phoneNumber}`} className="flex items-center gap-3 text-base text-slate-700 hover:text-[#BC9C33] transition-colors">
                                            <Phone size={16} className="text-navy-deep/40" /> {settings.phoneNumber}
                                        </a>
                                        <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-base text-slate-700 hover:text-[#BC9C33] transition-colors">
                                            <Mail size={16} className="text-navy-deep/40" /> {settings.email}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist Form */}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Type your name here"
                                        className="w-full border-b border-slate-200 py-3 text-base focus:border-navy-deep outline-none transition-colors placeholder:text-slate-200 font-light"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                            className="w-full border-b border-slate-200 py-3 text-base focus:border-navy-deep outline-none transition-colors placeholder:text-slate-200 font-light"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Whatsapp/Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="+62 ..."
                                            className="w-full border-b border-slate-200 py-3 text-base focus:border-navy-deep outline-none transition-colors placeholder:text-slate-200 font-light"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Message (Optional)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Type here..."
                                        className="w-full border border-slate-100 p-6 rounded-xl text-base focus:border-navy-deep outline-none transition-colors placeholder:text-slate-200 font-light resize-none bg-slate-50/10 shadow-inner"
                                    ></textarea>
                                </div>

                                {/* reCAPTCHA restored */}
                                <div className="flex justify-start mb-4 transform scale-90 origin-left">
                                    <ReCAPTCHA
                                        sitekey={recaptchaSiteKey}
                                        onChange={(token) => setCaptchaToken(token)}
                                        onExpired={() => setCaptchaToken(null)}
                                    />
                                </div>

                                <div className="flex justify-start">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="px-20 py-3.5 bg-navy-deep text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#BC9C33] transition-all duration-500 shadow-xl disabled:opacity-50"
                                    >
                                        {status === 'sending' ? 'Sending...' : 'Submit'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            <StatusModal
                isOpen={showStatusModal}
                status={status}
                message={errorMessage}
                onClose={() => {
                    setShowStatusModal(false);
                    if (status !== 'sending') setStatus('idle');
                }}
            />
        </div>
    );
};

const StatusModal = ({ isOpen, status, message, onClose }: { isOpen: boolean, status: string, message: string, onClose: () => void }) => {
    if (!isOpen) return null;

    const isSuccess = status === 'success';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-navy-deep/20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-[480px] bg-white rounded-card shadow-2xl relative overflow-hidden flex flex-col items-center"
            >
                <div className="p-10 text-center">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 ${isSuccess ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                        {isSuccess ? <CheckCircle2 size={48} /> : <X size={48} />}
                    </div>

                    <h3 className="text-3xl font-display text-navy-deep mb-4">
                        {isSuccess ? 'Message Sent!' : 'Oops!'}
                    </h3>

                    <p className="text-slate-500 mb-10 leading-relaxed">
                        {isSuccess
                            ? "Thank you for contacting us. Our team will get back to you shortly."
                            : (message || "Something went wrong. Please check your connection and try again.")
                        }
                    </p>

                    <button
                        onClick={onClose}
                        className={`w-full py-5 rounded-input font-bold text-[10px] uppercase tracking-[.3em] text-white transition-all shadow-xl ${isSuccess
                            ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
                            : 'bg-navy-deep hover:bg-[#BA9B32] shadow-navy-deep/20'
                            }`}
                    >
                        {isSuccess ? 'Great, thanks!' : 'Try Again'}
                    </button>
                </div>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={onClose} className="text-slate-300 hover:text-navy-deep transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactPage;