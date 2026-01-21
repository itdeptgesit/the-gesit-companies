import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ChevronRight, CheckCircle2, MapPin, Phone, Mail, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { sendContactEmail } from "../lib/email";

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

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
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
                alert("You have already sent a message recently. Please wait a few minutes before sending another.");
                return;
            }
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

            // 2. Send email via Resend
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

            // Reset form after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setFormData({ firstName: "", lastName: "", email: "", message: "", agreed: false });
            }, 3000);

        } catch (error: any) {
            console.error('Contact form error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');

            // Reset error after 5 seconds
            setTimeout(() => {
                setStatus('idle');
                setErrorMessage("");
            }, 5000);
        }
    };

    const contactCards = [
        {
            icon: <MapPin size={24} />,
            title: "Head Office",
            content: "The City Tower, 27th Floor, Jl. M.H. Thamrin No 81, Jakarta Pusat, 10310",
            sub: "Indonesia",
            link: "https://maps.app.goo.gl/tpHm5Hvy8LnV3ayu8"
        },
        {
            icon: <Phone size={24} />,
            title: "Phone",
            content: "+62 21 3101601",
            sub: "Mon - Fri, 08:30 - 17:30",
            link: "tel:+62213101601"
        },
        {
            icon: <Mail size={24} />,
            title: "Email",
            content: "contact@gesit.co.id",
            sub: "General Inquiry",
            link: "mailto:contact@gesit.co.id"
        }
    ];

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

            {/* 1. Consistent Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/contact/cover.png"
                        alt="Contact Gesit"
                        className="w-full h-full object-cover animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-navy-deep/75"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-[#BA9B32] font-bold uppercase tracking-[.4em] text-[10px] md:text-sm mb-6 block"
                    >
                        Get In Touch
                    </motion.span>
                    <h1 className="text-white text-5xl md:text-6xl font-display leading-[1.2] mb-0 overflow-hidden drop-shadow-lg pb-4">
                        <motion.span
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-block"
                        >
                            Contact Us
                        </motion.span>
                    </h1>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-7xl -mt-20 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    <motion.div
                        {...fadeIn}
                        className="lg:col-span-7 bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50"
                    >
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center text-center h-full py-20"
                            >
                                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-3xl font-display mb-4">Message Sent!</h3>
                                <p className="text-slate-400 max-w-sm">
                                    Thank you for contacting us. We'll get back to you shortly.
                                </p>
                            </motion.div>
                        ) : status === 'error' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center text-center h-full py-20"
                            >
                                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
                                    <X size={40} />
                                </div>
                                <h3 className="text-3xl font-display mb-4">Oops! Something went wrong</h3>
                                <p className="text-slate-400 max-w-sm mb-6">
                                    {errorMessage}
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="px-6 py-3 bg-navy-deep text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#BA9B32] transition-colors"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="mb-12 relative">
                                    <div className="absolute -left-10 top-0 w-1 h-32 bg-[#BA9B32]/10 hidden md:block"></div>
                                    <span className="text-[#BA9B32] font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Enquiry Form</span>
                                    <h2 className="text-4xl md:text-5xl font-display leading-[1.1] mb-6">
                                        Let's start a <br />
                                        <span className="relative inline-block">
                                            conversation.
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '100%' }}
                                                transition={{ duration: 1, delay: 1 }}
                                                className="absolute bottom-1 left-0 h-[2px] bg-[#BA9B32]/30"
                                            ></motion.div>
                                        </span>
                                    </h2>
                                    <p className="text-slate-500 font-light text-lg max-w-lg leading-relaxed">
                                        Have dynamic requirements or corporate inquiries? Send us a message and our team will get back to you shortly.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">First Name</label>
                                            <input
                                                required
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="First name"
                                                className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#BA9B32]/10 focus:bg-white focus:border-[#BA9B32]/50 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Last Name</label>
                                            <input
                                                required
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="Last name"
                                                className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#BA9B32]/10 focus:bg-white focus:border-[#BA9B32]/50 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                                        <input
                                            required
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            type="email"
                                            placeholder="email@example.com"
                                            className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#BA9B32]/10 focus:bg-white focus:border-[#BA9B32]/50 transition-all placeholder:text-slate-300"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message</label>
                                        <textarea
                                            required
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={5}
                                            placeholder="How can we help you?"
                                            className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#BA9B32]/10 focus:bg-white focus:border-[#BA9B32]/50 transition-all placeholder:text-slate-300 resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full bg-navy-deep text-white py-6 rounded-2xl font-bold uppercase tracking-[.4em] text-[10px] hover:bg-[#BA9B32] disabled:bg-slate-200 transition-all duration-500 shadow-2xl shadow-navy-deep/20 flex items-center justify-center gap-4 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                        <span className="relative z-10">{status === 'sending' ? 'Processing...' : 'Send enquiry'}</span>
                                        <Send size={14} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>

                    {/* RIGHT: Unified Info Pillar */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="bg-white/40 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-white/50 shadow-2xl shadow-slate-200/30 h-full flex flex-col gap-10"
                        >
                            {/* Featured Image - Integrated into the pillar */}
                            <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl group aspect-square lg:aspect-auto lg:h-80 shrink-0">
                                <img
                                    src="/contact/contact.png"
                                    alt="Gesit Professional"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-navy-deep/20 group-hover:bg-navy-deep/10 transition-colors"></div>
                            </div>

                            {/* Detailed Contact Cards */}
                            <div className="space-y-4 flex-grow">
                                {contactCards.map((card, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={card.link}
                                        target={card.title === "Head Office" ? "_blank" : undefined}
                                        rel={card.title === "Head Office" ? "noopener noreferrer" : undefined}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.15 }}
                                        className="bg-white/60 p-6 rounded-[2rem] border border-white hover:border-[#BA9B32]/30 hover:bg-white transition-all duration-500 group flex items-start gap-5"
                                    >
                                        <div className="w-12 h-12 bg-white text-[#BA9B32] rounded-xl flex items-center justify-center group-hover:bg-[#BA9B32] group-hover:text-white transition-all duration-500 shrink-0 shadow-sm border border-slate-100">
                                            {card.icon}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{card.title}</h4>
                                            <p className="text-base font-display leading-tight mb-0.5 text-navy-deep">{card.content}</p>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-[#BA9B32]/60">{card.sub}</p>
                                        </div>
                                        <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 pt-3">
                                            <ChevronRight size={16} className="text-[#BA9B32]" />
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
