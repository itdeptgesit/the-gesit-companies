import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ChevronRight,
    Plus,
    ExternalLink,
    TrendingUp,
    ShieldCheck,
    Zap,
    Users,
    Newspaper,
    MousePointer2
} from "lucide-react";
import { useNews } from "../../context/NewsContext";
import { useCareer } from "../../context/CareerContext";
import { supabase } from "../../lib/supabase";
import TrendChart from "./TrendChart";
import { useToast } from "../../context/ToastContext";

const OverviewSection = ({ visitorCount, onNavigate }: { visitorCount: number, onNavigate: (tab: string) => void }) => {
    const { newsItems, loading: newsLoading } = useNews();
    const { applications, loading: careerLoading, fetchApplications } = useCareer();
    const [dailyData, setDailyData] = useState<any[]>([]);
    const { showToast } = useToast();

    useEffect(() => {
        fetchApplications();
        fetchDailyStats();
    }, []);

    const fetchDailyStats = async () => {
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const { data } = await supabase
                .from('daily_stats')
                .select('*')
                .gte('date', sevenDaysAgo.toISOString().split('T')[0])
                .order('date', { ascending: true });

            if (data) setDailyData(data);
        } catch (error) {
            console.error("Error fetching daily stats:", error);
        }
    };

    const recentApps = applications.slice(0, 4);

    return (
        <div className="space-y-12 pb-16">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={() => onNavigate('news')}
                    className="flex items-center gap-3 px-8 py-3.5 bg-navy-deep text-white rounded-[6px] font-bold text-[11px] uppercase tracking-widest hover:bg-[#BC9C33] transition-all active:scale-95 group shadow-xl shadow-navy-deep/10"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" /> New Article
                </button>
                <button
                    onClick={() => onNavigate('careers')}
                    className="flex items-center gap-3 px-8 py-3.5 bg-white border border-slate-200 text-navy-deep rounded-[6px] font-bold text-[11px] uppercase tracking-widest hover:border-navy-deep transition-all shadow-sm active:scale-95"
                >
                    <Plus size={16} /> New Job Post
                </button>
                <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block" />
                <a href="/" target="_blank" className="flex items-center gap-3 px-8 py-3.5 bg-white border border-slate-200 text-slate-400 rounded-[6px] font-bold text-[11px] uppercase tracking-widest hover:text-navy-deep hover:border-slate-300 transition-all shadow-sm active:scale-95">
                    <ExternalLink size={16} /> View Site
                </a>
            </div>

            {/* Premium Dashboard Hero */}
            <div className="bg-[#0A1A35] rounded-[6px] p-8 md:p-12 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(10,26,53,0.3)] ring-1 ring-white/10">
                {/* Dynamic Background Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BC9C33]/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Title & Main Stats */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-[1px] bg-[#BC9C33]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#BC9C33]">Executive Console</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[0.9] font-display">
                                Dashboard <span className="text-white/20 block md:inline font-light italic">Intelligence</span>
                            </h2>
                            <p className="text-white/40 text-sm font-medium tracking-wide max-w-md border-l border-white/10 pl-4 py-1">
                                Real-time operational overview and visitor engagement metrics for The Gesit Companies.
                            </p>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div className="space-y-3 group cursor-default">
                                <div className="flex items-center gap-2 text-white/30 group-hover:text-white transition-colors">
                                    <Users size={12} />
                                    <p className="text-[9px] font-black uppercase tracking-widest">Active Applicants</p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-white">{careerLoading ? '...' : applications.length}</p>
                                    <span className="text-[10px] font-bold text-emerald-400">+12%</span>
                                </div>
                            </div>
                            <div className="space-y-3 group cursor-default">
                                <div className="flex items-center gap-2 text-white/30 group-hover:text-white transition-colors">
                                    <Newspaper size={12} />
                                    <p className="text-[9px] font-black uppercase tracking-widest">News Inventory</p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-white">{newsLoading ? '...' : newsItems.length}</p>
                                    <span className="text-[10px] font-bold text-white/20">Active</span>
                                </div>
                            </div>
                            <div className="space-y-3 group cursor-default col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                                <div className="flex items-center gap-2 text-[#BC9C33]/60 group-hover:text-[#BC9C33] transition-colors">
                                    <MousePointer2 size={12} />
                                    <p className="text-[9px] font-black uppercase tracking-widest">Global Reach</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-4xl font-black text-[#BC9C33]">{(visitorCount || 0).toLocaleString()}</p>
                                    <button
                                        onClick={async () => {
                                            const { trackVisitor } = await import("../../lib/tracking");
                                            const result = await trackVisitor(true);
                                            if (result.success) {
                                                showToast("Success: Tracking signal sent to production.", "success");
                                                fetchDailyStats();
                                            }
                                        }}
                                        className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-[#BC9C33] hover:text-white rounded-[6px] text-white/20 transition-all active:scale-95"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Analytics & Status */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8 h-full">
                        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[6px] p-8 border border-white/5 relative group hover:bg-white/[0.05] transition-all duration-700 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-[#BC9C33]/10 rounded-[6px] text-[#BC9C33]">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#BC9C33]">Traffic Analytics</p>
                                        <h4 className="text-sm font-bold text-white">7-Day Engagement Trend</h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-[6px] bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-500/80">LIVE</span>
                                    </div>
                                </div>
                            </div>

                            <TrendChart data={dailyData} />

                            {/* Status Sub-grid */}
                            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                                <div className="p-5 bg-white/[0.03] rounded-[6px] border border-white/5 flex items-center gap-4 group/status transition-all hover:bg-white/[0.06]">
                                    <div className="w-10 h-10 rounded-[6px] bg-[#BC9C33]/5 flex items-center justify-center text-[#BC9C33] group-hover/status:scale-110 transition-transform">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1.5">Gateway</p>
                                        <p className="text-xs font-black text-white">Encrypted</p>
                                    </div>
                                </div>
                                <div className="p-5 bg-white/[0.03] rounded-[6px] border border-white/5 flex items-center gap-4 group/status transition-all hover:bg-white/[0.06]">
                                    <div className="w-10 h-10 rounded-[6px] bg-emerald-500/5 flex items-center justify-center text-emerald-500 group-hover/status:scale-110 transition-transform">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1.5">System</p>
                                        <p className="text-xs font-black text-white">Optimized</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clean Activity Feed */}
            <div className="space-y-8 px-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[6px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-navy-deep">
                            <Users size={18} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-navy-deep tracking-tight">Recent Talent Inquiries</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Latest applicants from the career portal</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onNavigate('careers')}
                        className="px-6 py-2.5 bg-slate-50 text-navy-deep rounded-[6px] text-[10px] font-black uppercase tracking-wider hover:bg-navy-deep hover:text-white transition-all shadow-sm"
                    >
                        Directory
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {recentApps.length > 0 ? (
                        recentApps.map((app, idx) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => onNavigate('careers')}
                                className="bg-white p-6 rounded-[6px] border border-slate-100 flex items-center justify-between hover:border-[#BC9C33]/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group cursor-pointer"
                            >
                                <div className="flex items-center gap-8">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-[6px] overflow-hidden p-0.5 bg-gradient-to-br from-slate-200 to-white group-hover:from-[#BC9C33] transition-all duration-700">
                                            <img src={`https://ui-avatars.com/api/?name=${app.full_name}&background=103065&color=fff&bold=true`} className="w-full h-full object-cover rounded-[6px]" alt="" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-[6px] flex items-center justify-center shadow-md border border-slate-100">
                                            <div className="w-2.5 h-2.5 rounded-[6px] bg-blue-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-navy-deep tracking-tight font-display group-hover:text-[#BC9C33] transition-colors">{app.full_name}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="px-2 py-0.5 bg-navy-deep/5 text-navy-deep rounded-[6px] text-[8px] font-black uppercase tracking-widest">Candidate</span>
                                            <span className="w-1 h-1 rounded-[6px] bg-slate-200" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.position || 'External Inquiry'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="hidden md:block text-right">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5">Received</p>
                                        <p className="text-xs font-bold text-navy-deep">{new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-[6px] border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-[#BC9C33] group-hover:text-white group-hover:border-[#BC9C33] group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-500 transform group-hover:-rotate-12">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-24 text-center bg-white rounded-[6px] border-2 border-dashed border-slate-100">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={32} className="text-slate-200" />
                            </div>
                            <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-200">Waiting for inquiries</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
