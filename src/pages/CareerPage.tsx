import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Briefcase, FileText, MapPin, Building2, X, AlertCircle } from "lucide-react";
import { useCareer, type Career } from "../context/CareerContext";
import Skeleton from "../components/Skeleton";

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
        <div className="bg-slate-50 min-h-screen text-navy-deep font-body overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-1/2 h-full opacity-[0.03] pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="0" cy="200" r="300" stroke="currentColor" strokeWidth="1" />
                    <circle cx="0" cy="200" r="250" stroke="#BC9C33" strokeWidth="0.5" />
                    <circle cx="0" cy="600" r="200" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* 1. Cinematic Hero Section */}
            <section className="relative h-screen flex items-end overflow-hidden bg-[#103065]">
                <div className="absolute inset-0 z-0">
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, ease: "easeOut" }}
                        src="/career/bg.png"
                        alt="Join Gesit Career"
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay mirroring CSR/News */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#103065]/60 via-transparent to-[#103065]/40" />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 pb-16 md:pb-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="text-white text-5xl md:text-7xl leading-tight drop-shadow-md"
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontWeight: 400,
                            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        }}
                    >
                        Career
                    </motion.h1>
                </div>
            </section>

            {/* 2. Intro Statement Section - Gold Style */}
            <section className="bg-[#BC9C33] py-24 md:py-36">
                <div className="max-w-[1000px] mx-auto px-8 md:px-16 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="text-left"
                    >
                        <h2
                            className="text-3xl md:text-5xl leading-tight mb-10"
                            style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
                        >
                            At Gesit, our employees are our largest asset.
                        </h2>

                        <div className="flex gap-8 items-stretch pt-2">
                            {/* Vertical Line */}
                            <div className="w-[1.5px] bg-white shrink-0"></div>

                            <p
                                className="text-white/95 text-lg md:text-[1.2rem] leading-[1.8] font-normal"
                                style={{ fontFamily: "'Source Sans Pro', sans-serif", fontWeight: 400 }}
                            >
                                We believe that we can reach our goal only through excellent performance and service to our customers provided by our valuable employees. We maintain and develop all employees through trainings, workshops, seminars, and mentoring programs, in order to bring the best standard for our company.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Open Positions Section */}
            <section className="py-32 bg-[#E3EAF4]">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-24">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[#BC9C33] font-bold uppercase tracking-[.4em] text-[12px] mb-4 block"
                        >
                            Explore Opportunities
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl text-[#103065]"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            Open Positions
                        </motion.h2>
                        <div className="w-20 h-px bg-[#BC9C33]/40 mx-auto mt-10"></div>
                    </div>

                    <div className="grid gap-8">
                        {jobsLoading ? (
                            <>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white p-10 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex-grow space-y-4">
                                            <Skeleton className="h-8 w-1/2" />
                                            <div className="flex gap-4">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-14 w-40 rounded-lg shrink-0" />
                                    </div>
                                ))}
                            </>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-slate-100 px-8 shadow-sm">
                                <Briefcase className="mx-auto text-[#BC9C33]/20 mb-6" size={64} />
                                <h3
                                    className="text-2xl text-[#103065] mb-4"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    No Open Positions
                                </h3>
                                <p
                                    className="text-slate-400 font-light max-w-md mx-auto"
                                    style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
                                >
                                    We don't have active openings right now. Please check back later or follow our social media for future opportunities.
                                </p>
                            </div>
                        ) : (
                            jobs.filter(j => j.is_active && (!j.expires_at || new Date(j.expires_at).getTime() + 86400000 > Date.now())).map((job) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-10 rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-[#BC9C33]/30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group flex flex-col md:flex-row md:items-center justify-between gap-8"
                                >
                                    <div className="flex-grow">
                                        <h3
                                            className="text-3xl text-[#103065] mb-4 group-hover:text-[#BC9C33] transition-colors"
                                            style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
                                        >
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-8 text-[12px] font-bold uppercase tracking-[0.2em] text-[#999]">
                                            <span className="flex items-center gap-2.5">
                                                <Building2 size={16} className="text-[#BC9C33]" />
                                                {job.department}
                                            </span>
                                            <span className="flex items-center gap-2.5">
                                                <MapPin size={16} className="text-[#BC9C33]" />
                                                {job.location}
                                            </span>
                                            <span className="text-[#BC9C33] bg-[#FCF4DC] px-4 py-1.5 rounded-full text-[10px]">
                                                {job.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        {job.linkedin_url ? (
                                            <a
                                                href={job.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-10 py-4 bg-[#0077b5] text-white rounded-lg font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#005582] transition-colors shadow-lg shadow-[#0077b5]/20"
                                            >
                                                Apply on LinkedIn
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => handleApplyClick(job)}
                                                className="px-10 py-5 bg-[#BC9C33] text-white rounded-lg font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-[#103065] transition-all duration-500 shadow-xl shadow-[#BC9C33]/20"
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
                            className="bg-white rounded-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
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
                                        <div className="mb-12 relative">
                                            <div className="absolute -left-12 top-0 w-1 h-20 bg-[#BC9C33] hidden md:block"></div>
                                            <span className="text-[#BC9C33] font-bold uppercase tracking-[.4em] text-[11px] mb-3 block">Application Form</span>
                                            <h3
                                                className="text-4xl text-[#103065]"
                                                style={{ fontFamily: 'Georgia, serif' }}
                                            >
                                                {selectedJob ? `Apply for ${selectedJob.title}` : "General Application"}
                                            </h3>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-2 group">
                                                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#999] transition-colors group-focus-within:text-[#BC9C33]">Full Name *</label>
                                                    <input required type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full border-b border-slate-200 py-4 focus:border-[#BC9C33] outline-none text-base transition-all focus:pl-1 font-body" placeholder="John Doe" />
                                                </div>
                                                <div className="space-y-2 group">
                                                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#999] transition-colors group-focus-within:text-[#BC9C33]">Email Address *</label>
                                                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border-b border-slate-200 py-4 focus:border-[#BC9C33] outline-none text-base transition-all focus:pl-1 font-body" placeholder="email@example.com" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-2 group">
                                                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#999] transition-colors group-focus-within:text-[#BC9C33]">WhatsApp / Phone *</label>
                                                    <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border-b border-slate-200 py-4 focus:border-[#BC9C33] outline-none text-base transition-all focus:pl-1 font-body" placeholder="+62..." />
                                                </div>
                                                <div className="space-y-2 group">
                                                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#999] transition-colors group-focus-within:text-[#BC9C33]">Position</label>
                                                    <input required type="text" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full border-b border-slate-200 py-4 focus:border-[#BC9C33] outline-none text-base transition-all focus:pl-1 bg-transparent font-body" placeholder={selectedJob ? selectedJob.title : "Desired Position"} readOnly={!!selectedJob} />
                                                </div>
                                            </div>

                                            <div className="space-y-4 group">
                                                <label className="text-[11px] font-bold uppercase tracking-widest text-[#999] transition-colors group-focus-within:text-[#BC9C33]">CV / Resume (PDF, Max 1MB) *</label>
                                                <div className="relative group/file">
                                                    <input required type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                    <div className={`w-full border-2 border-dashed rounded-xl py-12 text-center transition-all flex flex-col items-center justify-center gap-4 ${form.resume ? 'border-[#BC9C33] bg-[#FCF4DC]/20' : 'border-slate-100 bg-slate-50 group-hover/file:border-[#BC9C33] group-hover/file:bg-white'}`}>
                                                        <FileText size={40} className={form.resume ? 'text-[#BC9C33]' : 'text-slate-200'} />
                                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                                                            {form.resume ? form.resume.name : "Click or Drag to Upload PDF"}
                                                        </p>
                                                        <p className="text-[10px] text-[#BC9C33]/50 uppercase tracking-[0.2em] font-bold">Max File Size: 1 MB</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 group">
                                                <label className="text-[11px] font-bold uppercase tracking-widest text-[#999] transition-colors group-focus-within:text-[#BC9C33]">Message (Optional)</label>
                                                <textarea rows={2} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full border-b border-slate-200 py-4 focus:border-[#BC9C33] outline-none text-base transition-all focus:pl-1 resize-none bg-transparent font-body" placeholder="Briefly tell us about yourself..."></textarea>
                                            </div>

                                            {submitStatus === 'error' && (
                                                <div className="p-4 bg-red-50 text-red-500 text-xs rounded-card-sm flex items-center gap-2">
                                                    <AlertCircle size={16} /> {errorMessage}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={submitStatus === 'uploading'}
                                                className={`w-full py-6 rounded-lg font-bold uppercase tracking-[.4em] text-[11px] transition-all duration-500 relative overflow-hidden group shadow-2xl ${submitStatus === 'uploading' ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#103065] text-white hover:bg-[#BC9C33] shadow-[#103065]/20'}`}
                                            >
                                                <span className="relative z-10">{submitStatus === 'uploading' ? 'Uploading Application...' : 'Submit Application'}</span>
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
