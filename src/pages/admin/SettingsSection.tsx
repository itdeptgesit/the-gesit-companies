import { useState } from "react";
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
    Type
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

const SettingsSection = () => {
    const { settings, loading, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState<'general' | 'seo'>('general');

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
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        }
        setIsSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BA9B32]"></div>
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
                        className="fixed top-10 left-1/2 z-[100] bg-white border border-slate-200 shadow-2xl rounded-2xl px-8 py-4 flex items-center gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-navy-deep tracking-tight">Sync Complete</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Global configuration updated</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="sticky top-0 z-30 py-4 -mt-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-5 bg-amber-500 rounded-full" />
                            <h2 className="text-2xl font-black text-navy-deep tracking-tighter">System Config</h2>
                        </div>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] ml-5">Global platform environment</p>
                    </div>
                </div>
            </div>

            {/* Floating Save Button - Always Visible */}
            <div className="fixed bottom-10 right-10 z-50">
                <button
                    onClick={handleSave}
                    disabled={isSaving || loading}
                    className="group flex items-center gap-4 px-8 py-4 bg-navy-deep text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-all duration-300 disabled:opacity-50 shadow-xl shadow-navy-deep/20 active:scale-95"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <div className="relative">
                            <Save size={18} />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-navy-deep" />
                        </div>
                    )}
                    <span className="font-black">{isSaving ? "Syncing..." : "Sync Changes"}</span>
                </button>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm text-left relative overflow-hidden group/main">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                        <button
                            onClick={() => setActiveSubTab('general')}
                            className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'general' ? 'bg-navy-deep text-white shadow-md' : 'text-slate-400 hover:text-navy-deep'}`}
                        >
                            General
                        </button>
                        <button
                            onClick={() => setActiveSubTab('seo')}
                            className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'seo' ? 'bg-navy-deep text-white shadow-md' : 'text-slate-400 hover:text-navy-deep'}`}
                        >
                            Traffic & SEO
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
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
                            <div className={`rounded-2xl p-6 flex items-center justify-between transition-all ${localSettings.maintenanceMode ? 'bg-amber-500 border border-amber-600' : 'bg-slate-50 border border-slate-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm ${localSettings.maintenanceMode ? 'bg-white text-amber-500' : 'bg-white text-amber-600'}`}>
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div>
                                        <h4 className={`text-base font-black tracking-tight flex items-center gap-2 ${localSettings.maintenanceMode ? 'text-white' : 'text-navy-deep'}`}>
                                            Maintenance Mode
                                        </h4>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${localSettings.maintenanceMode ? 'text-white/70' : 'text-slate-400'}`}>Restrict public availability of the platform</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleChange('maintenanceMode', !localSettings.maintenanceMode)}
                                    className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${localSettings.maintenanceMode ? 'bg-white/20' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all ${localSettings.maintenanceMode ? 'left-7 bg-white' : 'left-1 bg-white'}`} />
                                </button>
                            </div>

                            {/* Typography Section */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-navy-deep border border-slate-50">
                                        <Type size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-navy-deep text-lg tracking-tighter">Text Archetypes</h4>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure global font families</p>
                                    </div>
                                </div>

                                {/* Typography Grid */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            Heading Engine
                                        </h5>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[
                                                'Playfair Display', 'Poppins', 'Space Grotesk',
                                                'Outfit', 'Plus Jakarta Sans', 'Manrope'
                                            ].map((font) => (
                                                <button
                                                    key={font}
                                                    onClick={() => handleChange('headingFont', font)}
                                                    className={`p-4 rounded-xl border transition-all relative ${localSettings.headingFont === font
                                                        ? 'border-amber-500 bg-white shadow-sm'
                                                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                                                        }`}
                                                    style={{ fontFamily: font }}
                                                >
                                                    <p className="text-xl font-black text-navy-deep mb-1">Aa</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{font}</p>
                                                    {localSettings.headingFont === font && (
                                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            Content Engine
                                        </h5>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[
                                                'Open Sans', 'Inter', 'Lato',
                                                'Nunito', 'Work Sans', 'Raleway'
                                            ].map((font) => (
                                                <button
                                                    key={font}
                                                    onClick={() => handleChange('bodyFont', font)}
                                                    className={`p-4 rounded-xl border transition-all relative ${localSettings.bodyFont === font
                                                        ? 'border-navy-deep bg-white shadow-sm'
                                                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                                                        }`}
                                                    style={{ fontFamily: font }}
                                                >
                                                    <p className="text-xl font-medium text-navy-deep mb-1">Aa</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{font}</p>
                                                    {localSettings.bodyFont === font && (
                                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-navy-deep rounded-full" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Console */}
                                <div className="bg-navy-deep rounded-[2rem] p-8 md:p-10 mt-6 relative overflow-hidden group/preview">
                                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                                <Globe size={18} />
                                            </div>
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Live Preview</h5>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mr-2">Core:</span>
                                                <span className="text-[9px] font-black text-amber-500" style={{ fontFamily: localSettings.headingFont }}>{localSettings.headingFont}</span>
                                            </div>
                                            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
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
                                    <div key={i} className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-navy-deep">
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
                                                            className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-14 pr-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm"
                                                            placeholder={field.placeholder}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {i === 1 && (
                                                <div className="relative">
                                                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Physical Node</label>
                                                    <textarea
                                                        value={localSettings.officeAddress}
                                                        onChange={(e) => handleChange('officeAddress', e.target.value)}
                                                        rows={2}
                                                        className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm resize-none leading-relaxed"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="seo"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-12 relative z-10"
                        >
                            {/* Live SEO Preview Redesign */}
                            <div className="bg-navy-deep rounded-[2rem] p-10 text-white relative overflow-hidden shadow-xl">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2.5 mb-8">
                                        <div className="w-1 h-5 bg-amber-500 rounded-full" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Search Proxy Preview</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-8 max-w-2xl shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Building size={18} className="text-navy-deep" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] text-navy-deep font-black tracking-tight">gesit.co.id</span>
                                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Authorized Link</span>
                                            </div>
                                        </div>
                                        <h4 className="text-[#1a0dab] text-xl font-bold mb-2 cursor-pointer hover:underline underline-offset-4 tracking-tight">
                                            {localSettings.siteTitle || 'The Gesit Companies'}
                                        </h4>
                                        <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-2">
                                            {localSettings.siteDescription || 'Platform description pending configuration.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8 bg-slate-50 border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-navy-deep">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <h4 className="font-black text-navy-deep text-xs uppercase tracking-widest">Metadata Hub</h4>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="relative">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Meta Master Title</label>
                                            <input
                                                type="text"
                                                value={localSettings.siteTitle}
                                                onChange={(e) => handleChange('siteTitle', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm"
                                                placeholder="Corporate Identity Title..."
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Neural Keywords</label>
                                            <textarea
                                                value={localSettings.keywords}
                                                onChange={(e) => handleChange('keywords', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm min-h-[120px] resize-none leading-relaxed"
                                                placeholder="growth, excellence, precision..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 bg-slate-50 border border-slate-200 p-8 rounded-[2rem] shadow-sm flex flex-col">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-navy-deep">
                                            <Search size={18} />
                                        </div>
                                        <h4 className="font-black text-navy-deep text-xs uppercase tracking-widest">Description Forge</h4>
                                    </div>
                                    <div className="relative flex-grow flex flex-col">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Snippet Configuration</label>
                                        <textarea
                                            value={localSettings.siteDescription}
                                            onChange={(e) => handleChange('siteDescription', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm flex-grow min-h-[180px] leading-relaxed"
                                            placeholder="Write a high-performance snippet for search crawlers..."
                                        />
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-200">
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
                                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-14 pr-6 text-[11px] font-black text-navy-deep outline-none focus:border-navy-deep/20 transition-all shadow-sm"
                                                    placeholder="G-..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SettingsSection;
