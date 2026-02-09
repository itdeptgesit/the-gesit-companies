import { useState, useEffect } from "react";
import {
    Clock,
    Filter,
    Eye,
    Trash2,
    X
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { ConfirmationModal } from "./SharedModals";

export const ContactDetailModal = ({ contact, isOpen, onClose }: { contact: any, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !contact) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-navy-deep/20 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative"
            >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white relative z-10 text-left">
                    <div>
                        <h3 className="text-2xl font-black text-navy-deep tracking-tight">Signal Detail</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Log: {new Date(contact.created_at).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-navy-deep hover:bg-slate-50 rounded-xl transition-all active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar text-left scroll-smooth relative z-10 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Originator</p>
                            <div className="flex flex-col">
                                <p className="text-xl font-black text-navy-deep tracking-tight">{contact.first_name} {contact.last_name}</p>
                                <p className="text-[11px] font-bold text-amber-600 tracking-wide mt-1">{contact.email}</p>
                                {contact.phone && <p className="text-[10px] font-bold text-slate-400 mt-1">{contact.phone}</p>}
                            </div>
                        </div>
                        <div className="space-y-3 md:text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</p>
                            <div className="flex flex-col">
                                <p className="text-[11px] font-black text-navy-deep uppercase tracking-widest">{new Date(contact.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(contact.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-slate-100">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message Content</label>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[12px] text-navy-deep leading-relaxed font-medium italic">"{contact.message}"</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end relative z-20">
                    <button
                        onClick={onClose}
                        className="px-10 py-4 bg-navy-deep text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-navy-deep/20"
                    >
                        Acknowledge
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const ContactSection = () => {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null; title: string; message: string }>({ isOpen: false, id: null, title: '', message: '' });
    const [selectedContact, setSelectedContact] = useState<any | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchContacts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setContacts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
        if (!error) {
            setContacts(contacts.filter(c => c.id !== id));
        }
        setConfirmModal({ isOpen: false, id: null, title: '', message: '' });
    };

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch =
            contact.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.message?.toLowerCase().includes(searchQuery.toLowerCase());

        const contactDate = new Date(contact.created_at).toISOString().split('T')[0];
        const matchesStartDate = !startDate || contactDate >= startDate;
        const matchesEndDate = !endDate || contactDate <= endDate;

        return matchesSearch && matchesStartDate && matchesEndDate;
    });

    const currentItems = filteredContacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, startDate, endDate]);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-navy-deep uppercase tracking-widest">Telemetry Online</span>
                    </div>
                </div>
                <button
                    onClick={fetchContacts}
                    className="group flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 text-navy-deep rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-navy-deep hover:text-white transition-all shadow-sm active:scale-95"
                >
                    <Clock size={14} className="transition-transform group-hover:rotate-180 duration-500" />
                    <span>Resync Pipeline</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center gap-6 text-left">
                <div className="flex-1 relative w-full">
                    <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-navy-deep transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Search intercepts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-8 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-[11px] uppercase tracking-widest text-navy-deep placeholder:text-slate-300 focus:bg-white focus:border-navy-deep/20 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-44">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 font-black text-[10px] uppercase tracking-widest text-navy-deep focus:bg-white focus:border-navy-deep/20 outline-none transition-all"
                        />
                    </div>
                    <div className="w-3 h-0.5 bg-slate-100 rounded-full shrink-0" />
                    <div className="relative flex-1 lg:w-44">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 font-black text-[10px] uppercase tracking-widest text-navy-deep focus:bg-white focus:border-navy-deep/20 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px] relative">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Signal Source</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Message Content</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Timestamp</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Execution</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {currentItems.map((contact) => (
                            <tr key={contact.id} className="hover:bg-slate-50 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-navy-deep text-base tracking-tight">{contact.first_name} {contact.last_name}</p>
                                        <p className="text-[10px] font-black text-amber-500 tracking-wide uppercase">{contact.email}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm font-medium italic">"{contact.message}"</p>
                                </td>
                                <td className="px-8 py-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
                                    {new Date(contact.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => setSelectedContact(contact)}
                                            className="w-10 h-10 flex items-center justify-center bg-white text-navy-deep rounded-xl border border-slate-200 hover:border-navy-deep transition-all shadow-sm"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => setConfirmModal({ isOpen: true, id: contact.id, title: 'Terminate Signal', message: `Purge transmission from ${contact.first_name}?` })}
                                            className="w-10 h-10 flex items-center justify-center bg-white text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl border border-slate-200 transition-all shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {currentItems.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-40 opacity-20 grayscale">
                        <Eye size={64} className="mb-4" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-navy-deep">No Signals Captured</p>
                    </div>
                )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {currentItems.map((contact) => (
                    <div key={contact.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left group transition-all relative">
                        <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">{new Date(contact.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                <p className="text-lg font-bold text-navy-deep tracking-tight truncate">{contact.first_name} {contact.last_name}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 truncate">{contact.email}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => setSelectedContact(contact)} className="w-9 h-9 flex items-center justify-center bg-white text-navy-deep rounded-xl border border-slate-200 shadow-sm active:scale-90 transition-transform">
                                    <Eye size={14} />
                                </button>
                                <button onClick={() => setConfirmModal({ isOpen: true, id: contact.id, title: 'Terminate Signal', message: `Purge transmission from ${contact.first_name}?` })} className="w-9 h-9 flex items-center justify-center bg-white text-red-400 rounded-xl border border-slate-200 shadow-sm active:scale-90 transition-transform">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-[11px] text-navy-deep line-clamp-3 leading-relaxed font-medium italic">"{contact.message}"</p>
                        </div>
                    </div>
                ))}
                {currentItems.length === 0 && !loading && (
                    <div className="text-center py-32 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-4 grayscale opacity-20">
                        <Eye size={48} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Signal Intercepts</p>
                    </div>
                )}
            </div>

            {/* Pagination nodes */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-1">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-navy-deep"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentPage / (Math.ceil(filteredContacts.length / itemsPerPage) || 1)) * 100}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Page {currentPage} <span className="mx-2 opacity-30">/</span> {Math.ceil(filteredContacts.length / itemsPerPage) || 1}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all text-navy-deep active:scale-95 shadow-sm"
                    >
                        Back
                    </button>
                    <button
                        disabled={currentPage === (Math.ceil(filteredContacts.length / itemsPerPage) || 1)}
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredContacts.length / itemsPerPage) || 1, prev + 1))}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all text-navy-deep active:scale-95 shadow-sm"
                    >
                        Next
                    </button>
                </div>
            </div>

            {confirmModal.isOpen && (
                <ConfirmationModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                    onConfirm={() => confirmModal.id && handleDelete(confirmModal.id)}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    confirmText="Terminate"
                    isDangerous={true}
                />
            )}
            <ContactDetailModal
                contact={selectedContact}
                isOpen={!!selectedContact}
                onClose={() => setSelectedContact(null)}
            />
        </div>
    );
};


export default ContactSection;
