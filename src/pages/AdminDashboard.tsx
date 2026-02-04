import React, { useState, useEffect, Suspense, lazy } from "react";
import {
    LayoutDashboard,
    Newspaper,
    Briefcase,
    Mail,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    AlertCircle,
    ShieldCheck,
    Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

// Lazy load sections
const OverviewSection = lazy(() => import("./admin/OverviewSection"));
const ContentSection = lazy(() => import("./admin/ContentSection"));
const CareersVault = lazy(() => import("./admin/CareersVault"));
const ContactSection = lazy(() => import("./admin/ContactSection"));
const SettingsSection = lazy(() => import("./admin/SettingsSection"));

// Loading fallback component
const SectionLoader = () => (
    <div className="flex flex-col items-center justify-center min-vh-50 gap-4">
        <div className="w-10 h-10 border-4 border-[#BA9B32] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-[.3em] text-slate-400">Loading Module...</p>
    </div>
);

const AdminDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [is2FAVerified, setIs2FAVerified] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [visitorCount, setVisitorCount] = useState<number>(0);

    const ALLOWED_EMAILS = [
        "admin@gesit.co.id",
        "rudi.siarudin@gesit.co.id"
    ];

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const userEmail = session?.user?.email?.toLowerCase();
            if (session && userEmail && ALLOWED_EMAILS.includes(userEmail)) {
                setIsLoggedIn(true);
                setEmail(userEmail);
                const lastVerified = localStorage.getItem('gesit_admin_2fa_verified');
                const isRecentlyVerified = lastVerified && (Date.now() - parseInt(lastVerified) < 24 * 60 * 60 * 1000);
                setIs2FAVerified(!!isRecentlyVerified);
            } else {
                setIsLoggedIn(false);
                setIs2FAVerified(false);
            }
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
            if (!session) {
                setIs2FAVerified(false);
                localStorage.removeItem('gesit_admin_2fa_verified');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const fetchVisitorStats = async () => {
            const { data } = await supabase
                .from('site_stats')
                .select('value')
                .eq('key', 'total_visitors')
                .single();
            if (data) setVisitorCount(parseInt(data.value));
        };
        if (isLoggedIn && is2FAVerified) {
            fetchVisitorStats();
            const channel = supabase
                .channel('stats_changes')
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_stats' }, fetchVisitorStats)
                .subscribe();
            return () => { supabase.removeChannel(channel); };
        }
    }, [isLoggedIn, is2FAVerified]);

    const handleLoginStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSending(true);
        const cleanEmail = email.trim().toLowerCase();
        if (!ALLOWED_EMAILS.includes(cleanEmail)) {
            setError("Access Denied: This email is not authorized.");
            setIsSending(false);
            return;
        }

        try {
            const { error: passwordError } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
            if (passwordError) throw new Error("Invalid email or password.");
            const { error: otpError } = await supabase.auth.signInWithOtp({ email: cleanEmail, options: { shouldCreateUser: false } });
            if (otpError) throw otpError;
        } catch (err: any) {
            setError(err.message || "Authentication failed.");
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSending(true);
        try {
            const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: otp, type: 'email' });
            if (error) throw error;
            localStorage.setItem('gesit_admin_2fa_verified', Date.now().toString());
            setIs2FAVerified(true);
        } catch (err: any) {
            setError(err.message || "Invalid code.");
        } finally {
            setIsSending(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setIs2FAVerified(false);
        localStorage.removeItem('gesit_admin_2fa_verified');
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
        { id: "news", label: "News & Insights", icon: <Newspaper size={20} /> },
        { id: "careers", label: "Careers Vault", icon: <Briefcase size={20} /> },
        { id: "contacts", label: "Contact Inquiries", icon: <Mail size={20} /> },
        { id: "settings", label: "Site Settings", icon: <Settings size={20} /> },
    ];

    if (authLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#BA9B32] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (isLoggedIn && is2FAVerified) {
        return (
            <div className="flex min-h-screen bg-[#F8F9FD] text-navy-deep font-body overflow-x-hidden">
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-navy-deep/80 backdrop-blur-sm z-40 lg:hidden"
                        />
                    )}
                </AnimatePresence>

                <motion.aside
                    initial={false}
                    animate={{ x: (isSidebarOpen || window.innerWidth >= 1024) ? 0 : -300 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed lg:sticky top-0 h-screen w-[280px] bg-white shadow-2xl lg:shadow-none z-50 flex flex-col border-r border-slate-100"
                >
                    <div className="p-8 pb-10 flex flex-col items-center text-center relative border-b border-slate-50">
                        <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-slate-300 lg:hidden"><X size={20} /></button>
                        <div className="w-16 h-16 bg-white rounded-card-sm shadow-md border border-slate-100 flex items-center justify-center mb-4 p-2">
                            <img src="/logo gesit.png" alt="Gesit" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-xl font-display font-bold text-navy-deep">Admin Portal</h2>
                        <p className="text-[9px] font-bold tracking-[.25em] text-[#BA9B32] uppercase mt-1">The Gesit Companies</p>
                    </div>

                    <nav className="flex-grow px-6 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                        <p className="px-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Main Menu</p>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-card-sm transition-all duration-300 relative ${activeTab === tab.id ? "bg-navy-deep text-white shadow-lg shadow-navy-deep/20" : "text-slate-500 hover:bg-slate-50"}`}
                            >
                                <div className={`relative p-2 rounded-card-sm transition-colors ${activeTab === tab.id ? "bg-white/10 text-[#BA9B32]" : "bg-slate-100/50"}`}>
                                    {tab.icon}
                                </div>
                                <span className="font-medium text-xs tracking-wide">{tab.label}</span>
                                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto text-[#BA9B32]" />}
                            </button>
                        ))}
                    </nav>

                    <div className="px-10 py-6 border-t border-slate-50 flex items-center gap-3 text-slate-400">
                        <Eye size={16} className="text-[#BA9B32]" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Visitors</span>
                            <span className="text-sm font-display font-bold text-navy-deep">{visitorCount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-50">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-4 rounded-card-sm text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-widest">
                            <LogOut size={18} /> <span>Sign Out</span>
                        </button>
                    </div>
                </motion.aside>

                <main className="flex-1 min-h-screen overflow-y-auto">
                    <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/logo gesit.png" alt="Gesit" className="w-6 h-6 object-contain" />
                            <span className="font-display font-bold text-navy-deep text-sm">Gesit Admin</span>
                        </div>
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-navy-deep bg-slate-50 rounded-card-sm"><Menu size={20} /></button>
                    </header>

                    <div className="p-6 lg:p-12 max-w-7xl mx-auto">
                        <Suspense fallback={<SectionLoader />}>
                            {activeTab === 'overview' && <OverviewSection visitorCount={visitorCount} />}
                            {activeTab === 'news' && <ContentSection />}
                            {activeTab === 'careers' && <CareersVault />}
                            {activeTab === 'contacts' && <ContactSection />}
                            {activeTab === 'settings' && <SettingsSection />}
                        </Suspense>
                    </div>
                </main>
            </div>
        );
    }

    const showOtpScreen = isLoggedIn && !is2FAVerified;

    return (
        <div className="min-h-screen flex font-body bg-white">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-navy-deep overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/home/property.jpeg"
                        alt="Office"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-transparent"></div>
                </div>

                <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white w-full">
                    <div>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8">
                            <img src="/logo gesit.png" alt="Gesit" className="w-10 h-10 object-contain brightness-0 invert" />
                        </div>
                        <h1 className="text-4xl font-display font-bold leading-tight mb-4">
                            Building a<br />Sustainable Future
                        </h1>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md">
                            Secure access point for The Gesit Companies administrative portal. Manage content, careers, and inquiries efficiently.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#BA9B32]"></div>
                            <div className="w-2 h-2 rounded-full bg-white/20"></div>
                            <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-[#BA9B32] font-bold">
                            © 2024 The Gesit Companies
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[420px] bg-white lg:bg-transparent p-10 lg:p-0 rounded-3xl lg:rounded-none shadow-2xl lg:shadow-none"
                >
                    <div className="mb-10">
                        <div className="lg:hidden w-12 h-12 bg-navy-deep rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-navy-deep/20">
                            <img src="/logo gesit.png" alt="Logo" className="w-8 h-8 object-contain brightness-0 invert" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-navy-deep mb-2">Welcome Back</h2>
                        <p className="text-slate-500 text-sm">Please sign in to your dashboard.</p>
                    </div>

                    {!showOtpScreen ? (
                        <form onSubmit={handleLoginStep1} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#BA9B32] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-6 text-sm outline-none focus:bg-white focus:border-[#BA9B32] focus:ring-4 focus:ring-[#BA9B32]/10 transition-all font-medium text-navy-deep placeholder:text-slate-300"
                                        placeholder="admin@gesit.co.id"
                                        required
                                        disabled={isSending}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Password</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#BA9B32] transition-colors" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-6 text-sm outline-none focus:bg-white focus:border-[#BA9B32] focus:ring-4 focus:ring-[#BA9B32]/10 transition-all font-medium text-navy-deep placeholder:text-slate-300"
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
                                    className="text-red-500 text-[11px] font-bold text-center bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-center gap-2"
                                >
                                    <AlertCircle size={14} /> {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full py-4 bg-navy-deep text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-navy-deep/20 hover:bg-[#BA9B32] hover:shadow-[#BA9B32]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                {isSending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Portal</span>
                                        <ChevronRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-8">
                            <div className="text-center bg-emerald-50/50 p-8 rounded-2xl border border-emerald-100/50">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-sm ring-4 ring-white"><ShieldCheck size={32} /></div>
                                <h3 className="text-lg font-bold text-navy-deep">Security Verification</h3>
                                <p className="text-xs text-slate-500 mt-2">We sent a secure code to<br /><strong className="text-navy-deep">{email}</strong></p>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Enter Security Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    className="w-full bg-white border-2 border-slate-100 rounded-xl py-5 text-center text-3xl font-mono tracking-[0.5em] focus:border-[#BA9B32] focus:ring-4 focus:ring-[#BA9B32]/10 outline-none transition-all text-navy-deep shadow-sm"
                                    placeholder="000000"
                                    required
                                    maxLength={8}
                                    disabled={isSending}
                                    autoFocus
                                />
                            </div>

                            {error && <div className="text-red-500 text-xs font-bold text-center"><AlertCircle size={14} className="inline mr-2" /> {error}</div>}

                            <button type="submit" disabled={isSending || otp.length < 6} className="w-full py-4 bg-navy-deep text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-navy-deep/20 hover:bg-emerald-600 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2">
                                {isSending ? "Verifying..." : "Verify & Access"}
                            </button>

                            <div className="flex justify-between items-center px-1">
                                <button type="button" onClick={handleLogout} className="text-[10px] font-bold uppercase text-slate-400 hover:text-navy-deep transition-colors flex items-center gap-2">
                                    <LogOut size={12} /> Cancel login
                                </button>
                                <button type="button" onClick={() => supabase.auth.signInWithOtp({ email })} className="text-[10px] font-bold uppercase text-[#BA9B32] hover:text-[#9A7F25]">Resend Code</button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
