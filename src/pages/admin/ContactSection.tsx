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
                className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative"
            >
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white relative z-10 text-left">
                    <div>
                        <h3 className="text-3xl font-black text-navy-deep tracking-tight font-display">Inquiry Details</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#BC9C33] shadow-[0_0_8px_rgba(188,156,51,0.5)]" />
                            Registered Log: {new Date(contact.created_at).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-navy-deep hover:bg-slate-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-10 space-y-10 max-h-[65vh] overflow-y-auto custom-scrollbar text-left scroll-smooth relative z-10 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Originator</p>
                            <div className="flex flex-col">
                                <p className="text-2xl font-black text-navy-deep tracking-tight font-display">{contact.first_name} {contact.last_name}</p>
                                <p className="text-[12px] font-black text-[#BC9C33] tracking-widest uppercase mt-2">{contact.email}</p>
                                {contact.phone && <p className="text-[11px] font-bold text-slate-400 mt-2">{contact.phone}</p>}
                            </div>
                        </div>
                        <div className="space-y-4 md:text-right">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Transmission Time</p>
                            <div className="flex flex-col">
                                <p className="text-[12px] font-black text-navy-deep uppercase tracking-[0.2em]">{new Date(contact.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 opacity-50">{new Date(contact.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-10 border-t border-slate-50">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Message Content</label>
                        <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-50">
                            <p className="text-[14px] text-navy-deep leading-relaxed font-medium italic opacity-80">"{contact.message}"</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex justify-end relative z-20">
                    <button
                        onClick={onClose}
                        className="px-12 py-4 bg-navy-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#BC9C33] transition-all shadow-xl shadow-navy-deep/5 active:scale-95"
                    >
                        Terminal Close
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
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[10px] font-black text-navy-deep uppercase tracking-[0.2em]">Active Feed</span>
                    </div>
                </div>
                <button
                    onClick={fetchContacts}
                    className="group flex items-center justify-center gap-3 px-8 py-3.5 bg-white border border-slate-100 text-navy-deep rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-navy-deep hover:text-white transition-all shadow-sm active:scale-95"
                >
                    <Clock size={14} className="transition-transform group-hover:rotate-180 duration-700" />
                    <span>Sync Database</span>
                </button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1 relative w-full group">
                    <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#BC9C33] transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Filter messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-8 py-4 bg-slate-50/50 border border-slate-100 rounded-[20px] font-bold text-[11px] text-navy-deep placeholder:text-slate-300 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-48">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-[18px] py-3.5 px-6 font-black text-[10px] uppercase tracking-widest text-navy-deep focus:bg-white focus:border-slate-300 outline-none transition-all"
                        />
                    </div>
                    <div className="w-4 h-0.5 bg-slate-100 rounded-full shrink-0" />
                    <div className="relative flex-1 lg:w-48">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-[18px] py-3.5 px-6 font-black text-[10px] uppercase tracking-widest text-navy-deep focus:bg-white focus:border-slate-300 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Sender</th>
                                <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Inquiry Content</th>
                                <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Timestamp</th>
                                <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentItems.map((contact) => (
                                <tr key={contact.id} className="hover:bg-slate-50/40 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1.5">
                                            <p className="font-black text-navy-deep text-lg tracking-tight font-display group-hover:text-[#BC9C33] transition-colors">{contact.first_name} {contact.last_name}</p>
                                            <p className="text-[10px] font-black text-[#BC9C33] tracking-widest uppercase opacity-60">{contact.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="text-[12px] text-slate-400 line-clamp-1 max-w-sm font-medium italic leading-relaxed">"{contact.message}"</p>
                                    </td>
                                    <td className="px-10 py-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-right opacity-50">
                                        {new Date(contact.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 pr-2">
                                            <button
                                                onClick={() => setSelectedContact(contact)}
                                                className="w-11 h-11 flex items-center justify-center bg-white text-navy-deep rounded-xl border border-slate-100 hover:border-navy-deep transition-all duration-500 shadow-sm"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmModal({ isOpen: true, id: contact.id, title: 'Confirm Delete', message: `Are you sure you want to delete this submission from ${contact.first_name}?` })}
                                                className="w-11 h-11 flex items-center justify-center bg-white text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl border border-slate-100 transition-all duration-500 shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {currentItems.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-48 opacity-20 grayscale">
                        <Eye size={64} strokeWidth={1} className="mb-6" />
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-navy-deep">Zero Messages Found</p>
                    </div>
                )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {currentItems.map((contact) => (
                    <motion.div
                        key={contact.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6 text-left"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">{new Date(contact.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                <p className="text-xl font-black text-navy-deep tracking-tight truncate font-display mb-1">{contact.first_name} {contact.last_name}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#BC9C33] truncate opacity-80">{contact.email}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setSelectedContact(contact)} className="w-10 h-10 flex items-center justify-center bg-white text-navy-deep rounded-xl border border-slate-100 shadow-sm active:scale-90 transition-transform"><Eye size={14} /></button>
                                <button onClick={() => setConfirmModal({ isOpen: true, id: contact.id, title: 'Confirm Deletion', message: `Purge message from ${contact.first_name}?` })} className="w-10 h-10 flex items-center justify-center bg-white text-red-400 rounded-xl border border-slate-100 shadow-sm active:scale-90 transition-transform"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-50">
                            <p className="text-[12px] text-navy-deep line-clamp-3 leading-relaxed font-medium italic opacity-70">"{contact.message}"</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination nodes */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 px-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-navy-deep"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentPage / (Math.ceil(filteredContacts.length / itemsPerPage) || 1)) * 100}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Index {currentPage} <span className="mx-2 opacity-10">/</span> {Math.ceil(filteredContacts.length / itemsPerPage) || 1}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="px-8 py-3 rounded-2xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-20 hover:border-slate-300 transition-all text-navy-deep active:scale-95 shadow-sm"
                    >
                        Back
                    </button>
                    <button
                        disabled={currentPage === (Math.ceil(filteredContacts.length / itemsPerPage) || 1)}
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredContacts.length / itemsPerPage) || 1, prev + 1))}
                        className="px-8 py-3 rounded-2xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-20 hover:border-slate-300 transition-all text-navy-deep active:scale-95 shadow-sm"
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
                    confirmText="Delete"
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
