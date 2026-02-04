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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-card w-full max-w-xl overflow-hidden shadow-2xl"
            >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 text-left">
                    <div>
                        <h3 className="text-xl font-display">Inquiry Details</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Submitted on {new Date(contact.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors" aria-label="Close inquiry details">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8 space-y-6 text-left">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">First Name</label>
                            <p className="text-sm font-bold text-navy-deep">{contact.first_name || '-'}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Last Name</label>
                            <p className="text-sm font-bold text-navy-deep">{contact.last_name || '-'}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                        <p className="text-sm font-bold text-[#BA9B32]">{contact.email}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Message</label>
                        <div className="bg-slate-50 border border-slate-100 rounded-card-sm p-6">
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap italic">"{contact.message}"</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button onClick={onClose} className="px-6 py-3 bg-navy-deep text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#BA9B32] transition-all shadow-lg">Close Details</button>
                </div>
            </motion.div>
        </div>
    );
};

const ContactSection = () => {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
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
        setDeletingId(null);
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
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left px-2">
                <div>
                    <h2 className="text-2xl font-display text-navy-deep">Contact Inquiries</h2>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                        Showing {currentItems.length} of {filteredContacts.length} results
                    </p>
                </div>
                <button
                    onClick={fetchContacts}
                    className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-white border border-slate-100 text-navy-deep rounded-full font-bold text-[10px] uppercase tracking-[.3em] hover:bg-slate-50 transition-all shadow-sm"
                >
                    <Clock size={16} /> <span>Refresh List</span>
                </button>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4 text-left">
                <div className="flex-1 relative w-full">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                        type="text"
                        placeholder="Search inquires..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-lg text-xs font-medium focus:bg-white focus:border-slate-200 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex-1 lg:w-auto bg-slate-50 border border-transparent rounded-lg py-3 px-4 text-xs focus:bg-white outline-none"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex-1 lg:w-auto bg-slate-50 border border-transparent rounded-lg py-3 px-4 text-xs focus:bg-white outline-none"
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Sender</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Message</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {currentItems.map((contact) => (
                            <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <p className="text-xs font-bold text-navy-deep">{new Date(contact.created_at).toLocaleDateString()}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-navy-deep">{contact.first_name} {contact.last_name}</p>
                                    <p className="text-xs text-[#BA9B32]">{contact.email}</p>
                                </td>
                                <td className="px-8 py-6 max-w-md">
                                    <p className="text-xs text-slate-500 line-clamp-2 italic">"{contact.message}"</p>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setSelectedContact(contact)} className="p-3 text-slate-300 hover:text-[#BA9B32]">
                                            <Eye size={18} />
                                        </button>
                                        <button onClick={() => setDeletingId(contact.id)} className="p-3 text-slate-300 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {currentItems.map((contact) => (
                    <div key={contact.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4 text-left">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">{new Date(contact.created_at).toLocaleDateString()}</p>
                                <p className="text-sm font-bold text-navy-deep">{contact.first_name} {contact.last_name}</p>
                                <p className="text-xs text-[#BA9B32] truncate">{contact.email}</p>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => setSelectedContact(contact)} className="p-2 text-slate-300 hover:text-[#BA9B32]">
                                    <Eye size={18} />
                                </button>
                                <button onClick={() => setDeletingId(contact.id)} className="p-2 text-slate-300 hover:text-red-500">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-xs text-slate-500 line-clamp-3 italic leading-relaxed">"{contact.message}"</p>
                        </div>
                    </div>
                ))}
                {currentItems.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No inquiries found</p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={() => deletingId && handleDelete(deletingId)}
                title="Delete Inquiry?"
                message="This will permanently remove this contact message."
                confirmText="Delete Message"
                isDangerous={true}
            />

            <ContactDetailModal
                contact={selectedContact}
                isOpen={!!selectedContact}
                onClose={() => setSelectedContact(null)}
            />
        </div>
    );
};

export default ContactSection;
