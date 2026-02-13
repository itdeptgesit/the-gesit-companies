import { useState } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    User,
    ArrowRight,
    ChevronRight,
    Calendar,
    Bookmark,
    ChevronLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

/**
 * NewsPage - Premium Editorial Design (Data Driven Hero)
 */

import { useNews } from "../context/NewsContext";
// @ts-ignore
import { getOptimizedNewsImage } from "../lib/supabase";
import Skeleton from "../components/Skeleton";

const NewsPage = () => {
    const { newsItems, loading, error } = useNews();
    const [activeIndex, setActiveIndex] = useState(0);

    const allArticles = newsItems.filter(item => item.type === "news" || item.type === "csr");

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen text-navy-deep font-body">
                {/* Hero Skeleton */}
                <div className="h-screen bg-slate-50 flex items-center justify-center p-6 relative">
                    <div className="container mx-auto px-6 z-10">
                        <Skeleton className="h-12 w-2/3 md:h-20 md:w-1/2 mb-6" />
                        <Skeleton className="h-4 w-1/3 md:w-1/4 mb-10" />
                    </div>
                </div>

                {/* Featured Section Skeleton */}
                <div className="py-24 md:py-40">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                            <div className="lg:col-span-7">
                                <Skeleton className="aspect-[16/10] w-full rounded-card" />
                            </div>
                            <div className="lg:col-span-5 space-y-6">
                                <Skeleton className="h-4 w-24 mb-4" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-3/4" />
                                <div className="space-y-4 pt-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white min-h-screen pt-40 text-center px-6">
                <p className="text-red-500 font-bold uppercase tracking-widest mb-4">
                    Connection Error
                </p>
                <p className="text-slate-500 text-sm max-w-md mx-auto">{error}</p>
            </div>
        );
    }

    if (allArticles.length === 0) {
        return (
            <div className="bg-white min-h-screen pt-40 text-center px-6">
                <p className="text-slate-400 font-bold uppercase tracking-widest">
                    No articles published yet.
                </p>
            </div>
        );
    }

    const heroImages = allArticles.slice(0, 5).map(item => getOptimizedNewsImage(item.image, 1920, 85));

    const featuredArticle =
        allArticles.find(item => item.featured) || allArticles[0];
    const otherArticles = allArticles.filter(
        item => item.id !== featuredArticle.id
    );

    return (
        <div className="bg-white min-h-screen text-navy-deep font-body">

            {/* ================= HERO ================= */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Swiper
                        modules={[Autoplay, EffectFade, Navigation]}
                        effect="fade"
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        navigation={{
                            prevEl: '.hero-prev',
                            nextEl: '.hero-next',
                        }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        loop={true}
                        className="h-full w-full"
                    >
                        {heroImages.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-full overflow-hidden">
                                    <motion.img
                                        src={img}
                                        alt={`News Hero ${index + 1}`}
                                        initial={{ scale: 1.05 }}
                                        animate={{ scale: activeIndex === index ? 1.2 : 1.05 }}
                                        transition={{ duration: 7, ease: "linear" }}
                                        className="w-full h-full object-cover"
                                        width="1920"
                                        height="1080"
                                        fetchPriority={index === 0 ? "high" : "low"}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-navy-deep/75 backdrop-blur-[1px]"></div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Hero Timeline / Progress Bar - TOP */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 z-20">
                        <motion.div
                            key={activeIndex}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-full bg-[#BC9C33] shadow-[0_0_10px_rgba(188,156,51,0.5)]"
                        />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                </div>

                {/* Hero Content Area */}
                <div className="absolute inset-0 z-20 flex items-end pb-20">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="max-w-4xl text-left">
                                <h1 className="text-white text-3xl md:text-6xl font-display leading-[1.2] mb-0 pb-4 overflow-hidden drop-shadow-lg">
                                    <motion.span
                                        initial={{ opacity: 0, y: 100 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="inline-block"
                                    >
                                        Insights & <span className="text-[#BC9C33]">Updates.</span>
                                    </motion.span>
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-[.4em] flex items-center gap-4 drop-shadow-sm mt-4"
                                >
                                    Archive <ChevronRight size={14} className="text-[#BC9C33]" /> Latest Stories
                                </motion.p>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 z-30">
                                <button className="hero-prev w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#BC9C33] hover:border-[#BC9C33] transition-all duration-300 group">
                                    <ChevronLeft size={20} className="md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button className="hero-next w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#BC9C33] hover:border-[#BC9C33] transition-all duration-300 group">
                                    <ChevronRight size={20} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </section>


            {/* ================= FEATURED ================= */}
            <section className="py-24 md:py-40">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <motion.div {...fadeIn} className="lg:col-span-7">
                            <div className="relative group overflow-hidden rounded-card shadow-2xl">
                                <img
                                    src={getOptimizedNewsImage(featuredArticle.image, 1600, 80)}
                                    alt={featuredArticle.title}
                                    className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition duration-1000"
                                    width="1600"
                                    height="1000"
                                    loading="eager"
                                    decoding="async"
                                />
                                <div className="absolute top-8 left-8">
                                    <span className="bg-[#BC9C33] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                                        Featured Article
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="lg:col-span-5">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#BC9C33]">
                                    <Bookmark size={14} /> {featuredArticle.category}
                                </div>

                                <h2 className="text-2xl md:text-4xl font-display leading-tight">
                                    {featuredArticle.title}
                                </h2>

                                <p className="text-slate-500 text-base md:text-lg leading-relaxed">
                                    {featuredArticle.excerpt}
                                </p>

                                <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[.2em] text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <Calendar size={14} /> {featuredArticle.date}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <User size={14} /> BY {featuredArticle.author}
                                    </span>
                                </div>

                                <Link
                                    to={`/news/${featuredArticle.id}`}
                                    className="inline-flex items-center gap-6 group"
                                >
                                    <span className="font-bold uppercase tracking-[.3em] text-xs">
                                        Explore Story
                                    </span>
                                    <div className="w-14 h-14 rounded-full border flex items-center justify-center group-hover:bg-navy-deep group-hover:text-white transition transform group-hover:rotate-45">
                                        <ArrowRight size={20} />
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= ARCHIVE ================= */}
            <section className="py-32 bg-slate-50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="mb-24">
                        <span className="text-[#BC9C33] font-bold uppercase tracking-[.4em] text-xs mb-4 block">
                            Archive
                        </span>
                        <h3 className="text-4xl md:text-5xl font-display">
                            Latest Updates
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {otherArticles.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                {...fadeIn}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <Link to={`/news/${item.id}`}>
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-card-sm mb-10 shadow-xl">
                                        <img
                                            src={getOptimizedNewsImage(item.image, 800, 75)}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                            width="800"
                                            height="600"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            <span className="bg-white/90 text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                                                {item.category}
                                            </span>
                                            {item.media_type === 'video' && (
                                                <span className="bg-[#BC9C33] text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg">
                                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <span className="flex items-center gap-2">
                                                <Clock size={12} /> {item.date}
                                            </span>
                                            <span>BY {item.author}</span>
                                        </div>

                                        <h4 className="text-2xl font-display leading-tight group-hover:text-[#BC9C33] transition line-clamp-2">
                                            {item.title}
                                        </h4>

                                        <div className="pt-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[.3em] opacity-0 group-hover:opacity-100 transition group-hover:translate-x-3">
                                            Read More <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewsPage;
