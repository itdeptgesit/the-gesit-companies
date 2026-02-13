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
        <div className="w-10 h-10 border-4 border-[#BC9C33] border-t-transparent rounded-full animate-spin"></div>
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


    useEffect(() => {
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
            checkSession();
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const userEmail = session?.user?.email?.toLowerCase();

        if (session && userEmail) {
            // Check if email exists in admins table
            const { data: adminData } = await supabase
                .from('admins')
                .select('email')
                .eq('email', userEmail)
                .single();

            if (adminData) {
                setIsLoggedIn(true);
                setEmail(userEmail);
                const lastVerified = localStorage.getItem('gesit_admin_2fa_verified');
                const isRecentlyVerified = lastVerified && (Date.now() - parseInt(lastVerified) < 24 * 60 * 60 * 1000);
                setIs2FAVerified(!!isRecentlyVerified);
            } else {
                setIsLoggedIn(false);
                setIs2FAVerified(false);
                if (session) await supabase.auth.signOut(); // Force sign out if not admin
            }
        } else {
            setIsLoggedIn(false);
            setIs2FAVerified(false);
        }
        setAuthLoading(false);
    };

    useEffect(() => {
        const fetchVisitorStats = async () => {
            const { data } = await supabase
                .from('site_stats')
                .select('value')
                .eq('key', 'total_visitors')
                .single();
            if (data) {
                const val = parseInt(data.value);
                setVisitorCount(isNaN(val) ? 0 : val);
            }
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

        try {
            // 1. Authenticate with Supabase first (to satisfy RLS policy TO authenticated)
            const { error: passwordError, data: { session } } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });

            if (passwordError) throw new Error("Invalid email or password.");
            if (!session) throw new Error("Authentication failed.");

            // 2. Now check if email is in admins table (User is authenticated)
            const { data: adminData, error: adminError } = await supabase
                .from('admins')
                .select('email')
                .eq('email', cleanEmail)
                .single();

            if (adminError || !adminData) {
                // If not an admin, sign them out immediately
                await supabase.auth.signOut();
                throw new Error("Access Denied: This email is not authorized.");
            }

            // 3. Initiate OTP for 2FA
            const { error: otpError } = await supabase.auth.signInWithOtp({ email: cleanEmail, options: { shouldCreateUser: false } });
            if (otpError) throw otpError;

            // Move to step 2 (OTP Input)
            await checkSession();
        } catch (err: any) {
            setError(err.message || "Authentication failed.");
            // Ensure logout on failure if session was created
            const { data: { session } } = await supabase.auth.getSession();
            if (session) await supabase.auth.signOut();
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
        { id: "news", label: "News", icon: <Newspaper size={20} /> },
        { id: "careers", label: "Careers", icon: <Briefcase size={20} /> },
        { id: "contacts", label: "Inbox", icon: <Mail size={20} /> },
        { id: "site", label: "Website", icon: <Globe size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    if (authLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#BC9C33] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (isLoggedIn && is2FAVerified) {
        return (
            <div className="flex min-h-screen bg-slate-50 text-navy-deep overflow-x-hidden selection:bg-amber-100/50">
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

                {/* Clean White Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        x: (isSidebarOpen || window.innerWidth >= 1024) ? 0 : -280,
                        width: 280
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed top-0 left-0 bottom-0 bg-white z-[60] flex flex-col py-8 border-r border-slate-100 transition-all"
                >
                    <div className="px-10 mb-16 flex items-center gap-5 group/brand cursor-pointer">
                        <div className="transition-transform group-hover/brand:scale-110 duration-700">
                            <img src="/logo gesit.png" alt="Gesit" className="w-14 h-14 object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-display font-black text-navy-deep tracking-tight leading-none">The Gesit</span>
                            <span className="text-[15px] font-display font-black text-[#BC9C33] tracking-tight leading-none mt-1">Companies</span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-3">Admin Portal</span>
                        </div>
                    </div>

                    <nav className="flex-grow flex flex-col gap-1 px-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                                className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group/nav text-left ${activeTab === tab.id ? "bg-slate-50/80 text-navy-deep font-bold" : "text-slate-400 hover:text-navy-deep hover:bg-slate-50/50"}`}
                            >
                                <div className={`shrink-0 transition-transform duration-300 ${activeTab === tab.id ? "scale-110 text-[#BC9C33]" : "group-hover/nav:scale-110"}`}>
                                    {React.isValidElement(tab.icon) ? React.cloneElement(tab.icon as React.ReactElement<any>, { size: 18, strokeWidth: activeTab === tab.id ? 2.5 : 2 }) : tab.icon}
                                </div>
                                <span className={`text-[11px] uppercase tracking-[0.15em] font-black transition-all duration-300 ${activeTab === tab.id ? "translate-x-1" : ""}`}>
                                    {tab.label}
                                </span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute left-0 w-1 h-6 bg-[#BC9C33] rounded-r-full"
                                    />
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto px-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-500 transition-all rounded-2xl hover:bg-red-50 group/logout"
                        >
                            <div className="transition-transform duration-300 group-hover/logout:-translate-x-1">
                                <LogOut size={18} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <main className="flex-1 lg:pl-[280px] min-h-screen relative z-10">
                    {/* Sleek Header */}
                    <header className="fixed top-0 right-0 lg:left-[280px] left-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6 flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-black text-navy-deep tracking-tight capitalize leading-none font-display">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2.5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                System Online
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex relative group w-64">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#BC9C33] transition-colors">
                                    <Eye size={14} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Execute search..."
                                    className="w-full bg-slate-50 border border-transparent rounded-xl py-2.5 pl-10 pr-5 text-[10px] font-bold outline-none focus:bg-white focus:border-slate-200 transition-all font-body text-navy-deep placeholder:text-slate-300"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-navy-deep hover:bg-slate-50 transition-all active:scale-95">
                                        <Settings size={18} />
                                    </button>
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="lg:hidden w-10 h-10 bg-navy-deep text-white rounded-xl flex items-center justify-center shadow-lg shadow-navy-deep/20 active:scale-95 transition-transform"
                                    >
                                        <Menu size={18} />
                                    </button>
                                </div>
                                <div className="h-6 w-px bg-slate-100" />
                                <div className="flex items-center gap-3 group/profile cursor-pointer">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[11px] font-black text-navy-deep leading-none">Admin Hub</p>
                                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">System Live</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-0.5 overflow-hidden transition-all group-hover/profile:ring-2 group-hover/profile:ring-[#BC9C33]/20">
                                        <div className="w-full h-full bg-navy-deep rounded-[10px] flex items-center justify-center text-white text-[10px] font-black uppercase">
                                            AD
                                        </div>
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
                                    {activeTab === 'overview' && <OverviewSection visitorCount={visitorCount} onNavigate={setActiveTab} />}
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
                        <div className="flex items-center gap-8 mb-16 group">
                            <div className="transition-transform group-hover:scale-105 duration-700">
                                <img src="/logo gesit.png" alt="Gesit" className="w-24 h-24 object-contain" />
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-display font-black text-white tracking-tight">The Gesit</span>
                                <span className="text-3xl font-display font-black text-[#BC9C33] tracking-tight ml-3">Companies</span>
                            </div>
                        </div>
                        <h1 className="text-5xl font-display font-bold leading-tight mb-8">
                            Building a<br />Sustainable Future
                        </h1>
                        <p className="text-white/60 text-lg leading-relaxed max-w-md font-light">
                            Secure access point for The Gesit Companies administrative portal. Manage content, careers, and inquiries efficiently.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#BC9C33]"></div>
                            <div className="w-3 h-3 rounded-full bg-white/10"></div>
                            <div className="w-3 h-3 rounded-full bg-white/10"></div>
                        </div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#BC9C33] font-bold">
                            © 2024 The Gesit Companies
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50 lg:bg-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(#BC9C33_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none lg:hidden" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[440px] bg-white lg:bg-transparent p-10 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-[0_20px_60px_-15px_rgba(16,48,101,0.1)] lg:shadow-none border border-slate-100 lg:border-0 relative z-10"
                >
                    <div className="mb-16">
                        <div className="lg:hidden flex items-center gap-6 mb-12 group">
                            <div className="transition-transform group-hover:scale-110 duration-500">
                                <img src="/logo gesit.png" alt="Logo" className="w-20 h-20 object-contain" />
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-2xl font-display font-black text-navy-deep tracking-tight">The Gesit</span>
                                <span className="text-2xl font-display font-black text-[#BC9C33] tracking-tight ml-2">Companies</span>
                            </div>
                        </div>
                        <h2 className="text-5xl font-display font-black text-navy-deep mb-4 tracking-tighter">Welcome Back</h2>
                        <p className="text-slate-400 text-base font-medium">Please login to manage the website.</p>
                    </div>

                    {!showOtpScreen ? (
                        <form onSubmit={handleLoginStep1} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#BC9C33] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-6 text-sm outline-none focus:bg-white focus:border-[#BC9C33] focus:ring-4 focus:ring-[#BC9C33]/10 transition-all font-medium text-navy-deep placeholder:text-slate-300"
                                        placeholder="admin@gesit.co.id"
                                        required
                                        disabled={isSending}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Password</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#BC9C33] transition-colors" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-6 text-sm outline-none focus:bg-white focus:border-[#BC9C33] focus:ring-4 focus:ring-[#BC9C33]/10 transition-all font-medium text-navy-deep placeholder:text-slate-300"
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
                                className="w-full py-4 bg-navy-deep text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-navy-deep/20 hover:bg-[#BC9C33] hover:shadow-[#BC9C33]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
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
                                    className="w-full bg-white border-2 border-slate-100 rounded-xl py-5 text-center text-3xl font-mono tracking-[0.5em] focus:border-[#BC9C33] focus:ring-4 focus:ring-[#BC9C33]/10 outline-none transition-all text-navy-deep shadow-sm"
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
                                <button type="button" onClick={() => supabase.auth.signInWithOtp({ email })} className="text-[10px] font-bold uppercase text-[#BC9C33] hover:text-[#BC9C33]">Resend Code</button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
