import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Save, Share2, Search, Building, Phone, Image, CheckCircle2 } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

const SettingsSection = () => {
    const { settings, loading, updateSetting, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'seo'>('general');

    const handleChange = (key: keyof typeof settings, value: string) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Only save changes
        const changes: any = {};
        (Object.keys(localSettings) as Array<keyof typeof settings>).forEach(key => {
            if (localSettings[key] !== settings[key]) {
                changes[key] = localSettings[key];
            }
        });

        if (Object.keys(changes).length > 0) {
            await updateSettings(changes);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000); // Auto hide after 3s
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-8 relative">
            {/* Success Popup */}
            <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{
                    opacity: showSuccessModal ? 1 : 0,
                    y: showSuccessModal ? 0 : -20,
                    x: '-50%'
                }}
                className={`fixed top-10 left-1/2 z-50 bg-white border border-green-100 shadow-2xl rounded-full px-8 py-4 flex items-center gap-4 pointer-events-none transition-all duration-300 ${!showSuccessModal && 'hidden'}`}
            >
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={16} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-navy-deep">Changes Saved Successfully</h4>
                    <p className="text-[10px] text-slate-400">Your site settings have been updated.</p>
                </div>
            </motion.div>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-display font-bold text-navy-deep">Site Configuration</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage global settings, SEO, and contact information.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving || loading}
                    className="flex items-center gap-2 px-6 py-3 bg-navy-deep text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#BA9B32] transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'general' ? 'border-[#BA9B32] text-[#BA9B32]' : 'border-transparent text-slate-400 hover:text-navy-deep'}`}
                >
                    General
                </button>
                <button
                    onClick={() => setActiveTab('seo')}
                    className={`px-6 py-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'seo' ? 'border-[#BA9B32] text-[#BA9B32]' : 'border-transparent text-slate-400 hover:text-navy-deep'}`}
                >
                    SEO & Meta
                </button>
            </div>

            {activeTab === 'general' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Maintenance Mode Card */}
                    <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${settings.maintenanceMode ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-navy-deep">Maintenance Mode</h4>
                                    <p className="text-xs text-slate-500 mt-1 max-w-md">Currently {settings.maintenanceMode ? 'ENABLED' : 'DISABLED'}. When active, public access is restricted.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => updateSetting('maintenanceMode', !settings.maintenanceMode)}
                                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Branding */}
                        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Image size={20} className="text-[#BA9B32]" />
                                <h4 className="font-display font-bold text-navy-deep">Branding Assets</h4>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Logo URL</label>
                                    <input
                                        type="text"
                                        value={localSettings.logoUrl}
                                        onChange={(e) => handleChange('logoUrl', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors"
                                        placeholder="/logo-gesit.png"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Favicon URL</label>
                                    <input
                                        type="text"
                                        value={localSettings.faviconUrl}
                                        onChange={(e) => handleChange('faviconUrl', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors"
                                        placeholder="/favicon.ico"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Building size={20} className="text-[#BA9B32]" />
                                <h4 className="font-display font-bold text-navy-deep">Office Information</h4>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Office Address</label>
                                    <textarea
                                        value={localSettings.officeAddress}
                                        onChange={(e) => handleChange('officeAddress', e.target.value)}
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors resize-none"
                                        placeholder="Full corporate address..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={localSettings.phoneNumber}
                                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 pl-10 text-sm focus:border-[#BA9B32] outline-none transition-colors"
                                            placeholder="+62 ..."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 opacity-0" />
                                            <Share2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 opacity-0" />
                                            {/* Using a generic icon or reusing one if needed, but for now just input */}
                                            <input
                                                type="email"
                                                value={localSettings.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors"
                                                placeholder="contact@gesit.co.id"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Google Maps Link</label>
                                        <input
                                            type="text"
                                            value={localSettings.googleMapsUrl}
                                            onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors"
                                            placeholder="https://maps.app.goo.gl/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm space-y-6 md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <Share2 size={20} className="text-[#BA9B32]" />
                                <h4 className="font-display font-bold text-navy-deep">Social Media Links</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['Facebook', 'Instagram', 'Linkedin'].map((social) => (
                                    <div key={social}>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{social}</label>
                                        <input
                                            type="text"
                                            // @ts-ignore
                                            value={localSettings[`social${social}`]}
                                            // @ts-ignore
                                            onChange={(e) => handleChange(`social${social}`, e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors"
                                            placeholder={`https://${social.toLowerCase()}.com/...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'seo' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                            <Search size={24} className="text-[#BA9B32]" />
                            <div>
                                <h4 className="text-lg font-bold text-navy-deep">SEO Configuration</h4>
                                <p className="text-xs text-slate-500">Optimize site visibility for search engines.</p>
                            </div>
                        </div>

                        <div className="space-y-6 max-w-3xl">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Meta Title</label>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={localSettings.siteTitle}
                                            onChange={(e) => handleChange('siteTitle', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors"
                                            placeholder="The Gesit Companies"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-2">Recommended length: 50-60 characters</p>
                                    </div>
                                    <div className="w-1/3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs font-bold text-[#1a0dab] hover:underline cursor-pointer truncate">{localSettings.siteTitle || "Site Title"}</p>
                                        <p className="text-[10px] text-[#006621] truncate">https://gesit.co.id</p>
                                        <p className="text-[10px] text-slate-600 line-clamp-2">{localSettings.siteDescription || "Site description..."}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Meta Description</label>
                                <textarea
                                    value={localSettings.siteDescription}
                                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors resize-none"
                                    placeholder="Brief description of the website..."
                                />
                                <p className="text-[10px] text-slate-400 mt-2">Recommended length: 150-160 characters</p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Keywords</label>
                                <input
                                    type="text"
                                    value={localSettings.keywords}
                                    onChange={(e) => handleChange('keywords', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors"
                                    placeholder="business, investment, indonesia..."
                                />
                                <p className="text-[10px] text-slate-400 mt-2">Separate keywords with commas</p>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Google Analytics Measurement ID</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={localSettings.googleAnalyticsId}
                                        onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:border-[#BA9B32] outline-none transition-colors"
                                        placeholder="G-XXXXXXXXXX"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 pl-14">Enter your Measurement ID starting with "G-". This will enable tracking across the site.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SettingsSection;
