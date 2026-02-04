import { motion } from "framer-motion";
import { useNews } from "../context/NewsContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LatestNewsSection = () => {
    const { newsItems, loading } = useNews();
    const latestNews = newsItems.filter(item => item.type === "news").slice(0, 3);

    if (loading || latestNews.length === 0) return null;

    return (
        <section className="py-32 bg-white overflow-hidden relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-[#BA9B32]"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[.4em] text-[#BA9B32]">Our Perspective</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-display text-navy-deep leading-tight">Latest News<br />& Insights</h2>
                    </div>
                    <Link
                        to="/news"
                        className="group flex items-center gap-4 px-10 py-5 bg-navy-deep text-white rounded-full font-bold text-[10px] uppercase tracking-[.3em] hover:bg-[#BA9B32] transition-all shadow-xl shadow-navy-deep/10 hover:shadow-[#BA9B32]/20"
                    >
                        View All Stories
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#BA9B32] transition-all">
                            <ArrowRight size={16} />
                        </div>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {latestNews.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link to={`/news/${item.id}`} className="group block">
                                <div className="relative aspect-video overflow-hidden rounded-3xl bg-slate-100 mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1)"
                                        loading="lazy"
                                    />
                                    {/* Glass Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="absolute top-6 left-6">
                                        <span className="px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-navy-deep shadow-sm">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-5 px-2">
                                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.25em] text-slate-400">
                                        {item.date}
                                    </div>
                                    <div className="relative">
                                        <h3 className="text-2xl font-display leading-tight text-navy-deep group-hover:text-[#BA9B32] transition-colors duration-500 line-clamp-2 pb-2">
                                            {item.title}
                                        </h3>
                                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#BA9B32] group-hover:w-1/4 transition-all duration-500"></div>
                                    </div>
                                    <p className="text-slate-500 text-[15px] leading-relaxed line-clamp-3 font-normal font-body">
                                        {item.excerpt}
                                    </p>
                                    <div className="pt-4 flex items-center gap-3 text-[#BA9B32] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Read Article</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestNewsSection;
