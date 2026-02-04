import { useEffect } from "react";
import {
    Eye,
    Newspaper,
    Users,
    TrendingUp,
    Clock,
    ChevronRight
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
        { label: "Total Visitors", value: visitorCount.toLocaleString(), icon: <Eye />, trend: "Real-time" },
        { label: "Active News", value: newsLoading ? "..." : newsItems.filter(i => i.type === 'news').length.toString(), icon: <Newspaper />, trend: "Official" },
        { label: "New Applications", value: careerLoading ? "..." : applications.length.toString(), icon: <Users />, trend: "Career Portal" },
    ];

    const recentApps = applications.slice(0, 3);

    return (
        <div className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 md:p-8 rounded-card border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative group text-left">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity whitespace-nowrap overflow-hidden text-navy-deep">
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400 mb-2 md:mb-4">{stat.label}</p>
                        <div className="text-3xl md:text-4xl font-display mb-2 md:mb-4">{stat.value}</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#BA9B32] uppercase tracking-widest">
                            {idx < 2 ? <TrendingUp size={12} /> : null} {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 bg-white rounded-card-sm p-6 md:p-10 border border-slate-100 shadow-sm text-left">
                    <h3 className="text-xl font-display mb-6 md:mb-8">Recent Activity</h3>
                    <div className="space-y-4 md:space-y-6">
                        {recentApps.length > 0 ? (
                            recentApps.map((app) => (
                                <div key={app.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-card-sm px-4 -mx-4 group">
                                    <div className="flex items-center gap-4 md:gap-6 text-left min-w-0">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-card-sm bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#BA9B32] group-hover:text-white transition-all shrink-0">
                                            <Clock size={18} className="md:w-5 md:h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm truncate">New Career Application: {app.position}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 truncate">
                                                {app.full_name} • {new Date(app.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-[#BA9B32] hover:bg-[#BA9B32]/10 rounded-card-sm transition-all shrink-0">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <p className="text-sm font-light uppercase tracking-widest italic">No recent activity found</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-navy-deep rounded-card-sm p-6 md:p-10 text-white relative overflow-hidden shadow-2xl text-left">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#BA9B32]/20 to-transparent"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-display mb-6">System Status</h3>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-[.3em] mb-8 md:mb-10">All Modules Operational</p>
                        <div className="space-y-4 md:space-y-6">
                            {[
                                { name: "Database", status: "Live" },
                                { name: "Media Server", status: "Live" },
                                { name: "Application API", status: "Live" }
                            ].map((service) => (
                                <div key={service.name} className="flex items-center justify-between bg-white/5 p-4 rounded-card-sm hover:bg-white/10 transition-colors">
                                    <span className="text-xs font-bold uppercase tracking-widest">{service.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                        <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">{service.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
