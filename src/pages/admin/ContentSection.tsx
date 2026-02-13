import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Filter,
    Plus,
    Edit2,
    Trash2,
    X,
    Camera
} from "lucide-react";
import { useNews, type NewsItem } from "../../context/NewsContext";
import { uploadImage } from "../../lib/supabase";

// Loading fallback component
const SectionLoader = () => (
    <div className="flex flex-col items-center justify-center min-vh-50 gap-4 py-20">
        <div className="w-8 h-8 border-4 border-[#BC9C33] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[9px] font-bold uppercase tracking-[.3em] text-slate-300">Synchronizing...</p>
    </div>
);

export const NewsModal = ({
    isOpen,
    onClose,
    onSave,
    initialData = null
}: {
    isOpen: boolean,
    onClose: () => void,
    onSave: (data: Omit<NewsItem, 'id'>) => void,
    initialData?: NewsItem | null
}) => {
    const [formData, setFormData] = useState<Omit<NewsItem, 'id'>>({
        type: "news",
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
                setFormData({
                    type: "news",
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
    }, [isOpen, initialData]);

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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-navy-deep/20 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative"
            >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white relative z-10">
                    <div className="text-left">
                        <h3 className="text-2xl font-black text-navy-deep tracking-tight">{initialData ? 'Refine Entry' : 'New Publication'}</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Archival Management Node
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-navy-deep hover:bg-slate-50 rounded-xl transition-all active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar text-left scroll-smooth pb-20 relative z-10 bg-white">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-navy-deep font-bold text-base transition-all"
                            placeholder="Enter publication title..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Format</label>
                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => setFormData({ ...formData, media_type: 'image' })}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.media_type !== 'video' ? 'bg-navy-deep text-white shadow-md' : 'text-slate-400 hover:text-navy-deep'}`}
                                >
                                    Image
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, media_type: 'video' })}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.media_type === 'video' ? 'bg-navy-deep text-white shadow-md' : 'text-slate-400 hover:text-navy-deep'}`}
                                >
                                    Video
                                </button>
                            </div>
                        </div>

                        <div className={`space-y-3 transition-all ${formData.media_type === 'video' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Video Resource</label>
                            <input
                                type="text"
                                value={formData.video_url || ''}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[10px] font-black text-navy-deep transition-all"
                                placeholder="Enter stream URL..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Visualization</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-[21/10] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-100/50 transition-all overflow-hidden relative group/hero"
                        >
                            {formData.image ? (
                                <>
                                    <img src={formData.image} className="w-full h-full object-cover transition-transform duration-700 group-hover/hero:scale-105" alt="Preview" />
                                    <div className="absolute inset-0 bg-navy-deep/60 opacity-0 group-hover/hero:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white border border-white/20">
                                            <Camera size={20} />
                                        </div>
                                        <p className="text-white font-black text-[9px] uppercase tracking-widest">Update Resource</p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover/hero:scale-105 transition-transform">
                                        <Camera size={24} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initialize Visual</p>
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-4 z-20">
                                    <div className="w-8 h-8 border-3 border-navy-deep border-t-amber-500 rounded-full animate-spin"></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-navy-deep">Transferring...</p>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: 'Date', key: 'date' },
                            { label: 'Archive', key: 'category' },
                            { label: 'Operator', key: 'author' }
                        ].map(field => (
                            <div key={field.key} className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{field.label}</label>
                                <input
                                    type="text"
                                    value={(formData as any)[field.key]}
                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[10px] font-black text-navy-deep transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Summary</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-5 px-6 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[11px] font-medium text-navy-deep h-24 resize-none leading-relaxed transition-all"
                            placeholder="Brief digest for archival stream..."
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Logistics</label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {['B', 'I'].map(btn => (
                                    <button
                                        key={btn}
                                        type="button"
                                        onClick={() => {
                                            const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
                                            const start = textarea.selectionStart;
                                            const end = textarea.selectionEnd;
                                            const tag = btn.toLowerCase();
                                            const text = formData.content || '';
                                            const newText = `${text.substring(0, start)}<${tag}>${text.substring(start, end)}</${tag}>${text.substring(end)}`;
                                            setFormData({ ...formData, content: newText });
                                        }}
                                        className="w-8 h-8 rounded hover:bg-white text-[10px] font-black transition-all flex items-center justify-center text-navy-deep"
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            id="content-textarea"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-6 px-8 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[11px] font-medium text-navy-deep h-80 resize-none leading-[1.8] font-mono transition-all"
                            placeholder="Specify archival node content..."
                        />
                    </div>

                    <div className={`rounded-[2rem] p-6 flex items-center justify-between transition-all ${formData.featured ? 'bg-amber-500 border border-amber-600' : 'bg-slate-50 border border-slate-200'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.featured ? 'bg-white text-amber-500' : 'bg-white text-slate-300 border border-slate-100'}`}>
                                <Plus size={18} className={formData.featured ? 'rotate-45 transition-transform' : ''} />
                            </div>
                            <div className="text-left">
                                <h4 className={`text-xs font-black tracking-tight ${formData.featured ? 'text-white' : 'text-navy-deep'}`}>Promoted Node</h4>
                                <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${formData.featured ? 'text-white/70' : 'text-slate-400'}`}>Highlight in global grid</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                            className={`w-12 h-6 rounded-full relative transition-all ${formData.featured ? 'bg-white/20' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${formData.featured ? 'left-7 bg-white' : 'left-1 bg-white'}`} />
                        </button>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-6 items-center relative z-20">
                    <button
                        onClick={onClose}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy-deep transition-colors"
                    >
                        Abort
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        disabled={uploading}
                        className="px-10 py-4 bg-navy-deep text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all disabled:opacity-50 shadow-lg shadow-navy-deep/20"
                    >
                        {uploading ? "Executing..." : "Save Publication"}
                    </button>
                </div>
            </motion.div >
        </div >
    );
};

const ContentSection = () => {
    const { newsItems, loading, addNews, updateNews, deleteNews } = useNews();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredItems = newsItems.filter(item =>
        item.type === "news" &&
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

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
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="relative group w-full max-w-lg">
                    <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#BC9C33] transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Filter publications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-[20px] text-[11px] font-bold text-navy-deep placeholder:text-slate-300 outline-none shadow-sm transition-all focus:border-slate-300 focus:bg-white"
                    />
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsSliderOpen(true); }}
                    className="group flex items-center gap-3 px-8 py-4 bg-navy-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#BC9C33] transition-all shadow-xl shadow-navy-deep/5 active:scale-95 shrink-0"
                >
                    <Plus size={16} />
                    <span>Post Publication</span>
                </button>
            </div>

            <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Database: {filteredItems.length} Entries</span>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Content Entry</th>
                                <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Commit Date</th>
                                <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-10 py-48 text-center">
                                        <SectionLoader />
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/40 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-8">
                                                <div className="w-24 h-16 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0 p-0.5">
                                                    <img src={item.image} className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-700" alt="Thumb" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-navy-deep text-lg mb-2 line-clamp-1 tracking-tight font-display group-hover:text-[#BC9C33] transition-all duration-500">{item.title}</p>
                                                    <div className="flex items-center gap-4">
                                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                                                        {item.featured && (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#BC9C33] shadow-[0_0_8px_rgba(188,156,51,0.5)]" />
                                                                <span className="text-[8px] font-black text-[#BC9C33] uppercase tracking-widest">Featured Node</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <p className="text-[10px] text-navy-deep font-black uppercase tracking-widest opacity-40">{item.date}</p>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 pr-2">
                                                <button
                                                    onClick={() => { setEditingItem(item); setIsSliderOpen(true); }}
                                                    className="w-11 h-11 flex items-center justify-center bg-white text-navy-deep rounded-xl shadow-sm border border-slate-100 hover:border-navy-deep transition-all duration-500"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteNews(item.id)}
                                                    className="w-11 h-11 flex items-center justify-center bg-white text-red-400 rounded-xl shadow-sm border border-slate-100 hover:border-red-500 hover:text-red-500 transition-all duration-500"
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
                </div>
            </div>

            {/* Mobile Cards (Hidden on desktop) */}
            <div className="md:hidden space-y-4">
                {currentItems.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 text-left space-y-6"
                    >
                        <div className="flex gap-6">
                            <div className="w-24 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                <img src={item.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-black text-navy-deep text-base mb-2 line-clamp-2 tracking-tight leading-none font-display">{item.title}</p>
                                <span className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-[7px] font-black uppercase tracking-widest">{item.category}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{item.date}</span>
                            <div className="flex gap-3">
                                <button onClick={() => { setEditingItem(item); setIsSliderOpen(true); }} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-navy-deep"><Edit2 size={14} /></button>
                                <button onClick={() => deleteNews(item.id)} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-red-400"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!loading && filteredItems.length > 0 && (
                <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 px-4">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-navy-deep"
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Node {currentPage} <span className="mx-2 opacity-10">/</span> {totalPages}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="px-8 py-3 rounded-2xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:border-slate-300 transition-all text-navy-deep active:scale-95 shadow-sm"
                        >
                            Previous
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="px-8 py-3 rounded-2xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:border-slate-300 transition-all text-navy-deep active:scale-95 shadow-sm"
                        >
                            Execute Next
                        </button>
                    </div>
                </div>
            )}

            <NewsModal
                isOpen={isSliderOpen}
                onClose={() => { setIsSliderOpen(false); setEditingItem(null); }}
                onSave={handleSave}
                initialData={editingItem}
            />
        </div>
    );
};

export default ContentSection;
