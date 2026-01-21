import { motion } from "framer-motion";
import { useNews } from "../context/NewsContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LatestNewsSection = () => {
    const { newsItems, loading } = useNews();
    const latestNews = newsItems.filter(item => item.type === "news").slice(0, 3);

    if (loading || latestNews.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <span className="text-[#BA9B32] font-bold uppercase tracking-[.4em] text-xs mb-4 block">
                            Stay Informed
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display">Latest News</h2>
                    </div>
                    <Link
                        to="/news"
                        className="hidden md:flex items-center gap-3 text-xs font-bold uppercase tracking-widest hover:text-[#BA9B32] transition-colors"
                    >
                        View All Stories <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {latestNews.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="group"
                        >
                            <Link to={`/news/${item.id}`} className="block">
                                <div className="aspect-[16/10] overflow-hidden rounded-xl mb-8 shadow-lg bg-slate-200">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-[1s] ease-out"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#BA9B32]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#BA9B32]"></span>
                                        {item.date}
                                    </div>
                                    <h3 className="text-2xl font-display leading-tight text-navy-deep group-hover:text-[#BA9B32] transition-colors duration-300 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-[15px] leading-relaxed line-clamp-3 font-normal">
                                        {item.excerpt}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 md:hidden">
                    <Link
                        to="/news"
                        className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest py-4 border border-slate-200 rounded-full"
                    >
                        View All Stories <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestNewsSection;
