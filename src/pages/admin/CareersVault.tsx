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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-card-sm w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-display">{initialData ? 'Edit Position' : 'Post New Job'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Position Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-input py-3 px-4 focus:outline-none focus:border-[#BA9B32] transition-colors"
                                placeholder="e.g. Senior Accountant"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-input py-3 px-4 focus:outline-none focus:border-[#BA9B32] transition-colors"
                                placeholder="e.g. Finance"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-input py-3 px-4 focus:outline-none focus:border-[#BA9B32] transition-colors"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employment Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-input py-3 px-4 focus:outline-none focus:border-[#BA9B32] transition-colors appearance-none"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Job Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-100 rounded-input py-3 px-4 focus:outline-none focus:border-[#BA9B32] transition-colors resize-none"
                            placeholder="Describe the role responsibilities..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Key Requirements</label>
                        <textarea
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-100 rounded-input py-3 px-4 focus:outline-none focus:border-[#BA9B32] transition-colors resize-none"
                            placeholder="List skills and qualifications..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">LinkedIn URL (Optional)</label>
                            <input
                                type="text"
                                value={formData.linkedin_url}
                                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-input py-3 px-4 focus:outline-none focus:border-[#BA9B32] transition-colors"
                                placeholder="https://linkedin.com/jobs/..."
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expiry Date</label>
                            <input
                                type="date"
                                value={formData.expires_at}
                                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-input py-3 px-4 focus:outline-none focus:border-[#BA9B32] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <button
                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${formData.is_active ? 'bg-green-500' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${formData.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-sm font-bold text-navy-deep">{formData.is_active ? 'Active & Published' : 'Draft / Inactive'}</span>
                    </div>
                </div>
                <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50">
                    <button onClick={onClose} className="px-6 py-3 border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                    <button onClick={() => onSave(formData)} className="px-6 py-3 bg-[#BA9B32] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-navy-deep transition-all shadow-lg">Save Position</button>
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
        <div className="space-y-6 md:space-y-8">
            <div className="mb-2 text-left">
                <h3 className="text-lg font-display font-bold text-navy-deep uppercase tracking-widest">{view === 'jobs' ? 'Position Management' : 'Candidate Applications'}</h3>
            </div>
            <div className="bg-white p-6 md:p-10 rounded-xl border border-slate-100 shadow-sm min-h-[500px] md:min-h-[600px]">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
                    <div className="flex gap-2 md:gap-4 bg-slate-50 p-1.5 rounded-full border border-slate-100 w-full lg:w-auto">
                        <button
                            onClick={() => setView('jobs')}
                            className={`flex-1 lg:px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'jobs' ? 'bg-white shadow-md text-navy-deep' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Listings
                        </button>
                        <button
                            onClick={() => setView('applications')}
                            className={`flex-1 lg:px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'applications' ? 'bg-white shadow-md text-navy-deep' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Applicants
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
                        <div className="relative group w-full max-w-sm">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-full text-xs focus:outline-none w-full lg:w-64"
                            />
                        </div>
                        {view === 'jobs' && (
                            <button
                                onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
                                className="flex items-center justify-center gap-3 w-full md:w-auto px-6 py-3 bg-[#BA9B32] text-white rounded-full font-bold text-[10px] uppercase tracking-[.2em] hover:bg-navy-deep shadow-lg transition-all"
                            >
                                <Plus size={16} /> <span>Add Position</span>
                            </button>
                        )}
                    </div>
                </div>

                {view === 'jobs' ? (
                    <div className="space-y-4">
                        {currentJobs.map((job) => (
                            <div key={job.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 bg-slate-50/50 rounded-card-sm border border-transparent hover:border-[#BA9B32]/30 hover:bg-white transition-all group gap-4">
                                <div className="flex items-center gap-5 md:gap-8 text-left">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-card-sm border border-slate-200 flex items-center justify-center text-slate-300 shrink-0 shadow-sm group-hover:bg-[#BA9B32]/5 group-hover:text-[#BA9B32] transition-colors">
                                        <Briefcase size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-base md:text-lg text-navy-deep truncate">{job.title}</p>
                                        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <span className="flex items-center gap-1"><Building2 size={12} /> {job.department}</span>
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 justify-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    <button
                                        onClick={() => { setEditingJob(job); setIsModalOpen(true); }}
                                        className="p-3 bg-white md:bg-transparent border border-slate-100 md:border-0 text-slate-400 hover:text-[#BA9B32] rounded-card-sm transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({
                                            isOpen: true,
                                            type: 'job',
                                            id: job.id,
                                            title: 'Delete Position',
                                            message: `Are you sure you want to delete "${job.title}"?`
                                        })}
                                        className="p-3 bg-white md:bg-transparent border border-slate-100 md:border-0 text-slate-400 hover:text-red-500 rounded-card-sm transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentApplications.map((app) => (
                            <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 bg-slate-50/50 rounded-card-sm border border-transparent hover:border-[#BA9B32]/30 hover:bg-white transition-all group gap-4">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 flex items-center justify-center font-display font-bold text-slate-500 shrink-0">
                                        {app.full_name.charAt(0)}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="font-bold text-sm text-navy-deep truncate">{app.full_name}</p>
                                        <p className="text-xs text-slate-500 truncate">{app.position}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    <a href={`mailto:${app.email}`} className="text-xs text-slate-400 hover:text-[#BA9B32] truncate">{app.email}</a>
                                    <button
                                        onClick={() => setConfirmModal({
                                            isOpen: true,
                                            type: 'application',
                                            id: app.id,
                                            resumeUrl: app.resume_url,
                                            title: 'Delete Application',
                                            message: `Are you sure you want to delete the application for ${app.full_name}?`
                                        })}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
