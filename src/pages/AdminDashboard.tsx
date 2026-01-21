import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Newspaper,
    Briefcase,
    Plus,
    Edit2,
    Trash2,
    Users,
    TrendingUp,
    Clock,
    LogOut,
    ChevronRight,
    Filter,
    X,
    Camera,
    Menu,
    AlertCircle,
    Bold,
    Italic,
    Underline,
    Heading,
    Link as LinkIcon,
    Building2,
    MapPin,
    Linkedin,
    FileText,
    CheckCircle
} from "lucide-react";
import { useNews, type NewsItem } from "../context/NewsContext.tsx";
import { useCareer, type Career } from "../context/CareerContext.tsx";
import { useProperty, type Property } from "../context/PropertyContext.tsx";
import { supabase, uploadImage } from "../lib/supabase";

const AdminDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Can be renamed to 'hasSession' conceptually
    const [is2FAVerified, setIs2FAVerified] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Whitelist of allowed admin emails
    const ALLOWED_EMAILS = [
        "admin@gesit.co.id",
        "rudi.siarudin@gesit.co.id"
    ];

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session);
            // On page load, we force re-verification for security (session exists != 2FA passed recently)
            setIs2FAVerified(false);

            // OPTIONAL: If you want to bypass 2FA on refresh for UX, check localStorage here.
            // But for high security, forcing 2FA on refresh is better.

            setAuthLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
            if (!session) {
                setIs2FAVerified(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLoginStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSending(true);

        const cleanEmail = email.trim().toLowerCase();

        // 1. Check Whitelist
        if (!ALLOWED_EMAILS.includes(cleanEmail)) {
            setError("Access Denied: This email is not authorized for admin access.");
            setIsSending(false);
            return;
        }

        try {
            // 2. Verify Password First
            const { error: passwordError } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password: password
            });

            if (passwordError) throw new Error("Invalid email or password.");

            // 3. Initiate OTP (2FA)
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email: cleanEmail,
                options: {
                    shouldCreateUser: false,
                }
            });

            if (otpError) throw otpError;

            // Move UI to Step 2 (OTP)
            // Even though 'isLoggedIn' becomes true via onAuthStateChange, 
            // the main render logic will block dashboard access until 'is2FAVerified' is true.
            setError("");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Authentication failed.");
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSending(true);

        const cleanEmail = email.trim().toLowerCase();

        try {
            const { error } = await supabase.auth.verifyOtp({
                email: cleanEmail,
                token: otp,
                type: 'email',
            });

            if (error) throw error;

            // Success! 
            setIs2FAVerified(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Invalid code. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setIs2FAVerified(false);
        setOtp("");
        setEmail("");
        setPassword("");
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
        { id: "news", label: "News & Insights", icon: <Newspaper size={20} /> },
        { id: "property", label: "Property Portfolio", icon: <Building2 size={20} /> },
        { id: "careers", label: "Careers Vault", icon: <Briefcase size={20} /> },
    ];

    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#BA9B32] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verifying session...</p>
                </div>
            </div>
        );
    }

    // MAIN RENDER LOGIC
    // Show Dashboard ONLY if Logged In AND 2FA Verified
    if (isLoggedIn && is2FAVerified) {
        return (
            <div className="flex min-h-screen bg-[#103065] text-navy-deep font-body overflow-x-hidden">
                {/* Mobile Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && window.innerWidth < 1024 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-navy-deep/80 backdrop-blur-sm z-40 lg:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <AnimatePresence mode="wait">
                    {(isSidebarOpen || window.innerWidth >= 1024) && (
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed lg:sticky top-0 h-screen w-[280px] bg-white shadow-2xl z-50 flex flex-col border-r border-slate-100"
                        >
                            {/* Sidebar Header */}
                            <div className="p-8 pb-10 flex flex-col items-center text-center border-b border-slate-50 relative">
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 lg:hidden"
                                >
                                    <X size={20} />
                                </button>

                                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-4 p-2">
                                    <img src="/logo gesit.png" alt="Gesit" className="w-full h-full object-contain" />
                                </div>
                                <h2 className="text-xl font-display font-bold text-navy-deep">Admin Portal</h2>
                                <p className="text-[9px] font-bold tracking-[.25em] text-[#BA9B32] uppercase mt-1">The Gesit Companies</p>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-grow px-6 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                                <p className="px-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Main Menu</p>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === tab.id
                                            ? "bg-navy-deep text-white shadow-lg shadow-navy-deep/20"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-navy-deep"
                                            }`}
                                    >
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-[#BA9B32] opacity-100" // Fully separate background if needed, but styling here uses bg-navy-deep
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                style={{ zIndex: -1 }} // Push behind content
                                            />
                                        )}
                                        {/* Icon Container */}
                                        <div className={`relative p-2 rounded-lg transition-colors ${activeTab === tab.id ? "bg-white/10 text-[#BA9B32]" : "bg-slate-100/50 group-hover:bg-white group-hover:shadow-sm"}`}>
                                            {tab.icon}
                                        </div>
                                        <span className="font-medium text-xs tracking-wide">{tab.label}</span>
                                        {activeTab === tab.id && <ChevronRight size={14} className="ml-auto text-[#BA9B32]" />}
                                    </button>
                                ))}
                            </nav>

                            {/* Sidebar Footer */}
                            <div className="p-6 border-t border-slate-50">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-medium text-xs tracking-widest uppercase group"
                                >
                                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <main className="flex-1 min-h-screen relative">
                    {/* Top Bar for Mobile */}
                    <div className="sticky top-0 lg:hidden z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-slate-100 p-1">
                                <img src="/logo gesit.png" alt="Gesit" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-display font-bold text-navy-deep">Gesit Admin</span>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-navy-deep bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="p-6 lg:p-12 max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === "overview" && <OverviewSection />}
                                {activeTab === "news" && <ContentSection />}
                                {activeTab === "property" && <PropertySection />}
                                {activeTab === "careers" && <CareersVault />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        );
    }

    // AUTHENTICATION UI
    // Rendered when: !isLoggedIn OR (isLoggedIn && !is2FAVerified)
    const showOtpScreen = isLoggedIn && !is2FAVerified;

    return (
        <div className="min-h-screen bg-navy-deep flex items-center justify-center p-6 font-body">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                key={showOtpScreen ? 'otp' : 'login'}
                className="w-full max-w-[480px] bg-white rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center"
            >
                <div className="p-10 md:p-14 w-full">
                    <div className="mb-12 text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-28 h-28 bg-white rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-slate-50 p-6"
                        >
                            <img src="/logo gesit.png" alt="Gesit Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <h1 className="text-4xl font-display font-bold text-navy-deep mb-3 tracking-tight">Admin Portal</h1>
                        <p className="text-slate-400 text-[11px] tracking-[0.4em] uppercase font-bold">The Gesit Companies</p>
                    </div>

                    {!showOtpScreen ? (
                        // STEP 1: CREDENTIALS
                        <form onSubmit={handleLoginStep1} className="space-y-8">
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-1">Administrator Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#F8F9FD] border border-transparent rounded-[1.25rem] py-5 px-8 text-[15px] font-medium text-navy-deep placeholder:text-slate-300 outline-none focus:bg-white focus:border-slate-200 focus:shadow-sm transition-all duration-300"
                                        placeholder="user@gesit.co.id"
                                        required
                                        disabled={isSending}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-1">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#F8F9FD] border border-transparent rounded-[1.25rem] py-5 px-8 text-xl tracking-[0.3em] text-navy-deep placeholder:text-slate-300 outline-none focus:bg-white focus:border-slate-200 focus:shadow-sm transition-all duration-300 font-mono"
                                        placeholder="••••••••"
                                        required
                                        disabled={isSending}
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-50 text-red-600 p-5 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-3 border border-red-100"
                                >
                                    <AlertCircle size={18} /> {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full py-5 bg-[#0a192f] text-white rounded-[1.25rem] font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-[#050d18] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(10,25,47,0.3)]"
                            >
                                {isSending ? 'Authenticating...' : 'Sign In & Verify'}
                                {!isSending && <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />}
                            </button>
                        </form>
                    ) : (
                        // STEP 2: OTP
                        <form onSubmit={handleVerifyOtp} className="space-y-10">
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mb-6 ring-8 ring-emerald-50/30"
                                >
                                    <CheckCircle size={32} />
                                </motion.div>
                                <h3 className="text-xl font-bold text-navy-deep mb-3">Credentials Verified</h3>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                                    A security code has been sent to<br />
                                    <span className="font-bold text-navy-deep block mt-2">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#BA9B32] block text-center">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    className="w-full bg-[#F8F9FD] border border-transparent rounded-[1.25rem] py-6 px-8 focus:outline-none focus:bg-white focus:border-slate-200 transition-all font-mono text-4xl text-center tracking-[0.4em] text-navy-deep placeholder-slate-200"
                                    placeholder="000000"
                                    required
                                    maxLength={8}
                                    disabled={isSending}
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 text-red-600 p-5 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-3 border border-red-100"
                                >
                                    <AlertCircle size={18} /> {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={isSending || otp.length < 6}
                                    className="w-full py-5 bg-[#0a192f] text-white rounded-[1.25rem] font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-[#050d18] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(10,25,47,0.3)]"
                                >
                                    {isSending ? 'Verifying...' : 'Access Dashboard'}
                                    {!isSending && <CheckCircle size={18} />}
                                </button>

                                <div className="flex items-center justify-between px-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-navy-deep transition-colors"
                                    >
                                        Back to Login
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setIsSending(true);
                                            await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
                                            setIsSending(false);
                                        }}
                                        disabled={isSending}
                                        className="text-[10px] font-bold uppercase tracking-widest text-[#BA9B32] hover:text-[#9a7f26] transition-colors disabled:opacity-50"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    <div className="mt-16 pt-8 border-t border-slate-50 text-center space-y-2">
                        <p className="text-[9px] text-slate-200 font-medium uppercase tracking-[0.2em]">
                            © 2024 The Gesit Companies. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

/* --- Sub-Components --- */

const OverviewSection = () => {
    const { newsItems, loading: newsLoading } = useNews();
    const { applications, loading: careerLoading, fetchApplications } = useCareer();

    useEffect(() => {
        fetchApplications();
    }, []);

    const stats = [
        { label: "Active News", value: newsLoading ? "..." : newsItems.filter(i => i.type === 'news').length.toString(), icon: <Newspaper />, trend: "Real-time" },
        { label: "New Applications", value: careerLoading ? "..." : applications.length.toString(), icon: <Users />, trend: "+12.5%" },
        { label: "Avg. Response", value: "2.4d", icon: <Clock />, trend: "-0.2d" },
    ];

    const recentApps = applications.slice(0, 3);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity whitespace-nowrap overflow-hidden">
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400 mb-4">{stat.label}</p>
                        <div className="text-4xl font-display mb-4">{stat.value}</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#BA9B32] uppercase tracking-widest">
                            {idx < 2 ? <TrendingUp size={12} /> : null} {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center md:text-left">
                <div className="lg:col-span-2 bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-display mb-8">Recent Activity</h3>
                    <div className="space-y-6">
                        {recentApps.length > 0 ? (
                            recentApps.map((app) => (
                                <div key={app.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-xl px-4 -mx-4 group">
                                    <div className="flex items-center gap-6 text-left">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#BA9B32] group-hover:text-white transition-all shrink-0">
                                            <Clock size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm truncate">New Career Application: {app.position}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                                                {app.full_name} • {new Date(app.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-[#BA9B32] hover:bg-[#BA9B32]/10 rounded-lg transition-all">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <p className="text-sm font-light uppercase tracking-widest italic">No recent activity found</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-navy-deep rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#BA9B32]/20 to-transparent"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-display mb-6">System Status</h3>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-[.3em] mb-10">All Modules Operational</p>
                        <div className="space-y-6">
                            {[
                                { name: "Database", status: "Live" },
                                { name: "Media Server", status: "Live" },
                                { name: "Application API", status: "Live" }
                            ].map((service) => (
                                <div key={service.name} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                                    <span className="text-xs font-bold uppercase tracking-widest">{service.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                        <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">{service.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsModal = ({
    isOpen,
    onClose,
    onSave,
    initialData = null,
    type
}: {
    isOpen: boolean,
    onClose: () => void,
    onSave: (data: Omit<NewsItem, 'id'>) => void,
    initialData?: NewsItem | null,
    type: 'news' | 'csr'
}) => {
    const [formData, setFormData] = useState<Omit<NewsItem, 'id'>>({
        type: initialData?.type || type,
        title: initialData?.title || "",
        category: initialData?.category || "Corporate",
        date: initialData?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        author: initialData?.author || "Corporate Relations",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        image: initialData?.image || "",
        featured: initialData?.featured || false,
        tags: initialData?.tags || "",
        quote: initialData?.quote || "",
        quote_author: initialData?.quote_author || "",
        media_type: initialData?.media_type || "image",
        video_url: initialData?.video_url || ""
    });

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Edit Mode: Strict data loading
                setFormData({
                    type: initialData.type,
                    title: initialData.title,
                    category: initialData.category,
                    date: initialData.date,
                    author: initialData.author,
                    excerpt: initialData.excerpt,
                    content: initialData.content || "",
                    image: initialData.image,
                    featured: initialData.featured || false,
                    tags: initialData.tags || "",
                    quote: initialData.quote || "",
                    quote_author: initialData.quote_author || "",
                    media_type: initialData.media_type || "image",
                    video_url: initialData.video_url || ""
                });
            } else {
                // Create Mode: Defaults
                setFormData({
                    type: type,
                    title: "",
                    category: "Corporate",
                    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    author: "Corporate Relations",
                    excerpt: "",
                    content: "",
                    image: "",
                    featured: false,
                    tags: "",
                    quote: "",
                    quote_author: "",
                    media_type: "image",
                    video_url: ""
                });
            }
        }
    }, [isOpen, initialData, type]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const publicUrl = await uploadImage(file);
            setFormData(prev => ({ ...prev, image: publicUrl }));
        } catch (error: any) {
            console.error("Upload error:", error);
            alert("Failed to upload image: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
                <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50 text-left">
                    <h3 className="text-2xl font-display">{initialData ? 'Edit Story' : 'New Story'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto text-left">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Headline Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            placeholder="Enter article title..."
                        />
                    </div>


                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Media Type</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, media_type: 'image' })}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${formData.media_type !== 'video' ? 'bg-navy-deep text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >
                                Image
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, media_type: 'video' })}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${formData.media_type === 'video' ? 'bg-[#BA9B32] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >
                                Video
                            </button>
                        </div>

                        {formData.media_type === 'video' && (
                            <div className="space-y-2 animate-fadeIn">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Video URL (YouTube/Vimeo)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.video_url || ''}
                                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    {formData.video_url && (
                                        <button
                                            onClick={() => {
                                                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                                                const match = formData.video_url?.match(youtubeRegex);
                                                if (match && match[4]) {
                                                    const thumbUrl = `https://img.youtube.com/vi/${match[4]}/maxresdefault.jpg`;
                                                    setFormData({ ...formData, image: thumbUrl });
                                                }
                                            }}
                                            className="px-6 bg-slate-100 text-slate-500 rounded-2xl hover:bg-[#BA9B32] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
                                            title="Auto-fetch Thumbnail from YouTube"
                                        >
                                            <Camera size={16} /> <span>Get Thumb</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {formData.media_type === 'video' ? 'Cover Image (Thumbnail)' : 'Article Image'}
                        </label>
                        <div className="flex flex-col gap-4">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#BA9B32] transition-colors overflow-hidden relative group"
                            >
                                {formData.image ? (
                                    <>
                                        <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white font-bold text-[10px] uppercase tracking-widest">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <Camera className="text-[#BA9B32]" size={20} />
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            {formData.media_type === 'video' ? 'Upload video thumbnail' : 'Click to upload image'}
                                        </p>
                                    </>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-3">
                                        <div className="w-6 h-6 border-2 border-[#BA9B32] border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#BA9B32]">Uploading...</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-2 px-4 text-[10px] focus:outline-none text-slate-400"
                                    placeholder="Or paste URL here..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Publication Date</label>
                            <input
                                type="text"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                                placeholder="15 Jan 2026"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Author</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Excerpt / Summary</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 h-24 resize-none"
                            placeholder="Brief summary for cards..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tags</label>
                        <input
                            type="text"
                            value={formData.tags || ''}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            placeholder="Example: news, corporate, 2026"
                        />
                        <div className="flex flex-wrap gap-2 pt-2">
                            {formData.tags && formData.tags.split(',').filter(tag => tag.trim() !== "").map((tag, idx) => (
                                <span key={idx} className="bg-[#BA9B32]/10 text-[#BA9B32] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#BA9B32]/20">
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pull Quote (Optional)</label>
                        <textarea
                            value={formData.quote || ''}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 h-24 resize-none"
                            placeholder="Enter a highlight quote..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quote Author (Optional)</label>
                        <input
                            type="text"
                            value={formData.quote_author || ''}
                            onChange={(e) => setFormData({ ...formData, quote_author: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            placeholder="e.g. Gesit Foundation Executive Board"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Content</label>
                        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-[#BA9B32]/20">
                            {/* Formatting Toolbar */}
                            <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-100/50">
                                <button
                                    onClick={() => {
                                        const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const text = formData.content || '';
                                        const before = text.substring(0, start);
                                        const selected = text.substring(start, end);
                                        const after = text.substring(end);
                                        const newText = `${before}<b>${selected}</b>${after}`;
                                        setFormData({ ...formData, content: newText });
                                    }}
                                    className="p-2 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-all"
                                    title="Bold"
                                >
                                    <Bold size={14} />
                                </button>
                                <button
                                    onClick={() => {
                                        const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const text = formData.content || '';
                                        const before = text.substring(0, start);
                                        const selected = text.substring(start, end);
                                        const after = text.substring(end);
                                        const newText = `${before}<i>${selected}</i>${after}`;
                                        setFormData({ ...formData, content: newText });
                                    }}
                                    className="p-2 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-all"
                                    title="Italic"
                                >
                                    <Italic size={14} />
                                </button>
                                <button
                                    onClick={() => {
                                        const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const text = formData.content || '';
                                        const before = text.substring(0, start);
                                        const selected = text.substring(start, end);
                                        const after = text.substring(end);
                                        const newText = `${before}<u>${selected}</u>${after}`;
                                        setFormData({ ...formData, content: newText });
                                    }}
                                    className="p-2 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-all"
                                    title="Underline"
                                >
                                    <Underline size={14} />
                                </button>
                                <div className="w-[1px] h-4 bg-slate-300 mx-2"></div>
                                <button
                                    onClick={() => {
                                        const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const text = formData.content || '';
                                        const before = text.substring(0, start);
                                        const selected = text.substring(start, end);
                                        const after = text.substring(end);
                                        const newText = `${before}<h3>${selected}</h3>${after}`;
                                        setFormData({ ...formData, content: newText });
                                    }}
                                    className="p-2 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-all"
                                    title="Heading"
                                >
                                    <Heading size={14} />
                                </button>
                                <button
                                    onClick={() => {
                                        const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const text = formData.content || '';
                                        const before = text.substring(0, start);
                                        const selected = text.substring(start, end);
                                        const after = text.substring(end);
                                        const newText = `${before}<a href="#" class="text-[#BA9B32] hover:underline">${selected}</a>${after}`;
                                        setFormData({ ...formData, content: newText });
                                    }}
                                    className="p-2 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-all"
                                    title="Link"
                                >
                                    <LinkIcon size={14} />
                                </button>
                            </div>
                            <textarea
                                id="content-textarea"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-slate-50 py-4 px-6 focus:outline-none h-64 resize-none font-mono text-sm"
                                placeholder="Full article content... Use toolbar for formatting."
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 py-2">
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-[#BA9B32] focus:ring-[#BA9B32]"
                        />
                        <label className="text-sm font-bold text-slate-700">Set as Featured Article</label>
                    </div>
                </div>
                <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                    <button onClick={onClose} className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 hover:text-navy-deep transition-colors">Cancel</button>
                    <button
                        onClick={() => onSave(formData)}
                        disabled={uploading}
                        className={`px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-[.3em] transition-all shadow-xl ${uploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-navy-deep text-white hover:bg-[#BA9B32] shadow-navy-deep/20'}`}
                    >
                        {uploading ? 'Uploading...' : 'Save Publication'}
                    </button>
                </div>
            </motion.div >
        </div >
    );
};

const ContentSection = () => {
    const { newsItems, loading, addNews, updateNews, deleteNews } = useNews();
    const [type, setType] = useState<"news" | "csr">("news");
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredItems = newsItems.filter(item => item.type === type);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [type]);

    const handleSave = (data: Omit<NewsItem, 'id'>) => {
        if (editingItem) {
            updateNews(editingItem.id, data);
        } else {
            addNews(data);
        }
        setIsSliderOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="space-y-8">
            {/* Type Toggle */}
            <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
                <button
                    onClick={() => setType("news")}
                    className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${type === "news" ? "bg-navy-deep text-white shadow-lg" : "text-slate-400 hover:text-navy-deep"}`}
                >
                    Official News
                </button>
                <button
                    onClick={() => setType("csr")}
                    className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${type === "csr" ? "bg-[#BA9B32] text-white shadow-lg" : "text-slate-400 hover:text-[#BA9B32]"}`}
                >
                    CSR Initiatives
                </button>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-full font-bold text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 shadow-sm transition-all">
                        <Filter size={16} /> <span>Filter List</span>
                    </button>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Showing {filteredItems.length} {type === 'news' ? 'News' : 'CSR'} items</span>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsSliderOpen(true); }}
                    className="flex items-center gap-3 px-8 py-4 bg-[#BA9B32] text-white rounded-full font-bold text-[10px] uppercase tracking-[.3em] hover:bg-navy-deep shadow-xl shadow-[#BA9B32]/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> <span>Create New Story</span>
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[.3em] text-slate-400">Article Details</th>
                            <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[.3em] text-slate-400 text-right">Published</th>
                            <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[.3em] text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="px-10 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-8 h-8 border-4 border-[#BA9B32] border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Syncing with Supabase...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-14 bg-slate-100 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform shrink-0">
                                                <img src={item.image} className="w-full h-full object-cover grayscale" alt="Thumb" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm mb-1 line-clamp-1">{item.title}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[8px] font-bold uppercase tracking-widest">{item.category}</span>
                                                    {item.featured && <span className="text-[8px] font-bold text-[#BA9B32] uppercase tracking-widest">★ Featured</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-xs text-slate-500 font-medium text-right">{item.date}</td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => { setEditingItem(item); setIsSliderOpen(true); }}
                                                className="p-3 bg-slate-100 text-slate-400 hover:bg-[#BA9B32]/10 hover:text-[#BA9B32] rounded-xl transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteNews(item.id)}
                                                className="p-3 bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && filteredItems.length === 0 && (
                    <div className="py-32 text-center text-slate-300">
                        <Newspaper size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="font-bold uppercase tracking-[.3em] text-[10px]">No articles found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-500"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-lg border text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#BA9B32] border-[#BA9B32] text-white shadow-lg' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-500"
                    >
                        Next
                    </button>
                </div>
            )}

            <NewsModal
                isOpen={isSliderOpen}
                onClose={() => { setIsSliderOpen(false); setEditingItem(null); }}
                onSave={handleSave}
                initialData={editingItem}
                type={type}
            />
        </div>
    );
};

const CareersVault = () => {
    const { jobs, applications, deleteJob, addJob, updateJob, fetchApplications, deleteApplication } = useCareer();
    const [view, setView] = useState<'jobs' | 'applications'>('jobs');

    useEffect(() => {
        fetchApplications();
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Career | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'job' | 'application';
        id: number | null;
        resumeUrl?: string; // Optional, only for applications
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'job',
        id: null,
        title: '',
        message: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [view]);

    const totalPages = Math.ceil((view === 'jobs' ? jobs.length : applications.length) / itemsPerPage);
    const currentJobs = jobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const currentApplications = applications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleConfirmDelete = async () => {
        if (!confirmModal.id) return;
        setIsDeleting(true);
        try {
            if (confirmModal.type === 'job') {
                await deleteJob(confirmModal.id);
            } else {
                await deleteApplication(confirmModal.id, confirmModal.resumeUrl || '');
            }
            setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete item.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveJob = async (data: any) => {
        if (editingJob) {
            await updateJob(editingJob.id, data);
        } else {
            await addJob(data);
        }
        setIsModalOpen(false);
        setEditingJob(null);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[600px]">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-4 bg-slate-50 p-1.5 rounded-full border border-slate-100">
                        <button
                            onClick={() => setView('jobs')}
                            className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'jobs' ? 'bg-white shadow-md text-navy-deep' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Job Listings
                        </button>
                        <button
                            onClick={() => setView('applications')}
                            className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'applications' ? 'bg-white shadow-md text-navy-deep' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Applications
                        </button>
                    </div>

                    {view === 'jobs' && (
                        <button
                            onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
                            className="flex items-center gap-3 px-6 py-3 bg-[#BA9B32] text-white rounded-full font-bold text-[10px] uppercase tracking-[.2em] hover:bg-navy-deep shadow-lg transition-all"
                        >
                            <Plus size={16} /> <span>Add Position</span>
                        </button>
                    )}
                </div>

                {view === 'jobs' ? (
                    <div className="space-y-4">
                        {jobs.length === 0 ? (
                            <div className="text-center py-20 text-slate-300">
                                <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">No active job listings</p>
                            </div>
                        ) : (
                            currentJobs.map((job) => (
                                <div key={job.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-[#BA9B32]/30 hover:bg-white transition-all group">
                                    <div className="flex items-center gap-8 text-left">
                                        <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-300 group-hover:bg-[#BA9B32] group-hover:text-white transition-all shrink-0 shadow-sm">
                                            <Briefcase size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-navy-deep">{job.title}</p>
                                            <div className="flex items-center gap-4 mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <span className="flex items-center gap-1"><Building2 size={12} /> {job.department}</span>
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                                                <span className="px-2 py-1 bg-slate-200 rounded text-slate-500">{job.type}</span>
                                                {job.linkedin_url && <Linkedin size={12} className="text-[#0077b5]" />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => { setEditingJob(job); setIsModalOpen(true); }}
                                            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-[#BA9B32] hover:border-[#BA9B32] rounded-xl transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setConfirmModal({
                                                isOpen: true,
                                                type: 'job',
                                                id: job.id,
                                                title: 'Delete Position',
                                                message: `Are you sure you want to delete "${job.title}"? This action cannot be undone.`
                                            })}
                                            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Application List (Placeholder logic) */}
                        {applications.length === 0 ? (
                            <div className="text-center py-20 text-slate-300">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">No applications yet</p>
                            </div>
                        ) : (
                            currentApplications.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-[#BA9B32]/30 hover:bg-white transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-display font-bold text-slate-500">
                                            {app.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-navy-deep">{app.full_name}</p>
                                            <p className="text-xs text-slate-500">{app.position}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <a href={`mailto:${app.email}`} className="text-xs text-slate-400 hover:text-[#BA9B32]">{app.email}</a>
                                        <div className="h-4 w-[1px] bg-slate-300"></div>
                                        <div className="flex items-center gap-2">
                                            {app.resume_url && (
                                                <a
                                                    href={app.resume_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-[#BA9B32] hover:text-[#BA9B32] transition-colors"
                                                >
                                                    <FileText size={14} /> Resume
                                                </a>
                                            )}
                                            <button
                                                onClick={() => setConfirmModal({
                                                    isOpen: true,
                                                    type: 'application',
                                                    id: app.id,
                                                    resumeUrl: app.resume_url,
                                                    title: 'Delete Application',
                                                    message: `Are you sure you want to delete the application for ${app.full_name}? This action cannot be undone and will permanently delete the resume file.`
                                                })}
                                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-500 transition-colors"
                                                title="Delete Application"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12 pb-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-500"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-lg border text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#BA9B32] border-[#BA9B32] text-white shadow-lg' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-500"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <JobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveJob}
                initialData={editingJob}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleConfirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Delete"
                isDangerous={true}
                isLoading={isDeleting}
            />
        </div>
    );
};

const JobModal = ({
    isOpen,
    onClose,
    onSave,
    initialData = null
}: {
    isOpen: boolean,
    onClose: () => void,
    onSave: (data: Omit<Career, 'id' | 'created_at' | 'is_active'>) => void,
    initialData?: Career | null
}) => {
    const [formData, setFormData] = useState({
        title: "",
        department: "",
        location: "Jakarta, Indonesia",
        type: "Full-time",
        description: "",
        requirements: "",
        linkedin_url: "",
        expires_at: ""
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    department: initialData.department,
                    location: initialData.location,
                    type: initialData.type,
                    description: initialData.description,
                    requirements: initialData.requirements || "",
                    linkedin_url: initialData.linkedin_url || "",
                    expires_at: initialData.expires_at ? initialData.expires_at.split('T')[0] : ""
                });
            } else {
                setFormData({
                    title: "",
                    department: "",
                    location: "Jakarta, Indonesia",
                    type: "Full-time",
                    description: "",
                    requirements: "",
                    linkedin_url: "",
                    expires_at: ""
                });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-display">{initialData ? 'Edit Position' : 'Post New Job'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Job Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                                placeholder="e.g. Senior Frontend Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                                placeholder="e.g. Engineering"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            >
                                <option>Full-time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                                <option>Freelance</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Job Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 h-32 resize-none"
                            placeholder="Describe the role responsibilities..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">LinkedIn Quick Apply URL (Optional)</label>
                            <div className="flex items-center gap-2">
                                <Linkedin size={18} className="text-[#0077b5]" />
                                <input
                                    type="text"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                                    placeholder="https://linkedin.com/jobs/..."
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">If provided, the 'Apply' button will redirect here instead of opening a form.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expiration Date (Auto-Close)</label>
                            <input
                                type="date"
                                value={formData.expires_at}
                                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-3 font-bold text-[10px] uppercase tracking-widest text-slate-500 hover:text-navy-deep transition-colors">Cancel</button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-8 py-3 bg-navy-deep text-white rounded-full font-bold text-[10px] uppercase tracking-[.2em] hover:bg-[#BA9B32] shadow-xl shadow-navy-deep/20 transition-all"
                    >
                        {initialData ? 'Update Job' : 'Publish Job'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};


const PropertyModal = ({
    isOpen,
    onClose,
    onSave,
    initialData = null
}: {
    isOpen: boolean,
    onClose: () => void,
    onSave: (data: Omit<Property, 'id'>) => void,
    initialData?: Property | null
}) => {
    const [formData, setFormData] = useState<Omit<Property, 'id'>>({
        title: initialData?.title || "",
        subtitle: initialData?.subtitle || "",
        location: initialData?.location || "",
        property_type: initialData?.property_type || "Premium Grade A",
        description: initialData?.description || "",
        points: initialData?.points || [],
        images: initialData?.images || [],
        reverse: initialData?.reverse || false,
        order_index: initialData?.order_index || 0
    });

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newPoint, setNewPoint] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    subtitle: initialData.subtitle,
                    location: initialData.location,
                    property_type: initialData.property_type,
                    description: initialData.description,
                    points: initialData.points,
                    images: initialData.images,
                    reverse: initialData.reverse,
                    order_index: initialData.order_index
                });
            } else {
                setFormData({
                    title: "",
                    subtitle: "",
                    location: "",
                    property_type: "Premium Grade A",
                    description: "",
                    points: [],
                    images: [],
                    reverse: false,
                    order_index: 0
                });
            }
        }
    }, [isOpen, initialData]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
        } catch (error: any) {
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
                <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50 text-left">
                    <h3 className="text-2xl font-display">{initialData ? 'Edit Project' : 'New Project'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto text-left">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 font-medium text-slate-700"
                                placeholder="e.g. Trinity Tower"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subtitle/Category</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 font-medium text-slate-700"
                                placeholder="e.g. Premium Office Tower"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 font-medium text-slate-700"
                                placeholder="e.g. Jakarta, Indonesia"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Property Type</label>
                            <input
                                type="text"
                                value={formData.property_type}
                                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 font-medium text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 h-32 resize-none font-medium text-slate-700"
                            placeholder="Describe the property project..."
                        />
                    </div>

                    {/* Points/Features */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Key Features</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPoint}
                                onChange={(e) => setNewPoint(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setNewPoint(""), setFormData(prev => ({ ...prev, points: [...prev.points, newPoint] })))}
                                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 focus:outline-none font-medium text-slate-700"
                                placeholder="Add feature point..."
                            />
                            <button
                                type="button"
                                onClick={() => { if (newPoint) { setFormData(prev => ({ ...prev, points: [...prev.points, newPoint] })); setNewPoint(""); } }}
                                className="px-6 bg-[#BA9B32] text-white rounded-2xl hover:bg-navy-deep transition-all font-bold text-[10px] uppercase tracking-widest"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {formData.points.map((point, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2 group">
                                    {point}
                                    <button onClick={() => setFormData(prev => ({ ...prev, points: prev.points.filter((_, i) => i !== idx) }))} className="hover:text-red-500 transition-colors">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Gallery</label>
                        <div className="grid grid-cols-4 gap-4">
                            {formData.images.map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                    <img src={url} className="w-full h-full object-cover" alt="Gallery" />
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#BA9B32] transition-colors"
                            >
                                {uploading ? <div className="w-4 h-4 border-2 border-[#BA9B32] border-t-transparent rounded-full animate-spin"></div> : <Camera size={20} className="text-slate-300" />}
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Upload</span>
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>

                    <div className="flex items-center gap-4 py-2 border-t border-slate-100">
                        <input
                            type="checkbox"
                            checked={formData.reverse}
                            onChange={(e) => setFormData({ ...formData, reverse: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-[#BA9B32] focus:ring-[#BA9B32]"
                        />
                        <label className="text-sm font-bold text-slate-700">Reverse Layout (Left-to-Right Image)</label>
                    </div>
                </div>
                <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                    <button onClick={onClose} className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 hover:text-navy-deep transition-colors">Cancel</button>
                    <button
                        onClick={() => onSave(formData)}
                        disabled={uploading}
                        className={`px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-[.3em] transition-all shadow-xl ${uploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-navy-deep text-white hover:bg-[#BA9B32] shadow-navy-deep/20'}`}
                    >
                        Save Project
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const PropertySection = () => {
    const { properties, loading, addProperty, updateProperty, deleteProperty } = useProperty();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Property | null>(null);

    const handleSave = (data: Omit<Property, 'id'>) => {
        if (editingItem) {
            updateProperty(editingItem.id, data);
        } else {
            addProperty({ ...data, order_index: properties.length });
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Managing {properties.length} Active Projects</span>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="flex items-center gap-3 px-8 py-4 bg-[#BA9B32] text-white rounded-full font-bold text-[10px] uppercase tracking-[.3em] hover:bg-navy-deep shadow-xl shadow-[#BA9B32]/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> <span>Add New Project</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-2 py-32 text-center">
                        <div className="w-12 h-12 border-4 border-[#BA9B32] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Portfolio...</p>
                    </div>
                ) : properties.map((project) => (
                    <div key={project.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="aspect-[16/10] relative overflow-hidden bg-slate-50">
                            {project.images && project.images.length > 0 ? (
                                <img src={project.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={project.title} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                    <Building2 size={48} />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                <h4 className="text-white text-2xl font-display">{project.title}</h4>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">{project.location}</p>
                            </div>
                            <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setEditingItem(project); setIsModalOpen(true); }}
                                    className="p-3 bg-white/90 backdrop-blur text-navy-deep hover:bg-[#BA9B32] hover:text-white rounded-xl transition-all shadow-lg"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => deleteProperty(project.id)}
                                    className="p-3 bg-red-500/90 backdrop-blur text-white hover:bg-red-600 rounded-xl transition-all shadow-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[8px] font-bold uppercase tracking-widest">{project.property_type}</span>
                                <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[8px] font-bold uppercase tracking-widest">{project.points.length} Features</span>
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{project.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && properties.length === 0 && (
                <div className="py-32 text-center text-slate-300 bg-white rounded-[2.5rem] border border-slate-100 col-span-2">
                    <Building2 size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-bold uppercase tracking-[.3em] text-[10px]">No projects in portfolio</p>
                </div>
            )}

            <PropertyModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
                onSave={handleSave}
                initialData={editingItem}
            />
        </div>
    );
};


const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDangerous = false,
    isLoading = false
}: {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    title: string,
    message: string,
    confirmText?: string,
    cancelText?: string,
    isDangerous?: boolean,
    isLoading?: boolean
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden"
            >
                <div className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${isDangerous ? 'bg-red-50 text-red-500' : 'bg-[#BA9B32]/10 text-[#BA9B32]'}`}>
                        {isDangerous ? <Trash2 size={32} /> : <FileText size={32} />}
                    </div>
                    <h3 className="text-xl font-display mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 mb-8">{message}</p>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 font-bold text-[10px] uppercase tracking-widest text-slate-500 hover:text-navy-deep transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 py-3 text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDangerous
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                : 'bg-navy-deep hover:bg-[#BA9B32] shadow-navy-deep/20'
                                }`}
                        >
                            {isLoading ? 'Processing...' : confirmText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


export default AdminDashboard;
