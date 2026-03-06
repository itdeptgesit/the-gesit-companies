import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save,
    Search,
    ShieldAlert,
    CheckCircle2,
    Image as ImageIcon,
    Building,
    Phone,
    Globe,
    ExternalLink,
    Type,
    Users,
    Trash2,
    Plus
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";

const TeamManager = () => {
    const [admins, setAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newEmail, setNewEmail] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // Initial fetch
    useState(() => {
        fetchAdmins();
    });

    async function fetchAdmins() {
        setIsLoading(true);
        const { data } = await supabase
            .from('admins')
            .select('*')
            .order('created_at', { ascending: true });

        if (data) setAdmins(data);
        setIsLoading(false);
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail) return;
        setIsAdding(true);

        const { error } = await supabase
            .from('admins')
            .insert([{ email: newEmail.toLowerCase() }]);

        if (error) {
            alert("Error adding admin: " + error.message);
        } else {
            setNewEmail("");
            fetchAdmins();
        }
        setIsAdding(false);
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove access for ${email}?`)) return;

        const { error } = await supabase
            .from('admins')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Error removing admin: " + error.message);
        } else {
            fetchAdmins();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-10 relative z-10"
        >
            <div className="bg-navy-deep rounded-[6px] p-10 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-1 h-5 bg-amber-500 rounded-[6px]" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Access Control</p>
                        </div>
                        <h2 className="text-3xl font-display font-black tracking-tight leading-tight mb-4">
                            Manage Team<br />Access
                        </h2>
                        <p className="text-white/60 text-sm font-medium max-w-md">
                            Control who has access to the admin dashboard. Admins listed here have full read/write access to the platform.
                        </p>
                    </div>
                    <form onSubmit={handleAdd} className="bg-white/10 backdrop-blur-sm p-6 rounded-[6px] border border-white/10">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-3">Invite New Admin</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="colleague@gesit.co.id"
                                className="flex-1 bg-white/10 border border-white/10 rounded-[6px] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:bg-white focus:text-navy-deep transition-all outline-none"
                            />
                            <button
                                type="submit"
                                disabled={isAdding || !newEmail}
                                className="px-4 py-3 bg-amber-500 text-white rounded-[6px] font-bold hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAdding ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={20} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[6px] p-8 shadow-sm">
                <h3 className="text-lg font-black text-navy-deep mb-6 flex items-center gap-3">
                    <Users size={20} className="text-slate-400" />
                    Authorized Administrators
                </h3>

                <div className="space-y-3">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading team...</div>
                    ) : admins.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No admins found.</div>
                    ) : (
                        admins.map((admin) => (
                            <div key={admin.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-[6px] border border-slate-100 group hover:border-slate-200 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-[6px] bg-navy-deep text-white flex items-center justify-center font-bold text-xs">
                                        {admin.email.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-navy-deep">{admin.email}</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">
                                            {admin.role || 'Admin'} • Added {new Date(admin.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(admin.id, admin.email)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-[6px] transition-all opacity-0 group-hover:opacity-100"
                                    title="Revoke Access"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const PageSEOManager = () => {
    const pages = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Property', path: '/property' },
        { name: 'Trading & Services', path: '/trading' },
        { name: 'Manufacturing', path: '/manufacturing' },
        { name: 'Natural Resources', path: '/natural' },
        { name: 'Careers', path: '/careers' },
        { name: 'News Archive', path: '/news' },
        { name: 'Contact', path: '/contact' }
    ];

    const [selectedPage, setSelectedPage] = useState(pages[0].path);
    const [seoData, setSeoData] = useState({ title: '', description: '', keywords: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchSEO();
    }, [selectedPage]);

    const fetchSEO = async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from('page_content')
            .select('value')
            .eq('page', 'seo')
            .eq('key', selectedPage)
            .single();

        if (data && data.value) {
            try {
                setSeoData(JSON.parse(data.value));
            } catch (e) {
                setSeoData({ title: '', description: '', keywords: '' });
            }
        } else {
            setSeoData({ title: '', description: '', keywords: '' });
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('page_content')
            .upsert({
                page: 'seo',
                key: selectedPage,
                value: JSON.stringify(seoData),
                section: 'Metadata'
            }, { onConflict: 'page,key' });

        if (error) {
            showToast("Error saving: " + error.message, "error");
        } else {
            const { logActivity } = await import("../../lib/tracking");
            await logActivity('UPDATE', 'Per-Page SEO', `Updated SEO for ${selectedPage}`);
            showToast("SEO metadata updated successfully!", "success");
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-8">
            <div className="bg-navy-deep rounded-[6px] p-8 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 bg-amber-500 rounded-[6px]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#BC9C33]">Advanced Optimization</span>
                        </div>
                        <h4 className="text-2xl font-black font-display tracking-tight">Per-Page SEO Manager</h4>
                        <p className="text-white/40 text-xs font-medium mt-2">Configure unique search engine identities for individual sections.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {pages.map(p => (
                            <button
                                key={p.path}
                                onClick={() => setSelectedPage(p.path)}
                                className={`px-4 py-2 rounded-[6px] text-[9px] font-black uppercase tracking-widest transition-all ${selectedPage === p.path ? 'bg-amber-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[6px] p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Meta Title Tag</label>
                        <input
                            type="text"
                            value={seoData.title}
                            onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[6px] py-4 px-6 text-sm font-bold text-navy-deep focus:border-amber-500 outline-none transition-all"
                            placeholder="Title shown in browser tab & search results..."
                        />
                    </div>
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Meta Description</label>
                        <textarea
                            value={seoData.description}
                            onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[6px] py-4 px-6 text-sm font-medium text-slate-600 h-32 resize-none leading-relaxed focus:border-amber-500 outline-none transition-all"
                            placeholder="Brief snippet describing this page's content..."
                        />
                    </div>
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Focus Keywords</label>
                        <input
                            type="text"
                            value={seoData.keywords}
                            onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[6px] py-4 px-6 text-[11px] font-black text-navy-deep focus:border-amber-500 outline-none transition-all"
                            placeholder="comma-separated, search-terms..."
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-navy-deep text-white rounded-[6px] text-[10px] font-black uppercase tracking-widest hover:bg-[#BC9C33] transition-all disabled:opacity-50"
                    >
                        {isSaving ? "Syncing..." : "Update Page Identity"}
                    </button>
                </div>

                {/* Preview Card */}
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Google Search Preview</label>
                    <div className="bg-slate-50 rounded-[6px] p-8 border border-white shadow-inner">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-[6px] bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                <Search size={14} className="text-slate-200" />
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">gesit.co.id{selectedPage === '/' ? '' : selectedPage}</span>
                        </div>
                        <h5 className="text-[#1a0dab] text-xl font-bold mb-2 truncate">
                            {seoData.title || (selectedPage === '/' ? 'Home' : selectedPage.substring(1).charAt(0).toUpperCase() + selectedPage.slice(2)) + ' | The Gesit Companies'}
                        </h5>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                            {seoData.description || 'No description provided. Search engines will generate a snippet from page content.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsSection = () => {
    const { settings, loading, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState<'general' | 'seo' | 'team'>('general');

    const handleChange = (key: keyof typeof settings, value: string | boolean) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const changes: any = {};
        (Object.keys(localSettings) as Array<keyof typeof settings>).forEach(key => {
            if (localSettings[key] !== settings[key]) {
                changes[key] = localSettings[key];
            }
        });

        if (Object.keys(changes).length > 0) {
            await updateSettings(changes);
            const { logActivity } = await import("../../lib/tracking");
            await logActivity('UPDATE', 'Global Settings', `Updated ${Object.keys(changes).join(', ')}`);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        }
        setIsSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BC9C33]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 relative pb-20">
            {/* Success Popup */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-10 left-1/2 z-[100] bg-white border border-slate-200 shadow-2xl rounded-[6px] px-8 py-4 flex items-center gap-4"
                    >
                        <div className="w-10 h-10 rounded-[6px] bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-navy-deep tracking-tight">Sync Complete</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Settings updated successfully</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="sticky top-0 z-30 py-4 -mt-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-5 bg-amber-500 rounded-[6px]" />
                            <h2 className="text-2xl font-black text-navy-deep tracking-tighter">System Settings</h2>
                        </div>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] ml-5">Global website configuration</p>
                    </div>
                </div>
            </div>

            {/* Floating Save Button - Always Visible */}
            <div className="fixed bottom-10 right-10 z-50">
                <button
                    onClick={handleSave}
                    disabled={isSaving || loading}
                    className="group flex items-center gap-4 px-8 py-4 bg-navy-deep text-white rounded-[6px] font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-all duration-300 disabled:opacity-50 shadow-xl shadow-navy-deep/20 active:scale-95"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <div className="relative">
                            <Save size={18} />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-[6px] border border-navy-deep" />
                        </div>
                    )}
                    <span className="font-black">{isSaving ? "Syncing..." : "Sync Changes"}</span>
                </button>
            </div>

            <div className="bg-white rounded-[6px] p-8 md:p-10 border border-slate-200 shadow-sm text-left relative overflow-hidden group/main">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                    <div className="flex bg-slate-100 p-1 rounded-[6px] border border-slate-200 shadow-sm w-fit">
                        <button
                            onClick={() => setActiveSubTab('general')}
                            className={`px-8 py-2.5 rounded-[6px] text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'general' ? 'bg-navy-deep text-white shadow-md' : 'text-slate-400 hover:text-navy-deep'}`}
                        >
                            General
                        </button>
                        <button
                            onClick={() => setActiveSubTab('seo')}
                            className={`px-8 py-2.5 rounded-[6px] text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'seo' ? 'bg-navy-deep text-white shadow-md' : 'text-slate-400 hover:text-navy-deep'}`}
                        >
                            Advanced SEO
                        </button>
                        <button
                            onClick={() => setActiveSubTab('team')}
                            className={`px-8 py-2.5 rounded-[6px] text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'team' ? 'bg-navy-deep text-white shadow-md' : 'text-slate-400 hover:text-navy-deep'}`}
                        >
                            Team & Access
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-slate-50 rounded-[6px] border border-slate-100">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-[6px] animate-pulse" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Environment Live</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeSubTab === 'general' ? (
                        <motion.div
                            key="general"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-16 relative z-10"
                        >
                            {/* Maintenance Protocol */}
                            <div className={`rounded-[6px] p-6 flex items-center justify-between transition-all ${localSettings.maintenanceMode ? 'bg-amber-500 border border-amber-600' : 'bg-slate-50 border border-slate-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-[6px] flex items-center justify-center transition-all shadow-sm ${localSettings.maintenanceMode ? 'bg-white text-amber-500' : 'bg-white text-amber-600'}`}>
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div>
                                        <h4 className={`text-base font-black tracking-tight flex items-center gap-2 ${localSettings.maintenanceMode ? 'text-white' : 'text-navy-deep'}`}>
                                            Maintenance Mode
                                        </h4>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${localSettings.maintenanceMode ? 'text-white/70' : 'text-slate-400'}`}>Disable public access to the website</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleChange('maintenanceMode', !localSettings.maintenanceMode)}
                                    className={`w-12 h-6 rounded-[6px] relative transition-all shadow-inner ${localSettings.maintenanceMode ? 'bg-white/20' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-[6px] shadow transition-all ${localSettings.maintenanceMode ? 'left-7 bg-white' : 'left-1 bg-white'}`} />
                                </button>
                            </div>

                            {/* Typography Section */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[6px] bg-white shadow-md flex items-center justify-center text-navy-deep border border-slate-50">
                                        <Type size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-navy-deep text-lg tracking-tighter">Typography Settings</h4>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure global website fonts</p>
                                    </div>
                                </div>

                                {/* Typography Grid */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            Heading Font
                                        </h5>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[
                                                'Playfair Display', 'Poppins', 'Space Grotesk',
                                                'Outfit', 'Plus Jakarta Sans', 'Manrope', 'Georgia'
                                            ].map((font) => (
                                                <button
                                                    key={font}
                                                    onClick={() => handleChange('headingFont', font)}
                                                    className={`p-4 rounded-[6px] border transition-all relative ${localSettings.headingFont === font
                                                        ? 'border-amber-500 bg-white shadow-sm'
                                                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                                                        }`}
                                                    style={{ fontFamily: font }}
                                                >
                                                    <p className="text-xl font-black text-navy-deep mb-1">Aa</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{font}</p>
                                                    {localSettings.headingFont === font && (
                                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-500 rounded-[6px]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            Body Content Font
                                        </h5>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[
                                                'Open Sans', 'Inter', 'Lato',
                                                'Nunito', 'Work Sans', 'Raleway', 'Source Sans Pro'
                                            ].map((font) => (
                                                <button
                                                    key={font}
                                                    onClick={() => handleChange('bodyFont', font)}
                                                    className={`p-4 rounded-[6px] border transition-all relative ${localSettings.bodyFont === font
                                                        ? 'border-navy-deep bg-white shadow-sm'
                                                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                                                        }`}
                                                    style={{ fontFamily: font }}
                                                >
                                                    <p className="text-xl font-medium text-navy-deep mb-1">Aa</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{font}</p>
                                                    {localSettings.bodyFont === font && (
                                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-navy-deep rounded-[6px]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Console */}
                                <div className="bg-navy-deep rounded-[6px] p-8 md:p-10 mt-6 relative overflow-hidden group/preview">
                                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-[6px] flex items-center justify-center text-white">
                                                <Globe size={18} />
                                            </div>
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Live Preview</h5>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="px-4 py-2 bg-white/5 rounded-[6px] border border-white/10">
                                                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mr-2">Core:</span>
                                                <span className="text-[9px] font-black text-amber-500" style={{ fontFamily: localSettings.headingFont }}>{localSettings.headingFont}</span>
                                            </div>
                                            <div className="px-4 py-2 bg-white/5 rounded-[6px] border border-white/10">
                                                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mr-2">Data:</span>
                                                <span className="text-[9px] font-black text-blue-400" style={{ fontFamily: localSettings.bodyFont }}>{localSettings.bodyFont}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left space-y-6">
                                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight" style={{ fontFamily: localSettings.headingFont }}>
                                            The Art of Global<br />Corporate Strategy.
                                        </h1>
                                        <div className="max-w-2xl">
                                            <p className="text-sm text-white/60 leading-relaxed font-medium" style={{ fontFamily: localSettings.bodyFont }}>
                                                Every element within the Gesit Workspace reflects our commitment to precision and excellence. This live preview demonstrates how the selected typography scales across our major digital touchpoints.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Brand & Assets Input Redesign */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    {
                                        label: 'Identity Assets',
                                        icon: <ImageIcon size={18} />,
                                        fields: [
                                            { id: 'logoUrl', label: 'Primary Symbol', placeholder: '/logo.png', icon: <Building size={14} /> },
                                            { id: 'faviconUrl', label: 'Terminal Icon', placeholder: '/favicon.ico', icon: <Globe size={14} /> }
                                        ]
                                    },
                                    {
                                        label: 'Contact Nodes',
                                        icon: <Phone size={18} />,
                                        fields: [
                                            { id: 'phoneNumber', label: 'Direct Line', placeholder: '+62...', icon: <Phone size={14} /> },
                                            { id: 'googleMapsUrl', label: 'Geographical Link', placeholder: 'https://maps...', icon: <ExternalLink size={14} /> }
                                        ]
                                    }
                                ].map((group, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-200 p-8 rounded-[6px] shadow-sm">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-[6px] shadow-sm flex items-center justify-center text-navy-deep">
                                                {group.icon}
                                            </div>
                                            <h4 className="font-black text-navy-deep text-xs uppercase tracking-widest">{group.label}</h4>
                                        </div>
                                        <div className="space-y-6">
                                            {group.fields.map(field => (
                                                <div key={field.id} className="relative">
                                                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">
                                                        {field.label}
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                                            {field.icon}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={(localSettings as any)[field.id]}
                                                            onChange={(e) => handleChange(field.id as any, e.target.value)}
                                                            className="w-full bg-white border border-slate-200 rounded-[6px] py-3.5 pl-14 pr-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm"
                                                            placeholder={field.placeholder}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {i === 1 && (
                                                <div className="relative">
                                                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Office Address</label>
                                                    <textarea
                                                        value={localSettings.officeAddress}
                                                        onChange={(e) => handleChange('officeAddress', e.target.value)}
                                                        rows={2}
                                                        className="w-full bg-white border border-slate-200 rounded-[6px] py-3.5 px-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm resize-none leading-relaxed"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : activeSubTab === 'seo' ? (
                        <motion.div
                            key="seo"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <PageSEOManager />

                            <div className="h-20" /> {/* Spacer */}

                            {/* Global SEO Settings Redesign */}
                            <div className="bg-slate-50 rounded-[6px] p-10 border border-slate-200">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-1 bg-[#BC9C33] rounded-[6px]" />
                                    <h4 className="text-xl font-black text-navy-deep">Global Metadata</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="relative">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Meta Master Title</label>
                                            <input
                                                type="text"
                                                value={localSettings.siteTitle}
                                                onChange={(e) => handleChange('siteTitle', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-[6px] py-3.5 px-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm"
                                                placeholder="Corporate Identity Title..."
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Search Keywords</label>
                                            <textarea
                                                value={localSettings.keywords}
                                                onChange={(e) => handleChange('keywords', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-[6px] py-3.5 px-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm min-h-[120px] resize-none leading-relaxed"
                                                placeholder="growth, excellence, precision..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex flex-col">
                                        <div className="relative flex-grow flex flex-col">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Global Description</label>
                                            <textarea
                                                value={localSettings.siteDescription}
                                                onChange={(e) => handleChange('siteDescription', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-[6px] py-4 px-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm flex-grow min-h-[180px] leading-relaxed"
                                                placeholder="Write a high-performance snippet for search crawlers..."
                                            />
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-slate-200">
                                            <div className="relative">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Telemetry ID (G-ID)</label>
                                                <div className="relative">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                                        <Globe size={14} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={localSettings.googleAnalyticsId}
                                                        onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-[6px] py-3.5 pl-14 pr-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm"
                                                        placeholder="G-..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <TeamManager />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SettingsSection;
