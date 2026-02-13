import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Filter,
    Edit2,
    Trash2,
    Briefcase,
    Building2,
    MapPin,
    X
} from "lucide-react";
import { useCareer, type Career } from "../../context/CareerContext";
import { ConfirmationModal } from "./SharedModals";

export const JobModal = ({
    isOpen,
    onClose,
    onSave,
    initialData = null
}: {
    isOpen: boolean,
    onClose: () => void,
    onSave: (data: Omit<Career, 'id' | 'created_at' | 'is_active'>) => void,
    initialData?: Career | null
}) => {
    const [formData, setFormData] = useState({
        title: "",
        department: "",
        location: "Jakarta, Indonesia",
        type: "Full-time",
        description: "",
        requirements: "",
        linkedin_url: "",
        is_active: true,
        expires_at: ""
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    department: initialData.department,
                    location: initialData.location,
                    type: initialData.type,
                    description: initialData.description,
                    requirements: initialData.requirements || "",
                    linkedin_url: initialData.linkedin_url || "",
                    is_active: initialData.is_active !== undefined ? initialData.is_active : true,
                    expires_at: initialData.expires_at ? initialData.expires_at.split('T')[0] : ""
                });
            } else {
                setFormData({
                    title: "",
                    department: "",
                    location: "Jakarta, Indonesia",
                    type: "Full-time",
                    description: "",
                    requirements: "",
                    linkedin_url: "",
                    is_active: true,
                    expires_at: ""
                });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-navy-deep/20 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative"
            >
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white relative z-10 text-left">
                    <div>
                        <h3 className="text-3xl font-black text-navy-deep tracking-tight font-display">{initialData ? 'Refine Posting' : 'New Opening'}</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#BC9C33] shadow-[0_0_8px_rgba(188,156,51,0.5)]" />
                            Career Parameters
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-navy-deep hover:bg-slate-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar text-left scroll-smooth pb-20 relative z-10 bg-white">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">Job Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4.5 px-8 focus:outline-none focus:border-slate-300 focus:bg-white text-navy-deep font-black text-lg transition-all placeholder:text-slate-200"
                            placeholder="e.g. Project Manager"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">Branch / Group</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-8 focus:outline-none focus:border-slate-300 focus:bg-white text-[11px] font-black uppercase tracking-widest text-navy-deep transition-all placeholder:text-slate-200"
                                placeholder="Core Operations"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">Location Zone</label>
                            <div className="relative group">
                                <MapPin size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#BC9C33] transition-colors" />
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-16 pr-8 focus:outline-none focus:border-slate-300 focus:bg-white text-[11px] font-black uppercase tracking-widest text-navy-deep transition-all placeholder:text-slate-200"
                                    placeholder="Jakarta, Indonesia"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">Primary Summary</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] py-8 px-10 focus:outline-none focus:border-slate-300 focus:bg-white text-[13px] font-medium text-navy-deep/80 h-48 resize-none leading-relaxed transition-all placeholder:text-slate-200"
                            placeholder="Specify role parameters..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">Key Requirements</label>
                        <textarea
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] py-8 px-10 focus:outline-none focus:border-slate-300 focus:bg-white text-[13px] font-medium text-navy-deep/80 h-48 resize-none leading-relaxed transition-all placeholder:text-slate-200"
                            placeholder="Detail candidate requirements..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">External Link (LinkedIn)</label>
                            <input
                                type="text"
                                value={formData.linkedin_url}
                                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-8 focus:outline-none focus:border-slate-300 focus:bg-white text-[11px] font-black text-[#BC9C33] transition-all placeholder:text-slate-200"
                                placeholder="https://linkedin.com/jobs/..."
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">Target Expiration</label>
                            <input
                                type="date"
                                value={formData.expires_at}
                                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-8 focus:outline-none focus:border-slate-300 focus:bg-white text-[11px] font-black uppercase tracking-widest text-navy-deep transition-all"
                            />
                        </div>
                    </div>

                    <div className={`rounded-[2.5rem] p-8 flex items-center justify-between transition-all group ${formData.is_active ? 'bg-navy-deep shadow-2xl shadow-navy-deep/20 border border-navy-deep' : 'bg-slate-50/50 border border-slate-100'}`}>
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${formData.is_active ? 'bg-white/10 text-[#BC9C33]' : 'bg-white text-slate-200 border border-slate-50'}`}>
                                <Briefcase size={24} />
                            </div>
                            <div className="text-left">
                                <h4 className={`text-lg font-black tracking-tight font-display ${formData.is_active ? 'text-white' : 'text-navy-deep opacity-60'}`}>Live Availability</h4>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 ${formData.is_active ? 'text-white/40' : 'text-slate-300'}`}>System visibility toggle</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                            className={`w-14 h-7 rounded-full relative transition-all duration-500 ${formData.is_active ? 'bg-[#BC9C33]' : 'bg-slate-200'}`}
                        >
                            <motion.div
                                animate={{ x: formData.is_active ? 28 : 4 }}
                                className="absolute top-1.5 w-4 h-4 rounded-full bg-white shadow-sm"
                            />
                        </button>
                    </div>
                </div>

                <div className="p-10 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-8 items-center relative z-20">
                    <button
                        onClick={onClose}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-navy-deep transition-colors"
                    >
                        Abort
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-12 py-4.5 bg-navy-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#BC9C33] transition-all shadow-xl shadow-navy-deep/10 active:scale-95"
                    >
                        Commit Position
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const CareersVault = () => {
    const { jobs, applications, deleteJob, addJob, updateJob, fetchApplications, deleteApplication } = useCareer();
    const [view, setView] = useState<'jobs' | 'applications'>('jobs');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchApplications();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Career | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'job' | 'application';
        id: number | null;
        resumeUrl?: string;
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'job',
        id: null,
        title: '',
        message: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [view, searchQuery]);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredApplications = applications.filter(app =>
        app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const currentApplications = filteredApplications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleConfirmDelete = async () => {
        if (!confirmModal.id) return;
        setIsDeleting(true);
        try {
            if (confirmModal.type === 'job') {
                await deleteJob(confirmModal.id);
            } else {
                await deleteApplication(confirmModal.id, confirmModal.resumeUrl || '');
            }
            setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete item.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveJob = async (data: any) => {
        if (editingJob) {
            await updateJob(editingJob.id, data);
        } else {
            await addJob(data);
        }
        setIsModalOpen(false);
        setEditingJob(null);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-4">
                <div className="flex bg-slate-50/80 p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm w-fit shrink-0">
                    <button
                        onClick={() => setView('jobs')}
                        className={`px-10 py-3.5 rounded-[1.15rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${view === 'jobs' ? 'bg-navy-deep text-white shadow-xl shadow-navy-deep/20' : 'text-slate-400 hover:text-navy-deep hover:bg-white'}`}
                    >
                        Positions
                    </button>
                    <button
                        onClick={() => setView('applications')}
                        className={`px-10 py-3.5 rounded-[1.15rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${view === 'applications' ? 'bg-navy-deep text-white shadow-xl shadow-navy-deep/20' : 'text-slate-400 hover:text-navy-deep hover:bg-white'}`}
                    >
                        Applicants
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    <div className="relative group w-full md:w-auto flex-1 md:flex-none">
                        <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#BC9C33] transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Filter archives..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-72 pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-navy-deep placeholder:text-slate-300 outline-none shadow-sm transition-all focus:border-slate-300"
                        />
                    </div>
                    {view === 'jobs' && (
                        <button
                            onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
                            className="group flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 bg-navy-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#BC9C33] transition-all shadow-xl shadow-navy-deep/10 active:scale-95 shrink-0"
                        >
                            <Plus size={16} className="transition-transform group-hover:rotate-90 duration-500" />
                            <span>New Opening</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[600px] relative overflow-hidden">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-[10px] font-black text-navy-deep uppercase tracking-[0.3em]">
                        {view === 'jobs' ? `Live Openings: ${filteredJobs.length}` : `Candidate Feed: ${filteredApplications.length}`}
                    </span>
                </div>

                {view === 'jobs' ? (
                    <div className="grid grid-cols-1 gap-6 relative z-10">
                        {currentJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-slate-200 hover:bg-slate-50/30 transition-all group/item shadow-sm hover:shadow-xl hover:shadow-slate-200/40"
                            >
                                <div className="flex items-center gap-8 text-left">
                                    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 ${job.is_active ? 'bg-navy-deep text-[#BC9C33] shadow-lg shadow-navy-deep/10' : 'bg-slate-50 text-slate-200 border border-slate-50'}`}>
                                        <Briefcase size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-4 mb-2.5">
                                            <p className="font-black text-navy-deep text-2xl tracking-tight leading-tight font-display group-hover/item:text-[#BC9C33] transition-colors duration-500">{job.title}</p>
                                            {!job.is_active && <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-slate-100 text-slate-400 px-3 py-1 rounded-full">Inactive</span>}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            <span className="flex items-center gap-2 opacity-60"><Building2 size={13} className="text-[#BC9C33]" /> {job.department}</span>
                                            <span className="flex items-center gap-2 opacity-60"><MapPin size={13} className="text-[#BC9C33]" /> {job.location}</span>
                                            <span className="px-3.5 py-1 bg-navy-deep text-[#BC9C33] rounded-full text-[9px]">{job.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 justify-end mt-6 md:mt-0 opacity-0 group-hover/item:opacity-100 transition-all duration-500 translate-x-4 group-hover/item:translate-x-0 pr-2">
                                    <button
                                        onClick={() => { setEditingJob(job); setIsModalOpen(true); }}
                                        className="w-12 h-12 flex items-center justify-center bg-white text-navy-deep rounded-2xl shadow-sm border border-slate-100 hover:border-navy-deep transition-all duration-500"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({
                                            isOpen: true,
                                            type: 'job',
                                            id: job.id,
                                            title: 'Purge Position',
                                            message: `This action will permanently remove "${job.title}" from the active database. Proceed?`
                                        })}
                                        className="w-12 h-12 flex items-center justify-center bg-white text-red-300 hover:text-red-500 rounded-2xl shadow-sm border border-slate-100 hover:bg-red-50 hover:border-red-100 transition-all duration-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 relative z-10">
                        {currentApplications.map((app) => (
                            <motion.div
                                key={app.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-slate-200 hover:bg-slate-50/30 transition-all group/item shadow-sm hover:shadow-xl hover:shadow-slate-200/40"
                            >
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-[1.25rem] bg-navy-deep flex items-center justify-center font-black text-[#BC9C33] text-2xl group-hover/item:bg-[#BC9C33] group-hover/item:text-white transition-all duration-700 shadow-xl shadow-navy-deep/10 font-display">
                                        {app.full_name.charAt(0)}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="font-black text-navy-deep text-2xl tracking-tight mb-2 font-display">{app.full_name}</p>
                                        <div className="flex flex-wrap items-center gap-6">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#BC9C33] shadow-[0_0_8px_rgba(188,156,51,0.5)]" />
                                                Target: {app.position}
                                            </span>
                                            <a href={`mailto:${app.email}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#BC9C33] hover:text-navy-deep transition-colors bg-[#BC9C33]/5 px-3.5 py-1 rounded-full">{app.email}</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-4 mt-6 md:mt-0 opacity-0 group-hover/item:opacity-100 transition-all duration-500 translate-x-4 group-hover/item:translate-x-0 pr-2">
                                    <a
                                        href={app.resume_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3.5 bg-white text-navy-deep border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-navy-deep hover:text-white transition-all shadow-sm"
                                    >
                                        Inspect Resume
                                    </a>
                                    <button
                                        onClick={() => setConfirmModal({
                                            isOpen: true,
                                            type: 'application',
                                            id: app.id,
                                            resumeUrl: app.resume_url,
                                            title: 'Purge Application',
                                            message: `Remove candidate "${app.full_name}" from the system records?`
                                        })}
                                        className="w-12 h-12 flex items-center justify-center bg-white text-red-300 hover:text-red-500 hover:bg-red-50 rounded-2xl border border-slate-100 transition-all duration-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {(view === 'jobs' ? currentJobs : currentApplications).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-56 opacity-20 grayscale">
                        <Briefcase size={80} strokeWidth={1} className="mb-8 text-navy-deep" />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-navy-deep">Terminal Empty</p>
                    </div>
                )}
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 px-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-navy-deep"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentPage / (Math.ceil((view === 'jobs' ? filteredJobs.length : filteredApplications.length) / itemsPerPage) || 1)) * 100}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Index {currentPage} <span className="mx-2 opacity-10">/</span> {Math.ceil((view === 'jobs' ? filteredJobs.length : filteredApplications.length) / itemsPerPage) || 1}
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
                        disabled={currentPage === (Math.ceil((view === 'jobs' ? filteredJobs.length : filteredApplications.length) / itemsPerPage) || 1)}
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil((view === 'jobs' ? filteredJobs.length : filteredApplications.length) / itemsPerPage) || 1, prev + 1))}
                        className="px-8 py-3 rounded-2xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-20 hover:border-slate-300 transition-all text-navy-deep active:scale-95 shadow-sm"
                    >
                        Next
                    </button>
                </div>
            </div>

            <JobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveJob}
                initialData={editingJob}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleConfirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Delete"
                isDangerous={true}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default CareersVault;
