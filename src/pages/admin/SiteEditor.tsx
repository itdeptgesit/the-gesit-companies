import { useState, useEffect } from "react";
import {
    Layout,
    Image as ImageIcon,
    Type,
    Award,
    Save,
    Plus,
    Trash2,
    Globe,
    History,
    Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import { supabase } from "../../lib/supabase";
import { ConfirmationModal } from "./SharedModals";

// --- Types ---

interface AuditLog {
    id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    section: string;
    details: string;
    created_at: string;
    performed_by: string; // User ID
}

// --- Helper Functions ---

const logActivity = async (action: 'CREATE' | 'UPDATE' | 'DELETE', section: string, details: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('audit_logs').insert({
            action,
            section,
            details,
            performed_by: user.id
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

const SiteEditor = () => {
    const [activeSubTab, setActiveSubTab] = useState("hero");
    const [showConfirm, setShowConfirm] = useState(false);

    const subTabs = [
        { id: "hero", label: "Hero Management", icon: <ImageIcon size={18} /> },
        { id: "home", label: "Home Components", icon: <Layout size={18} /> },
        { id: "about", label: "About Us Narrative", icon: <Type size={18} /> },
        { id: "values", label: "Core Values", icon: <Award size={18} /> },
        { id: "logs", label: "Activity Logs", icon: <History size={18} /> },
    ];

    return (
        <div className="space-y-8">
            {/* Header with Tooltip/Context */}
            <div className="bg-navy-deep rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Globe size={180} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
                            <Globe size={20} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Website Management System</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight leading-tight mb-4 text-white">
                        Global Site Editor
                    </h2>
                    <p className="text-white/60 text-sm font-medium leading-relaxed">
                        Manage your company's digital storefront. Update hero banners, business segments, mission statements, and core values in real-time across the platform.
                    </p>
                </div>
            </div>

            {/* Sub-Navigation */}
            <div className="flex flex-wrap gap-2">
                {subTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeSubTab === tab.id
                            ? "bg-navy-deep text-white shadow-xl shadow-navy-deep/20 translate-y-[-2px]"
                            : "bg-white text-slate-400 hover:text-navy-deep hover:bg-slate-50 border border-slate-100"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Editor Content Area */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSubTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeSubTab === 'hero' && <HeroManager />}
                        {activeSubTab === 'home' && <HomeConfigManager />}
                        {activeSubTab === 'about' && <AboutNarrativeManager />}
                        {activeSubTab === 'values' && <ValuesManager />}
                        {activeSubTab === 'logs' && <ActivityLogViewer />}
                    </motion.div>
                </AnimatePresence>
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => { }}
                title="Discard Changes?"
                message="You have unsaved modifications in the current editor. Are you sure you want to switch tabs?"
                confirmText="Yes, Discard"
                isDangerous
            />
        </div>
    );
};

// --- Sub-Components ---

const ActivityLogViewer = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50); // Limit to last 50 entries

        if (error) console.error("Error fetching logs:", error);
        else setLogs(data || []);
        setIsLoading(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'bg-green-100 text-green-700 border-green-200';
            case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-navy-deep tracking-tight">System Activity Logs</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Track recent changes and updates</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-500"
                    title="Refresh Logs"
                >
                    <History size={16} />
                </button>
            </div>

            <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-100">
                {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="ml-12 h-16 bg-slate-50 rounded-xl animate-pulse" />
                    ))
                ) : logs.length > 0 ? (
                    logs.map((log) => (
                        <div key={log.id} className="ml-12 relative group">
                            <div className={`absolute -left-[41px] top-4 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${getActionColor(log.action).split(' ')[0]}`}>
                                <Activity size={10} className={getActionColor(log.action).split(' ')[1]} />
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow group-hover:bg-white">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getActionColor(log.action)}`}>
                                            {log.action}
                                        </span>
                                        <span className="text-xs font-bold text-navy-deep">{log.section}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400">{formatDate(log.created_at)}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">{log.details}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="ml-12 p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-4">
                        <History size={24} className="opacity-20 text-navy-deep" />
                        <p className="text-xs font-medium">No activity recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const HeroManager = () => {
    const [slides, setSlides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingSlide, setEditingSlide] = useState<any>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) console.error("Error fetching slides:", error);
        else setSlides(data || []);
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);

        let oldImageUrl = null;
        if (editingSlide.id) {
            const { data } = await supabase
                .from('hero_slides')
                .select('image_url')
                .eq('id', editingSlide.id)
                .single();
            oldImageUrl = data?.image_url;
        }

        const slideData = {
            title: editingSlide.title,
            subtitle: editingSlide.subtitle,
            image_url: editingSlide.image_url,
            order_index: editingSlide.order_index || 0
        };

        let error;
        let action: 'CREATE' | 'UPDATE' = 'CREATE';

        if (editingSlide.id) {
            action = 'UPDATE';
            const { error: err } = await supabase
                .from('hero_slides')
                .update(slideData)
                .eq('id', editingSlide.id);
            error = err;
        } else {
            const { error: err } = await supabase
                .from('hero_slides')
                .insert([slideData]);
            error = err;
        }

        if (error) {
            alert("Error saving slide: " + error.message);
        } else {
            // Log Activity
            await logActivity(action, 'Hero Slides', `${action === 'CREATE' ? 'Created' : 'Updated'} slide: "${slideData.title}"`);

            if (oldImageUrl && oldImageUrl !== slideData.image_url) {
                const path = oldImageUrl.split('/news-images/')[1];
                if (path) {
                    await supabase.storage.from('news-images').remove([path]);
                }
            }

            setIsFormOpen(false);
            setEditingSlide(null);
            fetchSlides();
        }
        setIsSaving(false);
    };

    const handleDelete = async (slide: any) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm("Are you sure you want to delete this slide?")) return;

        if (slide.image_url) {
            const path = slide.image_url.split('/news-images/')[1];
            if (path) {
                const { error: storageError } = await supabase.storage.from('news-images').remove([path]);
                if (storageError) console.error("Error deleting image:", storageError);
            }
        }

        const { error } = await supabase.from('hero_slides').delete().eq('id', slide.id);
        if (error) {
            alert("Error deleting: " + error.message);
        } else {
            await logActivity('DELETE', 'Hero Slides', `Deleted slide: "${slide.title}"`);
            fetchSlides();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `hero/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('news-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('news-images')
                .getPublicUrl(filePath);

            setEditingSlide({ ...editingSlide, image_url: data.publicUrl });
        } catch (error: any) {
            alert("Upload failed: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditClick = (slide: any) => {
        setEditingSlide({ ...slide });
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-navy-deep tracking-tight">Main Homepage Slider</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Manage high-impact visual banners</p>
                </div>
                <button
                    onClick={() => { setEditingSlide({}); setIsFormOpen(true); }}
                    className="flex items-center gap-3 px-6 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                    <Plus size={16} /> Add New Slide
                </button>
            </div>

            {isFormOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-8 bg-slate-50 rounded-3xl border border-slate-200 space-y-6 overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Slide Title</label>
                                <input
                                    type="text"
                                    value={editingSlide?.title || ""}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all font-display font-bold text-navy-deep"
                                    placeholder="Enter headline..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Sub-header</label>
                                <textarea
                                    value={editingSlide?.subtitle || ""}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all h-24 resize-none font-medium text-slate-600"
                                    placeholder="Enter descriptive text..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Order Index</label>
                                <input
                                    type="number"
                                    value={editingSlide?.order_index || 0}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, order_index: parseInt(e.target.value) })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Banner Image</label>
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 group shadow-inner">
                                {editingSlide?.image_url ? (
                                    <img src={editingSlide.image_url} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-xs font-bold uppercase tracking-widest">No image selected</div>
                                )}
                                <label className="absolute inset-0 bg-navy-deep/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest gap-2 backdrop-blur-sm">
                                    <ImageIcon size={16} /> Change Image
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                            <p className="text-[10px] text-slate-400 italic font-medium text-center">Recommended: 1920x1080px (Landscape)</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                        <button
                            onClick={() => { setIsFormOpen(false); setEditingSlide(null); }}
                            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy-deep transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !editingSlide?.title || !editingSlide?.image_url}
                            className="flex items-center gap-3 px-8 py-3 bg-navy-deep text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#BA9B32] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-navy-deep/20"
                        >
                            {isSaving ? "Saving..." : <><Save size={16} /> Save Slide</>}
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    Array(2).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-slate-50 rounded-[2rem] animate-pulse border border-slate-100" />
                    ))
                ) : slides.length > 0 ? (
                    slides.map((slide) => (
                        <div key={slide.id} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 relative">
                            <div className="relative aspect-video overflow-hidden">
                                <img src={slide.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" alt={slide.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent opacity-80" />

                                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => handleEditClick(slide)}
                                        className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-navy-deep transition-all active:scale-90 border border-white/20"
                                    >
                                        <Type size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide)}
                                        className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-red-500 transition-all active:scale-90 border border-white/20"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h4 className="text-white font-display text-lg leading-tight mb-1 line-clamp-1">{slide.title}</h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Order: {slide.order_index}</p>
                                        <div className="w-6 h-[1px] bg-white/30 group-hover:w-12 transition-all duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="md:col-span-2 p-16 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 gap-6 bg-slate-50/50">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                            <ImageIcon size={32} className="opacity-20 text-navy-deep" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Database Empty</p>
                            <p className="text-xs text-slate-400 font-medium">No hero slides found. Add your first banner to get started.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const HomeConfigManager = () => {
    const [segments, setSegments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingSegment, setEditingSegment] = useState<any>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        fetchSegments();
    }, []);

    const fetchSegments = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('business_segments')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) console.error("Error fetching segments:", error);
        else setSegments(data || []);
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);

        if (!editingSegment?.id) {
            console.error("No ID found for segment:", editingSegment);
            alert("Error: Cannot update. Segment ID is missing.");
            setIsSaving(false);
            return;
        }

        const segmentData = {
            title: editingSegment.title,
            description: editingSegment.description,
            image_url: editingSegment.image_url,
            href: editingSegment.href || '#',
            order_index: editingSegment.order_index || 0
        };

        const { error } = await supabase
            .from('business_segments')
            .update(segmentData)
            .eq('id', editingSegment.id);

        if (error) {
            alert("Error saving segment: " + error.message);
        } else {
            // Log Activity
            await logActivity('UPDATE', 'Home Segments', `Updated segment: "${segmentData.title}"`);
            setIsFormOpen(false);
            setEditingSegment(null);
            fetchSegments();
        }
        setIsSaving(false);
    };

    const handleInitialize = async () => {
        setIsSaving(true);
        const defaultSegments = [
            {
                title: "Property",
                description: "Creating value-adding and sustainable assets to our communities and partnering with leading multinational corporations.",
                href: "/property",
                order_index: 0,
                image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Trading & Services",
                description: "Leveraging local Indonesian expertise and broad international network to source and deliver high-quality products.",
                href: "/trading",
                order_index: 1,
                image_url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Manufacturing",
                description: "Serving important industrial sectors, delivering high-quality products, and establishing strong long-term partnership.",
                href: "/manufacturing",
                order_index: 2,
                image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Natural Resources",
                description: "Developing Indonesia's vast natural resources and continually expanding to other types of minerals and resources.",
                href: "/mining",
                order_index: 3,
                image_url: "https://images.unsplash.com/photo-1518558997970-4ddc236affcd?q=80&w=2070&auto=format&fit=crop"
            }
        ];

        const { error } = await supabase
            .from('business_segments')
            .insert(defaultSegments);

        if (error) {
            alert("Error initializing segments: " + error.message);
        } else {
            await logActivity('CREATE', 'Home Segments', `Initialized ${defaultSegments.length} default business segments`);
            fetchSegments();
        }
        setIsSaving(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `segment_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `home/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('news-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('news-images')
                .getPublicUrl(filePath);

            setEditingSegment({ ...editingSegment, image_url: data.publicUrl });
        } catch (error: any) {
            alert("Upload failed: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditClick = (segment: any) => {
        if (!segment?.id) {
            console.error("Critical Error: Segment has no ID", segment);
            alert("Error: This segment is missing an ID and cannot be edited. Please refresh the page.");
            return;
        }
        setEditingSegment({ ...segment });
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-navy-deep tracking-tight">Business Segments</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Manage homepage business units descriptions</p>
                </div>
            </div>

            {isFormOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-8 bg-slate-50 rounded-3xl border border-slate-200 space-y-6 overflow-hidden"
                >
                    <div className="text-[10px] text-slate-300 font-mono mb-[-10px]">ID: {editingSegment?.id || 'MISSING'}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Segment Title</label>
                                <input
                                    type="text"
                                    value={editingSegment?.title || ""}
                                    onChange={(e) => setEditingSegment({ ...editingSegment, title: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all font-bold text-navy-deep"
                                    placeholder="e.g. Property"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Description</label>
                                <textarea
                                    value={editingSegment?.description || ""}
                                    onChange={(e) => setEditingSegment({ ...editingSegment, description: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all h-24 resize-none font-medium text-slate-600"
                                    placeholder="Brief description..."
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Link Path</label>
                                    <input
                                        type="text"
                                        value={editingSegment?.href || ""}
                                        onChange={(e) => setEditingSegment({ ...editingSegment, href: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
                                        placeholder="/property"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Order</label>
                                    <input
                                        type="number"
                                        value={editingSegment?.order_index || 0}
                                        onChange={(e) => setEditingSegment({ ...editingSegment, order_index: parseInt(e.target.value) })}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 mt-4">Segment Image</label>
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 group shadow-inner">
                                {editingSegment?.image_url ? (
                                    <img src={editingSegment.image_url} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-xs font-bold uppercase tracking-widest">No image selected</div>
                                )}
                                <label className="absolute inset-0 bg-navy-deep/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest gap-2 backdrop-blur-sm">
                                    <ImageIcon size={16} /> Change Image
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                        <button
                            onClick={() => { setIsFormOpen(false); setEditingSegment(null); }}
                            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy-deep transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !editingSegment?.title}
                            className="flex items-center gap-3 px-8 py-3 bg-navy-deep text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#BA9B32] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-navy-deep/20"
                        >
                            {isSaving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-80 bg-slate-50 rounded-[2rem] animate-pulse border border-slate-100" />
                    ))
                ) : segments.length > 0 ? (
                    segments.map((segment) => (
                        <div key={segment.id} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 relative flex flex-col">
                            <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                                <img src={segment.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" alt={segment.title} />
                                <div className="absolute inset-0 bg-navy-deep/10 group-hover:bg-transparent transition-colors" />

                                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => handleEditClick(segment)}
                                        className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-navy-deep transition-all active:scale-90 border border-white/20"
                                    >
                                        <Type size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h4 className="text-navy-deep font-bold text-lg mb-2">{segment.title}</h4>
                                <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3 flex-1">{segment.description}</p>
                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">#{segment.order_index}</span>
                                    <span className="text-[9px] font-bold text-amber-500">{segment.href}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full p-16 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 gap-6 bg-slate-50/50">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                            <Layout size={32} className="opacity-20 text-navy-deep" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-1">No Segments Found</p>
                            <p className="text-xs text-slate-400 font-medium mb-4">Please contact administrator to initialize business segments.</p>
                            <button
                                onClick={handleInitialize}
                                className="px-6 py-2 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-navy-deep hover:text-white transition-all transform hover:scale-105 active:scale-95"
                            >
                                Initialize Defaults
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AboutNarrativeManager = () => {
    const [content, setContent] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('page_content')
            .select('*')
            .eq('page', 'about')
            .order('section', { ascending: true });

        if (error) console.error("Error fetching content:", error);
        else setContent(data || []);
        setIsLoading(false);
    };

    const handleUpdate = async (id: string, value: string, key: string) => {
        setIsSaving(true);
        const { error } = await supabase
            .from('page_content')
            .update({ value })
            .eq('id', id);

        if (error) {
            alert("Save failed: " + error.message);
        } else {
            await logActivity('UPDATE', 'About Narrative', `Updated content for: "${key}"`);
        }
        setIsSaving(false);
    };

    const handleValueChange = (id: string, newValue: string) => {
        setContent(prev => prev.map(item => item.id === id ? { ...item, value: newValue } : item));
    };

    const handleInitialize = async () => {
        setIsSaving(true);
        const defaultContent = [
            {
                page: 'about',
                section: '1. Introduction',
                key: 'intro_description',
                value: 'Founded in the 1950s as a small private trading company, Gesit has grown to become a business leader in the fields of Property, Trading & Service, Manufacturing, and Natural Resources.'
            },
            {
                page: 'about',
                section: '2. Philosophy',
                key: 'philosophy_heading',
                value: '艺成'
            },
            {
                page: 'about',
                section: '2. Philosophy',
                key: 'philosophy_meaning',
                value: 'Based on the Mandarin “yi cheng” and Hokkien “geseng”, which means “perfection for art”'
            },
            {
                page: 'about',
                section: '2. Philosophy',
                key: 'philosophy_subheading',
                value: 'Gesit is a name chosen to represent our vision for strategic resourcefulness and passionate energy in our business endeavors.'
            },
            {
                page: 'about',
                section: '2. Philosophy',
                key: 'philosophy_description',
                value: 'Over the years, the Gesit Companies continue to capture opportunities to grow its business portfolio amidst changes in economy and increased competition – part of this by being resourceful, agile and competitive.\n\nOur businesses are managed and operated by a team of professionals, headquartered in Jakarta.\n\nAs the Gesit Companies continue to grow, we also believe in investing in our human capital and other areas to build competitive advantages.'
            },
            {
                page: 'about',
                section: '2. Philosophy',
                key: 'philosophy_closing',
                value: 'We are committed to Indonesia.'
            },
            {
                page: 'about',
                section: '3. Vision & Mission',
                key: 'vision_statement',
                value: 'To be a Group of Companies that are Recognized by Stakeholders as Strategic First Choice Business Partner'
            },
            {
                page: 'about',
                section: '3. Vision & Mission',
                key: 'mission_statement',
                value: 'To Establish Resourceful Business Entities that Deliver Sustainable Value to Stakeholders'
            }
        ];

        const { error } = await supabase
            .from('page_content')
            .insert(defaultContent);

        if (error) {
            alert("Error initializing content: " + error.message);
        } else {
            await logActivity('CREATE', 'About Narrative', `Initialized ${defaultContent.length} default narrative sections`);
            fetchContent();
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-navy-deep tracking-tight">About Us Narrative</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Edit company story, vision, and mission</p>
                </div>
                {isSaving && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">Syncing...</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-[2rem] border border-slate-100" />
                    ))
                ) : content.length > 0 ? (
                    content.map((item) => (
                        <div key={item.id} className="group bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 hover:border-amber-200 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />

                            <div className="relative flex flex-col md:flex-row md:items-start gap-8">
                                <div className="md:w-1/4 shrink-0">
                                    <span className="text-[9px] font-black uppercase tracking-[.3em] text-amber-500 mb-2 block">{item.section}</span>
                                    <h4 className="text-navy-deep font-display text-lg mb-2 capitalize">{item.key.replace(/_/g, ' ')}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase tracking-widest text-slate-400">
                                            {item.key.includes('heading') || item.key.includes('closing') || item.key.includes('meaning') ? 'Short Text' : 'Long Text'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    {item.key.includes('heading') || item.key.includes('closing') || item.key.includes('meaning') ? (
                                        <input
                                            type="text"
                                            value={item.value}
                                            onChange={(e) => handleValueChange(item.id, e.target.value)}
                                            onBlur={(e) => handleUpdate(item.id, e.target.value, item.key)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 text-sm font-medium focus:border-amber-500 outline-none transition-all shadow-inner placeholder:text-slate-300"
                                            placeholder={`Enter ${item.key.replace(/_/g, ' ')}...`}
                                        />
                                    ) : (
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleValueChange(item.id, e.target.value)}
                                            onBlur={(e) => handleUpdate(item.id, e.target.value, item.key)}
                                            className="w-full bg-white border border-slate-200 rounded-[1.5rem] px-6 py-4 text-sm leading-relaxed focus:border-amber-500 outline-none transition-all shadow-inner min-h-[140px] resize-none"
                                            placeholder={`Enter ${item.key.replace(/_/g, ' ')}...`}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-16 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 gap-6 bg-slate-50/50">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                            <Type size={32} className="opacity-20 text-navy-deep" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-1">No Content Found</p>
                            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto mb-4">This page has no editable text blocks yet. Please initialize the database with default content.</p>
                            <button
                                onClick={handleInitialize}
                                className="px-6 py-2 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-navy-deep hover:text-white transition-all transform hover:scale-105 active:scale-95"
                            >
                                Initialize Defaults
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ValuesManager = () => {
    const [values, setValues] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingValue, setEditingValue] = useState<any>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        fetchValues();
    }, []);

    const fetchValues = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('core_values')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) console.error("Error fetching values:", error);
        else setValues(data || []);
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);

        let oldImageUrl = null;
        if (editingValue.id) {
            const { data } = await supabase
                .from('core_values')
                .select('image_url')
                .eq('id', editingValue.id)
                .single();
            oldImageUrl = data?.image_url;
        }

        const valueData = {
            title: editingValue.title,
            description: editingValue.description,
            image_url: editingValue.image_url,
            order_index: editingValue.order_index || 0
        };

        let error;
        let action: 'CREATE' | 'UPDATE' = 'CREATE';

        if (editingValue.id) {
            action = 'UPDATE';
            const { error: err } = await supabase
                .from('core_values')
                .update(valueData)
                .eq('id', editingValue.id);
            error = err;
        } else {
            const { error: err } = await supabase
                .from('core_values')
                .insert([valueData]);
            error = err;
        }

        if (error) {
            alert("Error saving value: " + error.message);
        } else {
            // Log Activity
            await logActivity(action, 'Core Values', `${action === 'CREATE' ? 'Created' : 'Updated'} value: "${valueData.title}"`);

            // Cleanup old image
            if (oldImageUrl && oldImageUrl !== valueData.image_url) {
                const path = oldImageUrl.split('/news-images/')[1];
                if (path) {
                    await supabase.storage.from('news-images').remove([path]);
                }
            }

            setIsFormOpen(false);
            setEditingValue(null);
            fetchValues();
        }
        setIsSaving(false);
    };

    const handleDelete = async (val: any) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm("Are you sure you want to delete this value?")) return;

        if (val.image_url) {
            const path = val.image_url.split('/news-images/')[1];
            if (path) {
                const { error: storageError } = await supabase.storage.from('news-images').remove([path]);
                if (storageError) console.error("Error deleting image:", storageError);
            }
        }

        const { error } = await supabase.from('core_values').delete().eq('id', val.id);
        if (error) {
            alert("Error deleting: " + error.message);
        } else {
            await logActivity('DELETE', 'Core Values', `Deleted value: "${val.title}"`);
            fetchValues();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `value_icon_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `about/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('news-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('news-images')
                .getPublicUrl(filePath);

            setEditingValue({ ...editingValue, image_url: data.publicUrl });
        } catch (error: any) {
            alert("Upload failed: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditClick = (val: any) => {
        setEditingValue({ ...val });
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-navy-deep tracking-tight">Corporate Core Values</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Manage the value grid on About Us page</p>
                </div>
                <button
                    onClick={() => { setEditingValue({}); setIsFormOpen(true); }}
                    className="flex items-center gap-3 px-6 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                    <Plus size={16} /> Add Value
                </button>
            </div>

            {isFormOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-8 bg-slate-50 rounded-3xl border border-slate-200 space-y-6 overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Value Title</label>
                                <input
                                    type="text"
                                    value={editingValue?.title || ""}
                                    onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all font-bold text-navy-deep"
                                    placeholder="e.g. Integrity"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Description</label>
                                <textarea
                                    value={editingValue?.description || ""}
                                    onChange={(e) => setEditingValue({ ...editingValue, description: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all h-24 resize-none font-medium text-slate-600"
                                    placeholder="Brief explanation..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Order</label>
                                <input
                                    type="number"
                                    value={editingValue?.order_index || 0}
                                    onChange={(e) => setEditingValue({ ...editingValue, order_index: parseInt(e.target.value) })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Icon / Image</label>
                            <div className="relative aspect-square w-32 mx-auto rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 group shadow-inner">
                                {editingValue?.image_url ? (
                                    <img src={editingValue.image_url} className="w-full h-full object-cover p-4" alt="Preview" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-xs font-bold uppercase tracking-widest">No Icon</div>
                                )}
                                <label className="absolute inset-0 bg-navy-deep/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest gap-2 backdrop-blur-sm text-center px-2">
                                    <ImageIcon size={16} /> Upload
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                            <p className="text-[10px] text-slate-400 italic font-medium text-center">Recommended: SVG or PNG Icon</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                        <button
                            onClick={() => { setIsFormOpen(false); setEditingValue(null); }}
                            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy-deep transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !editingValue?.title}
                            className="flex items-center gap-3 px-8 py-3 bg-navy-deep text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#BA9B32] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-navy-deep/20"
                        >
                            {isSaving ? "Saving..." : <><Save size={16} /> Save Value</>}
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-slate-50 rounded-[2rem] animate-pulse border border-slate-100" />
                    ))
                ) : values.length > 0 ? (
                    values.map((val) => (
                        <div key={val.id} className="group bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 relative flex flex-col items-center text-center">

                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                    onClick={() => handleEditClick(val)}
                                    className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-navy-deep hover:text-white transition-all active:scale-90"
                                >
                                    <Type size={12} />
                                </button>
                                <button
                                    onClick={() => handleDelete(val)}
                                    className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 p-3 group-hover:scale-110 transition-transform duration-500">
                                <img src={val.image_url} className="w-full h-full object-contain opacity-80 group-hover:opacity-100" alt={val.title} />
                            </div>

                            <h4 className="text-navy-deep font-bold text-lg mb-2">{val.title}</h4>
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{val.description}</p>

                            <div className="mt-6 pt-4 border-t border-slate-50 w-full">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">#{val.order_index}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full p-16 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 gap-6 bg-slate-50/50">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                            <Award size={32} className="opacity-20 text-navy-deep" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-1">No Values Found</p>
                            <p className="text-xs text-slate-400 font-medium">Add core values to display on the About page.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SiteEditor;
