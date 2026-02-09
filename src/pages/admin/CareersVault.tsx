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
                className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative"
            >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white relative z-10">
                    <div className="text-left">
                        <h3 className="text-2xl font-black text-navy-deep tracking-tight">{initialData ? 'Refine Posting' : 'New Opening'}</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Talent Acquisition Node
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-navy-deep font-bold text-base transition-all"
                            placeholder="e.g. Project Manager"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[10px] font-black text-navy-deep transition-all"
                                placeholder="Core Operations"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-14 pr-6 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[10px] font-black text-navy-deep transition-all"
                                    placeholder="Jakarta, Indonesia"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-6 px-8 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[11px] font-medium text-navy-deep h-48 resize-none leading-relaxed transition-all"
                            placeholder="Specify role parameters..."
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Requirements</label>
                        <textarea
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-6 px-8 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[11px] font-medium text-navy-deep h-48 resize-none leading-relaxed transition-all"
                            placeholder="Detail candidate requirements..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">LinkedIn URL</label>
                            <input
                                type="text"
                                value={formData.linkedin_url}
                                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[10px] font-black text-navy-deep transition-all"
                                placeholder="https://linkedin.com/jobs/..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expiration Date</label>
                            <input
                                type="date"
                                value={formData.expires_at}
                                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:outline-none focus:border-navy-deep/20 focus:bg-white text-[10px] font-black text-navy-deep transition-all"
                            />
                        </div>
                    </div>

                    <div className={`rounded-[2rem] p-6 flex items-center justify-between transition-all ${formData.is_active ? 'bg-amber-500 border border-amber-600' : 'bg-slate-50 border border-slate-200'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.is_active ? 'bg-white text-amber-500' : 'bg-white text-slate-300 border border-slate-100'}`}>
                                <Briefcase size={18} />
                            </div>
                            <div className="text-left">
                                <h4 className={`text-xs font-black tracking-tight ${formData.is_active ? 'text-white' : 'text-navy-deep'}`}>Active Status</h4>
                                <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${formData.is_active ? 'text-white/70' : 'text-slate-400'}`}>Visible on public portal</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                            className={`w-12 h-6 rounded-full relative transition-all ${formData.is_active ? 'bg-white/20' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${formData.is_active ? 'left-7 bg-white' : 'left-1 bg-white'}`} />
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
                        className="px-10 py-4 bg-navy-deep text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-navy-deep/20"
                    >
                        Save Position
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
        <div className="space-y-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-4">
                <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-200 shadow-sm w-fit shrink-0">
                    <button
                        onClick={() => setView('jobs')}
                        className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'jobs' ? 'bg-navy-deep text-white shadow-md' : 'text-slate-400 hover:text-navy-deep'}`}
                    >
                        Positions
                    </button>
                    <button
                        onClick={() => setView('applications')}
                        className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'applications' ? 'bg-navy-deep text-white shadow-md' : 'text-slate-400 hover:text-navy-deep'}`}
                    >
                        Applicants
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-auto">
                        <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-navy-deep transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 pl-14 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-navy-deep placeholder:text-slate-300 outline-none shadow-sm transition-all focus:border-navy-deep/20"
                        />
                    </div>
                    {view === 'jobs' && (
                        <button
                            onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
                            className="group flex items-center justify-center gap-3 w-full md:w-auto px-8 py-3 bg-navy-deep text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-navy-deep/10 active:scale-95 shrink-0"
                        >
                            <Plus size={16} className="transition-transform group-hover:rotate-90" />
                            <span>New Opening</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm min-h-[600px] relative">
                <div className="flex items-center gap-2.5 mb-8 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {view === 'jobs' ? `Active Pipeline: ${filteredJobs.length} Positions` : `Ingestion Queue: ${filteredApplications.length} Candidates`}
                    </span>
                </div>

                {view === 'jobs' ? (
                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        {currentJobs.map((job) => (
                            <div key={job.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all group/item shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-6 text-left">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${job.is_active ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-300'}`}>
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <p className="font-bold text-navy-deep text-lg tracking-tight leading-tight">{job.title}</p>
                                            {!job.is_active && <span className="text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 px-2.5 py-0.5 rounded-full">Deactivated</span>}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            <span className="flex items-center gap-1.5"><Building2 size={12} className="text-slate-300" /> {job.department}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-300" /> {job.location}</span>
                                            <span className="px-2.5 py-0.5 bg-navy-deep text-white rounded-full">{job.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 justify-end opacity-0 group-hover/item:opacity-100 transition-all">
                                    <button
                                        onClick={() => { setEditingJob(job); setIsModalOpen(true); }}
                                        className="w-10 h-10 flex items-center justify-center bg-white text-navy-deep rounded-xl shadow-sm border border-slate-200 hover:border-amber-500 hover:text-amber-500 transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({
                                            isOpen: true,
                                            type: 'job',
                                            id: job.id,
                                            title: 'Purge Position',
                                            message: `Initialize removal sequence for "${job.title}"?`
                                        })}
                                        className="w-10 h-10 flex items-center justify-center bg-white text-red-400 rounded-xl shadow-sm border border-slate-200 hover:border-red-500 hover:text-red-600 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        {currentApplications.map((app) => (
                            <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all group/item shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-navy-deep flex items-center justify-center font-bold text-white text-lg group-hover/item:bg-amber-500 transition-colors shadow-sm">
                                        {app.full_name.charAt(0)}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="font-bold text-navy-deep text-lg tracking-tight mb-1">{app.full_name}</p>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-amber-500" />
                                                {app.position}
                                            </span>
                                            <a href={`mailto:${app.email}`} className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-navy-deep transition-colors bg-amber-50 px-2 py-0.5 rounded-full">{app.email}</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-3 shrink-0 opacity-0 group-hover/item:opacity-100 transition-all">
                                    <a
                                        href={app.resume_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-2.5 bg-white text-navy-deep border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-deep hover:text-white transition-all shadow-sm"
                                    >
                                        Resume
                                    </a>
                                    <button
                                        onClick={() => setConfirmModal({
                                            isOpen: true,
                                            type: 'application',
                                            id: app.id,
                                            resumeUrl: app.resume_url,
                                            title: 'Purge Applicant',
                                            message: `Remove candidate "${app.full_name}" from database?`
                                        })}
                                        className="w-10 h-10 flex items-center justify-center bg-white text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl border border-slate-200 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(view === 'jobs' ? currentJobs : currentApplications).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-40 opacity-20 grayscale">
                        <Briefcase size={80} className="mb-6" />
                        <p className="text-[12px] font-black uppercase tracking-[0.5em]">No Data Synced</p>
                    </div>
                )}
            </div>

            {/* Pagination nodes could go here like in ContentSection if needed */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-1">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-navy-deep"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentPage / (Math.ceil((view === 'jobs' ? filteredJobs.length : filteredApplications.length) / itemsPerPage) || 1)) * 100}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Page {currentPage} <span className="mx-2 opacity-30">/</span> {Math.ceil((view === 'jobs' ? filteredJobs.length : filteredApplications.length) / itemsPerPage) || 1}
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
                        disabled={currentPage === (Math.ceil((view === 'jobs' ? filteredJobs.length : filteredApplications.length) / itemsPerPage) || 1)}
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil((view === 'jobs' ? filteredJobs.length : filteredApplications.length) / itemsPerPage) || 1, prev + 1))}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all text-navy-deep active:scale-95 shadow-sm"
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
