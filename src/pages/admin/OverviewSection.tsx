import { useEffect } from "react";
import {
    Eye,
    Newspaper,
    Users,
    ChevronRight,
    TrendingUp,
    Zap,
    Sparkles
} from "lucide-react";
import { useNews } from "../../context/NewsContext";
import { useCareer } from "../../context/CareerContext";

const OverviewSection = ({ visitorCount }: { visitorCount: number }) => {
    const { newsItems, loading: newsLoading } = useNews();
    const { applications, loading: careerLoading, fetchApplications } = useCareer();

    useEffect(() => {
        fetchApplications();
    }, []);

    const stats = [
        {
            label: "Global Traffic",
            value: visitorCount && !isNaN(visitorCount) ? visitorCount.toLocaleString() : "0",
            icon: <Eye size={20} />,
            trend: "Live Feed",
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            label: "Media Assets",
            value: newsLoading ? "..." : newsItems.filter(i => i.type === 'news').length.toString(),
            icon: <Newspaper size={20} />,
            trend: "Vault",
            iconColor: "text-amber-600",
            bgColor: "bg-amber-50"
        },
        {
            label: "Talent Intake",
            value: careerLoading ? "..." : applications.length.toString(),
            icon: <Users size={20} />,
            trend: "Active",
            iconColor: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
    ];

    const recentApps = applications.slice(0, 4);

    return (
        <div className="space-y-8 pb-10">
            {/* Beneficial Summary / Smart Insight */}
            <div className="bg-navy-deep rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-navy-deep/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Smart Operational Insight</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight leading-tight">
                            Welcome back. You have <span className="text-amber-500">{careerLoading ? '...' : applications.length}</span> candidates in the pipeline.
                        </h2>
                        <p className="text-white/60 text-sm font-medium leading-relaxed">
                            Your ecosystem is currently stable. In the last cycle, {newsLoading ? '...' : newsItems.length} media assets were managed and platform traffic remains at {visitorCount.toLocaleString()} global interactions.
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-4">
                        <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-1 items-start min-w-[140px]">
                            <TrendingUp size={16} className="text-emerald-400 mb-1" />
                            <span className="text-2xl font-black">Stable</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Hub Status</span>
                        </div>
                        <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-1 items-start min-w-[140px]">
                            <Zap size={16} className="text-amber-400 mb-1" />
                            <span className="text-2xl font-black">{newsItems.length}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Active Assets</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md group relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center ${stat.iconColor} transition-transform duration-500 group-hover:scale-110`}>
                                {stat.icon}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${stat.bgColor} ${stat.iconColor} border border-transparent group-hover:border-current/10 transition-colors`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1 text-left">
                            <h3 className="text-3xl font-black text-navy-deep tracking-tight">{stat.value}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Performance Chart / Heatmap style placeholder */}
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm text-left relative group">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-navy-deep tracking-tight">System Diagnostic</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Operational load distribution</p>
                        </div>
                        <div className="flex gap-2">
                            {['24H', '7D', '30D'].map(p => (
                                <button key={p} className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${p === '7D' ? 'bg-navy-deep text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-7 sm:grid-cols-14 gap-2.5">
                        {Array.from({ length: 56 }).map((_, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded-[4px] transition-all duration-500 hover:scale-110 ${i % 7 === 0 ? 'bg-amber-400/30' :
                                    i % 4 === 0 ? 'bg-navy-deep/5' :
                                        i % 3 === 0 ? 'bg-blue-400/20' : 'bg-slate-50'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-8">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Peak Activity</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Baseline</span>
                            </div>
                        </div>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Status: Nominal</span>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm text-left relative group">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-navy-deep tracking-tight">Latest Inbound</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Global data stream</p>
                        </div>
                        <button className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-navy-deep transition-all">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentApps.length > 0 ? (
                            recentApps.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100 group/item">
                                    <div className="flex items-center gap-4 text-left min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                            <img src={`https://ui-avatars.com/api/?name=${app.full_name}&background=103065&color=fff&bold=true`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-navy-deep truncate tracking-tight">{app.full_name}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover/item:text-navy-deep transition-colors">{app.position || 'External'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{new Date(app.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-16 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">No activity detected</p>
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-10 py-4 border border-slate-100 bg-slate-50/50 text-navy-deep rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all active:scale-[0.98]">
                        Full Pipeline Access
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
