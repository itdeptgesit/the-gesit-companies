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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-card w-full max-w-2xl overflow-hidden shadow-2xl"
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
                            className="w-full bg-slate-50 border border-slate-100 rounded-input py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            placeholder="Enter article title..."
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Media Type</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, media_type: 'image' })}
                                className={`flex-1 py-3 px-4 rounded-input text-xs font-bold uppercase tracking-widest transition-all ${formData.media_type !== 'video' ? 'bg-navy-deep text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >
                                Image
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, media_type: 'video' })}
                                className={`flex-1 py-3 px-4 rounded-input text-xs font-bold uppercase tracking-widest transition-all ${formData.media_type === 'video' ? 'bg-[#BA9B32] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
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
                                        className="w-full bg-slate-50 border border-slate-100 rounded-input py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
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
                                            className="px-6 bg-slate-100 text-slate-500 rounded-input hover:bg-[#BA9B32] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
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
                                className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-card-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#BA9B32] transition-colors overflow-hidden relative group"
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
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-input py-2 px-4 text-[10px] focus:outline-none text-slate-400"
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
                                className="w-full bg-slate-50 border border-slate-100 rounded-input py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                                placeholder="15 Jan 2026"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-input py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Author</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-input py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Excerpt / Summary</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-input py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 h-24 resize-none"
                            placeholder="Brief summary for cards..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tags</label>
                        <input
                            type="text"
                            value={formData.tags || ''}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-input py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
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
                            className="w-full bg-slate-50 border border-slate-100 rounded-input py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20 h-24 resize-none"
                            placeholder="Enter a highlight quote..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quote Author (Optional)</label>
                        <input
                            type="text"
                            value={formData.quote_author || ''}
                            onChange={(e) => setFormData({ ...formData, quote_author: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-input py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#BA9B32]/20"
                            placeholder="e.g. Gesit Foundation Executive Board"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Content</label>
                        <div className="border border-slate-100 rounded-card-sm overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-[#BA9B32]/20">
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
                                    className="p-2 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-all font-bold"
                                    title="Bold"
                                >
                                    B
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
                                    className="p-2 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-all italic"
                                    title="Italic"
                                >
                                    I
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
                                    className="p-2 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-all underline"
                                    title="Underline"
                                >
                                    U
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
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1 w-full max-w-2xl">
                    <div className="relative w-full">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            type="text"
                            placeholder="Filter articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-full font-bold text-[10px] uppercase tracking-widest text-[#103065] placeholder:text-slate-300 focus:ring-2 focus:ring-[#BA9B32]/20 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap px-2">Found {filteredItems.length} items</span>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsSliderOpen(true); }}
                    className="flex items-center gap-3 w-full md:w-auto px-8 py-4 bg-[#BA9B32] text-white rounded-full font-bold text-[10px] uppercase tracking-[.3em] hover:bg-navy-deep shadow-xl shadow-[#BA9B32]/20 transition-all hover:scale-105 justify-center"
                >
                    <Plus size={20} /> <span>Create New Story</span>
                </button>
            </div>

            <div className="mb-2">
                <h3 className="text-lg font-display font-bold text-navy-deep uppercase tracking-widest text-left">News Database</h3>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
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
                                            <div className="w-20 h-14 bg-slate-100 rounded-card-sm overflow-hidden shadow-sm group-hover:scale-105 transition-transform shrink-0">
                                                <img src={item.image} className="w-full h-full object-cover grayscale" alt="Thumb" />
                                            </div>
                                            <div className="min-w-0 text-left">
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
                                                className="p-3 bg-slate-100 text-slate-400 hover:bg-[#BA9B32]/10 hover:text-[#BA9B32] rounded-card-sm transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteNews(item.id)}
                                                className="p-3 bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-card-sm transition-all"
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

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="bg-white p-12 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-[#BA9B32] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Syncing...</p>
                    </div>
                ) : (
                    currentItems.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left">
                            <div className="flex gap-4">
                                <div className="w-24 h-16 bg-slate-100 rounded-card-sm overflow-hidden shadow-sm shrink-0">
                                    <img src={item.image} className="w-full h-full object-cover grayscale" alt="Thumb" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm mb-1 line-clamp-2">{item.title}</p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full text-[7px] font-bold uppercase tracking-widest">{item.category}</span>
                                        {item.featured && <span className="text-[7px] font-bold text-[#BA9B32] uppercase tracking-widest">★ Featured</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.date}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingItem(item); setIsSliderOpen(true); }}
                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-lg"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => deleteNews(item.id)}
                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-lg text-red-400"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!loading && filteredItems.length > 0 && (
                <div className="mt-8 flex items-center justify-between px-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="px-4 py-3 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-white transition-all text-slate-500"
                        >
                            Prev
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="px-4 py-3 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-white transition-all text-slate-500"
                        >
                            Next
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
