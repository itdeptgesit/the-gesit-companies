import { useState, useEffect } from "react";
import {
    Layout,
    Image as ImageIcon,
    History,
    Activity,
    Globe,
    Save,
    Plus,
    Trash2,
    Briefcase,
    Type,
    FileText,
    X,
    AlertCircle
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

        const { error } = await supabase.from('audit_logs').insert({
            action,
            section,
            details,
            performed_by: user.id
        });

        if (error) {
            console.error("Failed to log activity:", error);
            alert("Warning: Activity Log failed to record. " + error.message);
        }
    } catch (error: any) {
        console.error("Failed to log activity:", error);
        alert("Warning: Activity Log failed. " + error.message);
    }
};

const SiteEditor = () => {
    const [activeSubTab, setActiveSubTab] = useState("hero");
    const [showConfirm, setShowConfirm] = useState(false);

    const subTabs = [
        { id: "hero", label: "Banners", icon: <ImageIcon size={18} /> },
        { id: "home", label: "Page Content", icon: <Layout size={18} /> },
        { id: "business", label: "Business Units", icon: <Briefcase size={18} /> },
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
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Global Settings</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight leading-tight mb-4 text-white">
                        Site Content Editor
                    </h2>
                    <p className="text-white/60 text-sm font-medium leading-relaxed">
                        Manage your company's digital storefront. Update hero banners, business segments, and mission statements in real-time across the platform.
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
                        {activeSubTab === 'business' && <BusinessManager />}
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsLoading(true);
        setError(null);
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50); // Limit to last 50 entries

        if (error) {
            console.error("Error fetching logs:", error);
            setError(error.message);
        } else {
            setLogs(data || []);
        }
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
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Track recent updates and modifications</p>
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
                ) : error ? (
                    <div className="ml-12 p-8 border-2 border-red-100 bg-red-50 rounded-2xl flex flex-col items-center justify-center text-red-400 gap-4">
                        <AlertCircle size={24} />
                        <p className="text-xs font-medium">Failed to load logs: {error}</p>
                    </div>
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
                    <h3 className="text-xl font-black text-navy-deep tracking-tight">Homepage Banners</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Manage visual banners for the landing page</p>
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
                            className="flex items-center gap-3 px-8 py-3 bg-navy-deep text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#BC9C33] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-navy-deep/20"
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
                    <h3 className="text-xl font-black text-navy-deep tracking-tight">Business Units</h3>
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
                            className="flex items-center gap-3 px-8 py-3 bg-navy-deep text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#BC9C33] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-navy-deep/20"
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





const BusinessManager = () => {
    const [selectedPage, setSelectedPage] = useState<'property' | 'trading' | 'manufacturing' | 'natural_resources'>('property');
    const [pageData, setPageData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load data when page selection changes
    useEffect(() => {
        fetchPageData(selectedPage);
    }, [selectedPage]);

    const fetchPageData = async (page: string) => {
        setIsLoading(true);
        const key = `${page}_page`; // e.g. property_page
        const { data } = await supabase.from('page_content').select('*').eq('page', 'business').eq('key', key).single();

        if (data && data.value) {
            try {
                setPageData(JSON.parse(data.value));
            } catch (e) {
                console.error("Error parsing page data", e);
                setPageData({});
            }
        } else {
            setPageData({}); // Reset or set defaults
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const key = `${selectedPage}_page`;

        const { error } = await supabase.from('page_content').upsert({
            page: 'business',
            key: key,
            value: JSON.stringify(pageData),
            section: 'Content'
        }, { onConflict: 'page,key' });

        if (error) {
            alert("Error saving: " + error.message);
        } else {
            await logActivity('UPDATE', 'Business Page', `Updated ${selectedPage} page content`);
            alert("Page saved successfully!");
        }
        setIsSaving(false);
    };

    const handleImageUpload = async (keyPath: string, file: File, append = false) => {
        try {
            setIsSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${selectedPage}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('news-images').upload(`business/${fileName}`, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('news-images').getPublicUrl(`business/${fileName}`);

            // Deep update state based on dot notation keyPath (e.g. "hero.image")
            setPageData((prev: any) => {
                const newData = { ...prev };
                const keys = keyPath.split('.');
                let current = newData;
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) current[keys[i]] = {};
                    current = current[keys[i]];
                }

                if (append) {
                    const existing = current[keys[keys.length - 1]] || [];
                    current[keys[keys.length - 1]] = [...existing, data.publicUrl];
                } else {
                    current[keys[keys.length - 1]] = data.publicUrl;
                }
                return newData;
            });

        } catch (error: any) {
            alert("Upload failed: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (keyPath: string, value: any) => {
        setPageData((prev: any) => {
            const newData = { ...prev };
            const keys = keyPath.split('.');
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    // --- Sub-components for Form Fields ---

    const SectionHeader = ({ title }: { title: string }) => (
        <div className="flex items-center gap-4 py-4 border-b border-slate-100 mb-6">
            <div className="p-2 bg-navy-deep/5 rounded-lg text-navy-deep"><FileText size={16} /></div>
            <h4 className="text-navy-deep font-bold text-sm uppercase tracking-wider">{title}</h4>
        </div>
    );

    const TextField = ({ label, path, multiline = false, placeholder }: any) => {
        const keys = path.split('.');
        const value = keys.reduce((acc: any, k: string) => acc?.[k], pageData) || "";

        return (
            <div className="mb-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">{label}</label>
                {multiline ? (
                    <textarea
                        value={value}
                        onChange={(e) => updateField(path, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all h-24 resize-none font-medium text-slate-600"
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => updateField(path, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all font-bold text-navy-deep"
                        placeholder={placeholder}
                    />
                )}
            </div>
        );
    };

    const MultiImagePicker = ({ label, path }: any) => {
        const keys = path.split('.');
        const value = keys.reduce((acc: any, k: string) => acc?.[k], pageData) || [];

        return (
            <div className="mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">{label}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.isArray(value) && value.map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group border border-slate-200">
                            <img src={img} className="w-full h-full object-cover" alt={`Img ${idx}`} />
                            <button
                                onClick={() => {
                                    const newImages = value.filter((_: any, i: number) => i !== idx);
                                    updateField(path, newImages);
                                }}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-navy-deep/50 hover:bg-navy-deep/5 transition-all flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-navy-deep gap-2">
                        <Plus size={24} className="opacity-50" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Add Image</span>
                        <input type="file" className="hidden" multiple onChange={(e) => {
                            if (e.target.files) {
                                Array.from(e.target.files).forEach(file => handleImageUpload(path, file, true));
                            }
                        }} accept="image/*" />
                    </label>
                </div>
            </div>
        );
    };

    const ProjectsEditor = ({ projects, onChange }: any) => {
        const [editingIndex, setEditingIndex] = useState<number | null>(null);
        const [isUploading, setIsUploading] = useState(false);

        const handleAdd = () => {
            const newProject = {
                title: "New Project",
                subtitle: "Project Subtitle",
                location: "Jakarta, Indonesia",
                propertyType: "Office",
                desc: "",
                points: [],
                images: [],
                reverse: false
            };
            onChange([...projects, newProject]);
            setEditingIndex(projects.length);
        };

        const handleUpdate = (index: number, field: string, value: any) => {
            const newProjects = [...projects];
            newProjects[index] = { ...newProjects[index], [field]: value };
            onChange(newProjects);
        };

        const handleDelete = (index: number) => {
            if (confirm("Delete this project?")) {
                onChange(projects.filter((_: any, i: number) => i !== index));
                setEditingIndex(null);
            }
        };

        const handleProjectUpload = async (e: any) => {
            if (!e.target.files || e.target.files.length === 0 || editingIndex === null) return;

            setIsUploading(true);
            try {
                const files = Array.from(e.target.files) as File[];
                const newContent: string[] = [];

                for (const file of files) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `project_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage.from('news-images').upload(`projects/${fileName}`, file);
                    if (uploadError) throw uploadError;

                    const { data } = supabase.storage.from('news-images').getPublicUrl(`projects/${fileName}`);
                    newContent.push(data.publicUrl);
                }

                const currentImages = projects[editingIndex].images || [];
                handleUpdate(editingIndex, 'images', [...currentImages, ...newContent]);

            } catch (error: any) {
                alert("Upload failed: " + error.message);
            } finally {
                setIsUploading(false);
            }
        };

        return (
            <div className="space-y-6">
                {editingIndex !== null ? (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                            <h5 className="font-bold text-navy-deep">Editing Project</h5>
                            <button onClick={() => setEditingIndex(null)} className="text-xs font-bold uppercase text-slate-400 hover:text-navy-deep">Done</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Title</label>
                                    <input value={projects[editingIndex].title} onChange={(e) => handleUpdate(editingIndex, 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-navy-deep" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Subtitle</label>
                                    <input value={projects[editingIndex].subtitle} onChange={(e) => handleUpdate(editingIndex, 'subtitle', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Location</label>
                                    <input value={projects[editingIndex].location} onChange={(e) => handleUpdate(editingIndex, 'location', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Property Type</label>
                                    <input value={projects[editingIndex].propertyType} onChange={(e) => handleUpdate(editingIndex, 'propertyType', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Description</label>
                                    <textarea value={projects[editingIndex].desc} onChange={(e) => handleUpdate(editingIndex, 'desc', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm h-32 resize-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Key Features (One per line)</label>
                                    <textarea
                                        value={Array.isArray(projects[editingIndex].points) ? projects[editingIndex].points.join('\n') : projects[editingIndex].points}
                                        onChange={(e) => handleUpdate(editingIndex, 'points', e.target.value.split('\n'))}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm h-24 resize-none"
                                        placeholder="50 Floors High-Rise&#10;140,000m² Area"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Project Images (Slideshow)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {projects[editingIndex].images?.map((img: string, i: number) => (
                                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 group border border-slate-200">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                const newImgs = projects[editingIndex].images.filter((_: any, idx: number) => idx !== i);
                                                handleUpdate(editingIndex, 'images', newImgs);
                                            }}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                <label className={`aspect-video rounded-xl border-2 border-dashed border-slate-200 hover:border-navy-deep/50 hover:bg-navy-deep/5 transition-all flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-navy-deep gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isUploading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy-deep"></div> : <Plus size={20} className="opacity-50" />}
                                    <span className="text-[9px] font-black uppercase tracking-widest">{isUploading ? 'Uploading...' : 'Add'}</span>
                                    <input type="file" className="hidden" multiple onChange={handleProjectUpload} accept="image/*" disabled={isUploading} />
                                </label>
                            </div>
                            <p className="text-[10px] text-slate-400 italic">Images are uploaded immediately.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {projects.map((proj: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                    {proj.images?.[0] && <img src={proj.images[0]} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-navy-deep text-sm">{proj.title}</h5>
                                    <p className="text-xs text-slate-500">{proj.subtitle}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingIndex(idx)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-navy-deep">
                                        <Type size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(idx)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button onClick={handleAdd} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs hover:border-navy-deep/20 hover:text-navy-deep hover:bg-navy-deep/5 transition-all">
                            <Plus size={16} className="mr-2" /> Add Project
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const ImagePicker = ({ label, path }: any) => {
        const keys = path.split('.');
        const value = keys.reduce((acc: any, k: string) => acc?.[k], pageData);

        return (
            <div className="mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">{label}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 group shadow-inner">
                        {value ? <img src={value} className="w-full h-full object-cover" alt="Preview" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-xs font-bold uppercase tracking-widest">No Image</div>}
                        <label className="absolute inset-0 bg-navy-deep/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest gap-2 backdrop-blur-sm px-4 text-center">
                            <ImageIcon size={16} /> Upload <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(path, e.target.files[0])} accept="image/*" />
                        </label>
                    </div>
                </div>
            </div>
        );
    };

    // --- Page Specific Editors ---

    const renderEditor = () => {
        if (isLoading) return <div className="p-12 text-center text-slate-400 animate-pulse">Loading editor...</div>;

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Global Hero for all pages */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <SectionHeader title="Top Banner" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <TextField label="Hero Title" path="hero.title" placeholder={`e.g. ${selectedPage === 'property' ? 'Property' : selectedPage}`} />
                            <TextField label="Hero Subtitle / Description" path="hero.description" multiline placeholder="Short description..." />
                        </div>
                        <div>
                            <MultiImagePicker label="Hero Slideshow Images" path="hero.images" />
                        </div>
                    </div>
                </div>

                {/* Global Intro for all pages */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <SectionHeader title="Introduction Section" />
                    <TextField label="Intro Heading" path="intro.heading" placeholder="Big bold heading..." />
                    <TextField label="Intro Description" path="intro.description" multiline placeholder="Detailed introduction text..." />
                </div>

                {/* Page Specific Content */}
                {selectedPage === 'property' && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <SectionHeader title="Projects List" />
                        <ProjectsEditor projects={pageData.projects || []} onChange={(newProjects: any) => updateField('projects', newProjects)} />
                    </div>
                )}

                {selectedPage === 'trading' && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <SectionHeader title="Service Sections" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h5 className="font-bold text-navy-deep border-b border-slate-100 pb-2">Trading</h5>
                                <TextField label="Heading" path="trading.heading" placeholder="Trading" />
                                <TextField label="Description" path="trading.description" multiline placeholder="Description..." />
                                <ImagePicker label="Image 1" path="trading.image1" />
                            </div>
                            <div className="space-y-6">
                                <h5 className="font-bold text-navy-deep border-b border-slate-100 pb-2">Agency Services</h5>
                                <TextField label="Heading" path="agency.heading" placeholder="Agency Services" />
                                <TextField label="Description" path="agency.description" multiline placeholder="Description..." />
                                <ImagePicker label="Image 1" path="agency.image1" />
                            </div>
                        </div>
                    </div>
                )}

                {selectedPage === 'manufacturing' && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <SectionHeader title="Manufacturing Divisions" />
                        <div className="grid grid-cols-1 gap-12">
                            <div className="space-y-6">
                                <h5 className="font-bold text-navy-deep border-b border-slate-100 pb-2">Aluminum Fabrication</h5>
                                <TextField label="Heading" path="aluminum.heading" placeholder="Aluminum Fabrication" />
                                <TextField label="Description" path="aluminum.description" multiline placeholder="Description..." />
                                <ImagePicker label="Section Image" path="aluminum.image" />
                            </div>
                            <div className="space-y-6">
                                <h5 className="font-bold text-navy-deep border-b border-slate-100 pb-2">Steel & Plastic Packaging</h5>
                                <TextField label="Heading" path="packaging.heading" placeholder="Steel & Plastic Packaging" />
                                <TextField label="Description" path="packaging.description" multiline placeholder="Description..." />
                                <ImagePicker label="Section Image" path="packaging.image" />
                            </div>
                            <div className="space-y-6">
                                <h5 className="font-bold text-navy-deep border-b border-slate-100 pb-2">Smelter Development</h5>
                                <TextField label="Heading" path="smelter.heading" placeholder="Alumina Refinery..." />
                                <TextField label="Description" path="smelter.description" multiline placeholder="Description..." />
                                <ImagePicker label="Section Image" path="smelter.image" />
                            </div>
                        </div>
                    </div>
                )}

                {selectedPage === 'natural_resources' && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <SectionHeader title="Resources Sections" />
                        <div className="space-y-6">
                            <h5 className="font-bold text-navy-deep border-b border-slate-100 pb-2">Bauxite Mining</h5>
                            <TextField label="Heading" path="bauxite.heading" placeholder="Bauxite Mining" />
                            <TextField label="Description" path="bauxite.description" multiline placeholder="Description..." />
                            <ImagePicker label="Section Image" path="bauxite.image" />
                        </div>
                    </div>
                )}

                {/* Save Bar */}
                <div className="sticky bottom-6 flex justify-end">
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-3 px-8 py-4 bg-navy-deep text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#BC9C33] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-navy-deep/20 hover:-translate-y-1 transform">
                        {isSaving ? "Saving..." : <><Save size={18} /> Save Page Changes</>}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-navy-deep tracking-tight">Business Page Manager</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Manage content for individual business pages</p>
                </div>
            </div>

            {/* Page Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl">
                {[
                    { id: 'property', label: "Property" },
                    { id: 'trading', label: "Trading & Services" },
                    { id: 'manufacturing', label: "Manufacturing" },
                    { id: 'natural_resources', label: "Natural Resources" }
                ].map(page => (
                    <button
                        key={page.id}
                        onClick={() => setSelectedPage(page.id as any)}
                        className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${selectedPage === page.id
                            ? "bg-white text-navy-deep shadow-sm"
                            : "text-slate-400 hover:text-navy-deep hover:bg-slate-200/50"
                            }`}
                    >
                        {page.label}
                    </button>
                ))}
            </div>

            {/* Editor Content */}
            {renderEditor()}
        </div>
    );
};



export default SiteEditor;
