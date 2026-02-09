import React, { useState, useEffect, Suspense, lazy } from "react";
import {
    LayoutDashboard,
    Newspaper,
    Briefcase,
    Mail,
    Settings,
    LogOut,
    Menu,
    ChevronRight,
    AlertCircle,
    ShieldCheck,
    Eye,
    Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

// Lazy load sections
const OverviewSection = lazy(() => import("./admin/OverviewSection"));
const ContentSection = lazy(() => import("./admin/ContentSection"));
const CareersVault = lazy(() => import("./admin/CareersVault"));
const SiteEditor = lazy(() => import("./admin/SiteEditor"));
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
        { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "news", label: "Journal", icon: <Newspaper size={20} /> },
        { id: "careers", label: "Vault", icon: <Briefcase size={20} /> },
        { id: "contacts", label: "Inbox", icon: <Mail size={20} /> },
        { id: "site", label: "Global", icon: <Globe size={20} /> },
        { id: "settings", label: "Config", icon: <Settings size={20} /> },
    ];

    if (authLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#BA9B32] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (isLoggedIn && is2FAVerified) {
        return (
            <div className="flex min-h-screen bg-[#F0F2F5] text-navy-deep overflow-x-hidden selection:bg-amber-100/50">
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Solid Navy-Deep Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        x: (isSidebarOpen || window.innerWidth >= 1024) ? 0 : -280,
                        width: 260
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed top-0 left-0 bottom-0 w-[260px] bg-navy-deep z-50 flex flex-col py-8 shadow-2xl transition-all"
                >
                    <div className="px-8 mb-12 flex items-center gap-4">
                        <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center p-2.5 border border-white/10 shrink-0">
                            <img src="/logo gesit.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] font-black text-white tracking-tight leading-none font-body">The Gesit Companies</span>
                            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-1.5 opacity-80">Admin</span>
                        </div>
                    </div>

                    <nav className="flex-grow flex flex-col gap-1 px-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                                className={`relative flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group/nav text-left ${activeTab === tab.id ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white hover:bg-white/5"}`}
                            >
                                <div className={`shrink-0 transition-transform duration-300 ${activeTab === tab.id ? "scale-110 text-amber-500" : "group-hover/nav:scale-110"}`}>
                                    {React.isValidElement(tab.icon) ? React.cloneElement(tab.icon as React.ReactElement<any>, { size: 18 }) : tab.icon}
                                </div>
                                <span className={`text-[11px] uppercase font-black tracking-widest leading-none transition-all duration-300 ${activeTab === tab.id ? "translate-x-1" : ""}`}>
                                    {tab.label}
                                </span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                    />
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto px-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-5 py-4 text-white/40 hover:text-red-400 transition-all rounded-xl hover:bg-red-400/10 group/logout"
                        >
                            <div className="transition-transform duration-300 group-hover/logout:-translate-x-1">
                                <LogOut size={18} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <main className="flex-1 lg:pl-[260px] min-h-screen relative z-10">
                    {/* Sleek Integrated Header */}
                    <header className="fixed top-0 right-0 lg:left-[260px] left-0 z-40 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-black text-navy-deep tracking-tight capitalize leading-none">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Operational Matrix
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex relative group w-64">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors">
                                    <Eye size={14} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Execute search..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-5 text-[10px] font-bold outline-none focus:bg-white focus:border-amber-200 transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-navy-deep hover:shadow-sm transition-all active:scale-95">
                                        <Settings size={18} />
                                    </button>
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="lg:hidden w-10 h-10 bg-navy-deep text-white rounded-xl flex items-center justify-center shadow-lg shadow-navy-deep/20 active:scale-95 transition-transform"
                                    >
                                        <Menu size={18} />
                                    </button>
                                </div>
                                <div className="h-6 w-px bg-slate-200 mx-1" />
                                <div className="flex items-center gap-3 pl-1 group/profile cursor-pointer">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[11px] font-black text-navy-deep leading-none">Admin Hub</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">System Live</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center p-0.5 overflow-hidden transition-transform group-hover/profile:scale-105">
                                        <img src="https://ui-avatars.com/api/?name=Admin&background=103065&color=fff&bold=true" className="w-full h-full object-cover rounded-[10px]" alt="Admin" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Section with Page Transitions */}
                    <div className="max-w-7xl mx-auto p-8 md:p-12 mt-[88px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <Suspense fallback={<SectionLoader />}>
                                    {activeTab === 'overview' && <OverviewSection visitorCount={visitorCount} />}
                                    {activeTab === 'news' && <ContentSection />}
                                    {activeTab === 'careers' && <CareersVault />}
                                    {activeTab === 'contacts' && <ContactSection />}
                                    {activeTab === 'site' && <SiteEditor />}
                                    {activeTab === 'settings' && <SettingsSection />}
                                </Suspense>
                            </motion.div>
                        </AnimatePresence>
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
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 mb-8 shadow-lg">
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50 lg:bg-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(#BA9B32_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none lg:hidden" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[440px] bg-white lg:bg-transparent p-10 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-[0_20px_60px_-15px_rgba(16,48,101,0.1)] lg:shadow-none border border-slate-100 lg:border-0 relative z-10"
                >
                    <div className="mb-12">
                        <div className="lg:hidden w-16 h-16 bg-navy-deep rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-navy-deep/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#BA9B32] to-navy-deep opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <img src="/logo gesit.png" alt="Logo" className="w-10 h-10 object-contain brightness-0 invert relative z-10" />
                        </div>
                        <h2 className="text-4xl font-display font-black text-navy-deep mb-3 tracking-tight">Management Access</h2>
                        <p className="text-slate-400 text-sm font-medium tracking-wide">Enter your credentials to secure the portal.</p>
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
                            <div className="text-center bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
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
