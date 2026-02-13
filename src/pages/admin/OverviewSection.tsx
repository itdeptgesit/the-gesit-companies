import { useEffect } from "react";
import { motion } from "framer-motion";
import {
    ChevronRight,
    Plus,
    ExternalLink
} from "lucide-react";
import { useNews } from "../../context/NewsContext";
import { useCareer } from "../../context/CareerContext";

const OverviewSection = ({ visitorCount, onNavigate }: { visitorCount: number, onNavigate: (tab: string) => void }) => {
    const { newsItems, loading: newsLoading } = useNews();
    const { applications, loading: careerLoading, fetchApplications } = useCareer();

    useEffect(() => {
        fetchApplications();
    }, []);

    const recentApps = applications.slice(0, 4);

    return (
        <div className="space-y-12 pb-16">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={() => onNavigate('news')}
                    className="flex items-center gap-3 px-8 py-3.5 bg-navy-deep text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-navy-deep/90 transition-all active:scale-95 group shadow-lg shadow-navy-deep/5"
                >
                    <Plus size={16} /> Create News
                </button>
                <button
                    onClick={() => onNavigate('careers')}
                    className="flex items-center gap-3 px-8 py-3.5 bg-white border border-slate-200 text-navy-deep rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:border-navy-deep transition-all shadow-sm active:scale-95"
                >
                    <Plus size={16} /> Post Career
                </button>
                <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block" />
                <a href="/" target="_blank" className="flex items-center gap-3 px-8 py-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:text-navy-deep hover:border-slate-300 transition-all shadow-sm active:scale-95">
                    <ExternalLink size={16} /> View Site
                </a>
            </div>

            {/* Modern System Status Hero */}
            <div className="bg-navy-deep rounded-[2.5rem] p-10 md:p-12 text-white relative overflow-hidden ring-1 ring-white/10 shadow-3xl shadow-navy-deep/20">
                {/* Clean Background Elements */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#BC9C33]/10 blur-[100px] rounded-full -mr-40 -mt-40" />
                <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-white/5 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-8 space-y-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#BC9C33] mb-4 block">System Logistics</span>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none font-display">
                                Status: <span className="text-white">Active</span>
                            </h2>
                            <p className="text-white/40 text-lg md:text-xl font-medium tracking-normal mt-4 max-w-md">
                                All core systems are synchronized and performing within optimal parameters.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-12 pt-4">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Applicants</p>
                                <p className="text-3xl font-black text-white">{careerLoading ? '...' : applications.length}</p>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden sm:block mt-2" />
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Articles</p>
                                <p className="text-3xl font-black text-white">{newsLoading ? '...' : newsItems.length}</p>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden sm:block mt-2" />
                            <div className="space-y-2 group/visit relative">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Total Visits</p>
                                <div className="flex items-center gap-3">
                                    <p className="text-3xl font-black text-[#BC9C33]">{(visitorCount || 0).toLocaleString()}</p>
                                    <button
                                        onClick={async () => {
                                            const { trackVisitor } = await import("../../lib/tracking");
                                            const result = await trackVisitor(true);
                                            if (result.success) {
                                                alert("Success: PING SENT!");
                                            } else {
                                                alert("Error: " + JSON.stringify(result.error));
                                            }
                                        }}
                                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/20 hover:text-[#BC9C33] transition-all opacity-0 group-hover/visit:opacity-100"
                                        title="Debug: Force Increment"
                                    >
                                        <Plus size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex justify-end">
                        <div className="grid grid-cols-1 gap-4 w-full max-w-[260px]">
                            <div className="p-6 bg-white/[0.04] backdrop-blur-xl rounded-[24px] border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-all duration-500">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Network Node</p>
                                    <p className="text-lg font-black tracking-tight">Public Cloud</p>
                                </div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            </div>
                            <div className="p-6 bg-white/[0.04] backdrop-blur-xl rounded-[24px] border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-all duration-500">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Database Engine</p>
                                    <p className="text-lg font-black tracking-tight">Synchronized</p>
                                </div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#BC9C33] shadow-[0_0_15px_rgba(188,156,51,0.5)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clean Activity Feed */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#BC9C33]" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Activity stream</h3>
                    </div>
                    <button
                        onClick={() => onNavigate('careers')}
                        className="text-[10px] font-black uppercase tracking-widest text-navy-deep hover:text-[#BC9C33] transition-colors"
                    >
                        Review all applicants
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {recentApps.length > 0 ? (
                        recentApps.map((app) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                onClick={() => onNavigate('careers')}
                                className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 group cursor-pointer"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-0.5 group-hover:ring-4 group-hover:ring-slate-50 transition-all duration-500">
                                        <img src={`https://ui-avatars.com/api/?name=${app.full_name}&background=103065&color=fff&bold=true`} className="w-full h-full object-cover rounded-[16px]" alt="" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-navy-deep tracking-tight font-display">{app.full_name}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[10px] font-black text-[#BC9C33] uppercase tracking-widest">Applicant</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.position || 'External Inquiry'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <p className="text-[11px] font-bold text-slate-300 hidden md:block">{new Date(app.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                                    <div className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-navy-deep group-hover:text-white group-hover:border-navy-deep transition-all transform group-hover:translate-x-1 duration-500">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                            <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-200">Terminal Quiet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
