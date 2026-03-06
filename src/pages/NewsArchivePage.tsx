import { motion } from "framer-motion";
import { useNews } from "../context/NewsContext";
// @ts-ignore
import { getOptimizedNewsImage } from "../lib/supabase";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Skeleton from "../components/Skeleton";

/**
 * NewsArchivePage - Comprehensive list of all insights and updates.
 * Features a clean, editorial layout with filtering and sorting.
 */
const NewsArchivePage = () => {
    const { newsItems, loading, error } = useNews();

    // Filter news and csr items
    const allArticles = newsItems.filter(item => item.type === "news" || item.type === "csr");

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen pt-40">
                <div className="container mx-auto px-6 max-w-7xl">
                    <Skeleton className="h-12 w-64 mb-16" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-6">
                                <Skeleton className="aspect-video w-full rounded-xl" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white min-h-screen pt-40 text-center px-6">
                <p className="text-red-500 font-bold uppercase tracking-widest mb-4">Service Unavailable</p>
                <p className="text-slate-500 text-sm max-w-md mx-auto">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen text-navy-deep font-body">
            {/* Header Section */}
            <header className="pt-48 pb-24 bg-navy-deep relative overflow-hidden">
                {/* Subtle background texture/gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-[#103065] to-navy-deep opacity-50" />

                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <motion.div {...fadeIn} className="max-w-4xl">
                        <Link
                            to="/news"
                            className="flex items-center gap-2 text-[#BC9C33] font-bold uppercase tracking-[.3em] text-[10px] mb-8 hover:gap-4 transition-all"
                        >
                            <ArrowLeft size={14} /> Back to Featured
                        </Link>
                        <h1
                            className="text-white text-4xl md:text-6xl leading-[1.1] mb-6"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            News Archive
                        </h1>
                    </motion.div>
                </div>
            </header>

            {/* List Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {allArticles.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group"
                            >
                                <Link to={`/news/${item.id}`} className="block">
                                    <div className="aspect-[16/10] overflow-hidden rounded-xl shadow-lg mb-8 relative">
                                        <img
                                            src={getOptimizedNewsImage(item.image, 800, 75)}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 grayscale-[20%] group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-navy-deep/10 group-hover:bg-transparent transition-colors duration-500"></div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[.4em] text-[#BC9C33] mb-4 block">
                                        {item.date} — {item.category}
                                    </span>
                                    <h3
                                        className="text-xl md:text-2xl leading-snug mb-6 group-hover:text-[#BC9C33] transition-colors"
                                        style={{ fontFamily: 'Georgia, serif' }}
                                    >
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-navy-deep/40 group-hover:text-navy-deep transition-colors">
                                        Explore Story
                                        <div className="w-8 h-8 rounded-full border border-navy-deep/10 flex items-center justify-center group-hover:bg-[#BC9C33] group-hover:border-[#BC9C33] group-hover:text-white transition-all duration-300">
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {allArticles.length === 0 && (
                        <div className="text-center py-40">
                            <p className="text-slate-400 font-bold uppercase tracking-widest">No articles found.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default NewsArchivePage;
