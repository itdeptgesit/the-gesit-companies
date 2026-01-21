import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Briefcase, FileText, MapPin, Building2, X, AlertCircle } from "lucide-react";
import { useCareer, type Career } from "../context/CareerContext";

const CareerPage = () => {
    const { jobs, submitApplication, loading: jobsLoading } = useCareer();
    const [selectedJob, setSelectedJob] = useState<Career | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    // Form State
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        resume: null as File | null,
        message: "",
        position: ""
    });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const handleApplyClick = (job: Career | null = null) => {
        setSelectedJob(job);
        setForm(prev => ({ ...prev, position: job ? job.title : "" }));
        setIsApplying(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // 1MB Limit Validation
            if (file.size > 1024 * 1024) {
                alert("File size exceeds 1MB. Please upload a smaller file.");
                e.target.value = ""; // Reset input
                return;
            }
            setForm({ ...form, resume: file });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Spam Check: Simple Rate Limiting (5 minutes cooldown)
        const contentLastSubmit = localStorage.getItem('career_last_submit');
        if (contentLastSubmit) {
            const lastTime = parseInt(contentLastSubmit);
            const now = Date.now();
            if (now - lastTime < 5 * 60 * 1000) { // 5 minutes
                alert("You have already submitted an application recently. Please try again in a few minutes.");
                return;
            }
        }

        if (!form.resume) {
            alert("Please upload your CV.");
            return;
        }

        try {
            setSubmitStatus('uploading');
            await submitApplication({
                full_name: form.full_name,
                email: form.email,
                phone: form.phone,
                position: form.position,
                message: form.message,
                resume_url: "", // handled by context
                linkedin_profile: ""
            }, form.resume);

            // Set cooldown
            localStorage.setItem('career_last_submit', Date.now().toString());

            setSubmitStatus('success');
            setTimeout(() => {
                setIsApplying(false);
                setSubmitStatus('idle');
                setForm({
                    full_name: "",
                    email: "",
                    phone: "",
                    resume: null,
                    message: "",
                    position: ""
                });
            }, 2000);
        } catch (err: any) {
            console.error(err);
            setSubmitStatus('error');
            setErrorMessage(err.message || "Failed to submit application.");
        }
    };


    return (
        <div className="bg-white min-h-screen text-navy-deep font-body">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="career/cover.png" alt="Join Gesit" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-navy-deep/60 backdrop-blur-[2px]"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <span className="text-[#BC9C33] font-bold uppercase tracking-[.6em] text-xs mb-6 block">Join Our Legacy</span>
                        <h1 className="text-white text-5xl md:text-8xl font-display leading-tight mb-8">
                            Empowering <br /> <span className="text-[#BC9C33]">Growth.</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
                        <motion.div {...fadeIn}>
                            <h2 className="text-4xl md:text-5xl font-display leading-[1.2] mb-8">
                                Exceptional people <br /> make an exceptional <br /> <span className="text-[#BC9C33]">company.</span>
                            </h2>
                            <div className="w-16 h-1 bg-[#BC9C33]"></div>
                        </motion.div>
                        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="space-y-8">
                            <p className="text-slate-500 text-xl font-light leading-relaxed">
                                At The Gesit Companies, we believe that the strength of our organization lies in the collective talent, passion, and integrity of our team members.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Open Positions Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="text-[#BC9C33] font-bold uppercase tracking-[.4em] text-xs mb-3 block">Career Opportunities</span>
                        <h2 className="text-4xl font-display text-navy-deep">Current Openings</h2>
                    </div>

                    <div className="grid gap-6">
                        {jobsLoading ? (
                            <p className="text-center text-slate-400">Loading positions...</p>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                                <h3 className="text-lg font-display text-navy-deep mb-2">No Open Positions</h3>
                                <p className="text-slate-400 font-light">We don't have active openings right now. Please check back later for future opportunities.</p>
                            </div>
                        ) : (
                            jobs.filter(j => j.is_active && (!j.expires_at || new Date(j.expires_at).getTime() + 86400000 > Date.now())).map((job) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#BC9C33]/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div>
                                        <h3 className="text-2xl font-display text-navy-deep mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                            <span className="flex items-center gap-1"><Building2 size={14} className="text-[#BC9C33]" /> {job.department}</span>
                                            <span className="flex items-center gap-1"><MapPin size={14} className="text-[#BC9C33]" /> {job.location}</span>
                                            <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-500">{job.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        {job.linkedin_url ? (
                                            <a
                                                href={job.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-[#0077b5] text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-[#005582] transition-colors"
                                            >
                                                Apply on LinkedIn
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => handleApplyClick(job)}
                                                className="px-6 py-3 bg-[#BC9C33] text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-navy-deep transition-all"
                                            >
                                                Apply Now
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>


            {/* Application Modal */}
            <AnimatePresence>
                {isApplying && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
                        >
                            <button
                                onClick={() => setIsApplying(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
                            >
                                <X size={24} className="text-slate-400" />
                            </button>

                            <div className="p-10 md:p-12">
                                {submitStatus === 'success' ? (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                            <Shield size={40} />
                                        </div>
                                        <h3 className="text-2xl font-display text-navy-deep mb-2">Application Received!</h3>
                                        <p className="text-slate-500">Thank you. We will review your profile shortly.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-8">
                                            <span className="text-[#BC9C33] font-bold uppercase tracking-[.2em] text-[10px] mb-2 block">Application Form</span>
                                            <h3 className="text-3xl font-display text-navy-deep">
                                                {selectedJob ? `Apply for ${selectedJob.title}` : "General Application"}
                                            </h3>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name *</label>
                                                    <input required type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full border-b border-slate-200 py-2 focus:border-[#BC9C33] outline-none text-sm transition-colors" placeholder="John Doe" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address *</label>
                                                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border-b border-slate-200 py-2 focus:border-[#BC9C33] outline-none text-sm transition-colors" placeholder="email@example.com" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">WhatsApp / Phone *</label>
                                                    <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border-b border-slate-200 py-2 focus:border-[#BC9C33] outline-none text-sm transition-colors" placeholder="+62..." />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Position</label>
                                                    <input required type="text" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full border-b border-slate-200 py-2 focus:border-[#BC9C33] outline-none text-sm transition-colors" placeholder={selectedJob ? selectedJob.title : "Desired Position"} readOnly={!!selectedJob} />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CV / Resume (PDF, Max 1MB) *</label>
                                                <div className="relative group">
                                                    <input required type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                    <div className={`w-full border-2 border-dashed rounded-xl py-6 text-center transition-all flex flex-col items-center justify-center gap-2 ${form.resume ? 'border-[#BC9C33] bg-[#BC9C33]/5' : 'border-slate-200 group-hover:border-[#BC9C33]'}`}>
                                                        <FileText size={24} className={form.resume ? 'text-[#BC9C33]' : 'text-slate-300'} />
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            {form.resume ? form.resume.name : "Click or Drag to Upload PDF"}
                                                        </p>
                                                        <p className="text-[9px] text-slate-300 uppercase tracking-widest">Max File Size: 1 MB</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Message (Optional)</label>
                                                <textarea rows={2} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full border-b border-slate-200 py-2 focus:border-[#BC9C33] outline-none text-sm transition-colors resize-none" placeholder="Briefly tell us about yourself..."></textarea>
                                            </div>

                                            {submitStatus === 'error' && (
                                                <div className="p-4 bg-red-50 text-red-500 text-xs rounded-xl flex items-center gap-2">
                                                    <AlertCircle size={16} /> {errorMessage}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={submitStatus === 'uploading'}
                                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-[.4em] text-[10px] shadow-xl transition-all ${submitStatus === 'uploading' ? 'bg-slate-300 cursor-not-allowed' : 'bg-navy-deep text-white hover:bg-[#BC9C33]'}`}
                                            >
                                                {submitStatus === 'uploading' ? 'Uploading...' : 'Submit Application'}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareerPage;
