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
            title: "Phone & Fax",
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
        <div className="bg-slate-50 min-h-screen font-body text-navy-deep">
            {/* 1. Consistent Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/contact/cover.png"
                        alt="Contact Gesit"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-navy-deep/50 backdrop-blur-[2px]"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[#BA9B32] font-bold uppercase tracking-[.4em] text-sm mb-6 block"
                    >
                        Get In Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-5xl md:text-8xl font-display"
                    >
                        Contact Us
                    </motion.h1>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-7xl -mt-20 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
                    <motion.div
                        {...fadeIn}
                        className="lg:col-span-7 bg-white rounded-[3rem] p-10 md:p-20 shadow-2xl shadow-slate-200/50"
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
                                <div className="mb-16">
                                    <span className="text-[#BA9B32] font-bold uppercase tracking-widest text-xs mb-4 block">Enquiry Form</span>
                                    <h2 className="text-4xl md:text-5xl font-display leading-tight mb-8">
                                        Let's start a <br /><span className="text-[#BA9B32]">conversation.</span>
                                    </h2>
                                    <p className="text-slate-400 font-light text-lg">
                                        Have dynamic requirements or corporate inquiries? Send us a message and our team will get back to you shortly.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">First Name</label>
                                            <input
                                                required
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="First name"
                                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#BA9B32]/20 transition-all placeholder:text-slate-300"
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
                                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#BA9B32]/20 transition-all placeholder:text-slate-300"
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
                                            className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#BA9B32]/20 transition-all placeholder:text-slate-300"
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
                                            className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#BA9B32]/20 transition-all placeholder:text-slate-300 resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full bg-navy-deep text-white py-6 rounded-2xl font-bold uppercase tracking-[.3em] text-xs hover:bg-[#BA9B32] disabled:bg-slate-200 transition-colors shadow-2xl shadow-navy-deep/20 flex items-center justify-center gap-4 group"
                                    >
                                        {status === 'sending' ? 'Processing...' : 'Send enquiry'}
                                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>

                    {/* RIGHT: Frameless Image & Detail Cards */}
                    <div className="lg:col-span-5 flex flex-col gap-12">

                        {/* Frameless Featured Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative flex-grow min-h-[400px] flex items-center justify-center overflow-hidden rounded-[3rem]"
                        >
                            {/* Decorative Arcs Background */}
                            <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <circle cx="50" cy="50" r="40" stroke="#0B1E40" strokeWidth="0.5" fill="none" />
                                    <circle cx="50" cy="50" r="30" stroke="#0B1E40" strokeWidth="0.5" fill="none" />
                                    <circle cx="50" cy="50" r="20" stroke="#BA9B32" strokeWidth="1" fill="none" />
                                </svg>
                            </div>

                            <img
                                src="/contact/contact.png"
                                alt="Gesit Professional"
                                className="relative z-10 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                            />
                        </motion.div>

                        {/* Detailed Contact Cards */}
                        <div className="space-y-6">
                            {contactCards.map((card, idx) => (
                                <motion.a
                                    key={idx}
                                    href={card.link}
                                    target={card.title === "Head Office" ? "_blank" : undefined}
                                    rel={card.title === "Head Office" ? "noopener noreferrer" : undefined}
                                    {...fadeIn}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-transparent hover:border-[#BA9B32]/30 transition-all group flex items-start gap-6"
                                >
                                    <div className="w-14 h-14 bg-slate-50 text-[#BA9B32] rounded-2xl flex items-center justify-center group-hover:bg-[#BA9B32] group-hover:text-white transition-all shrink-0 shadow-sm">
                                        {card.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{card.title}</h4>
                                        <p className="text-lg font-display leading-snug mb-1">{card.content}</p>
                                        <p className="text-xs font-light text-slate-400 italic">{card.sub}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-4">
                                        <ChevronRight size={20} className="text-[#BA9B32]" />
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
