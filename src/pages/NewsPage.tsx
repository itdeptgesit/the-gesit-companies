import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ChevronRight,
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
                                <div className="relative h-full w-full overflow-hidden">
                                    <motion.img
                                        src={img}
                                        alt={`News Hero ${index + 1}`}
                                        initial={{ scale: 1 }}
                                        animate={{ scale: activeIndex === index ? 1.15 : 1 }}
                                        transition={{ duration: 6, ease: "easeOut" }}
                                        className="w-full h-full object-cover"
                                        width="1920"
                                        height="1080"
                                        fetchPriority={index === 0 ? "high" : "low"}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                    />
                                    {/* Gradient Overlay matching CSR */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#103065]/70 via-[#103065]/30 to-transparent" />
                                    <div className="absolute inset-0 bg-black/10" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Gold Progress Bar - TOP (Matching CSR 4px height) */}
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-black/20 z-40">
                        <motion.div
                            key={activeIndex}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 6, ease: "linear" }}
                            style={{ originX: 0 }}
                            className="h-full bg-[#BC9C33]"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="absolute inset-0 z-20 flex items-end pb-16 md:pb-24">
                    <div className="w-full px-8 md:px-16 lg:px-24">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
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
                                News
                            </motion.h1>

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


            {/* ================= FEATURED NEWS ================= */}
            <section className="pt-24 md:pt-32 pb-8 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <motion.div
                        {...fadeIn}
                        className="grid grid-cols-1 lg:grid-cols-2 shadow-2xl overflow-hidden rounded-sm"
                    >
                        {/* Image Side */}
                        <div className="relative aspect-[4/3] lg:aspect-auto h-full overflow-hidden">
                            <img
                                src={getOptimizedNewsImage(featuredArticle.image, 1600, 80)}
                                alt={featuredArticle.title}
                                className="w-full h-full object-cover hover:scale-105 transition duration-1000"
                            />
                        </div>

                        {/* Content Side (Navy Box) */}
                        <div className="bg-navy-deep p-12 md:p-16 flex flex-col justify-between text-white border-l border-white/10">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-[.4em] text-white/50 mb-12 block">
                                    {featuredArticle.date}
                                </span>
                                <h2
                                    className="text-2xl md:text-4xl leading-snug mb-8"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    {featuredArticle.title}
                                </h2>
                                <Link
                                    to={`/news/${featuredArticle.id}`}
                                    className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-[#BC9C33] hover:border-[#BC9C33] transition-all duration-300 group"
                                >
                                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>

                            <div className="mt-12 pt-12 border-t border-white/10">
                                <p className="text-[16px] font-bold text-[#BC9C33] mb-2">News</p>
                                <p className="text-[14px] font-medium text-white/40">by {featuredArticle.author}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= ARCHIVE GRID ================= */}
            <section className="pt-0 pb-20 bg-white">
                <div className="container mx-auto px-6 max-w-7xl relative z-30">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherArticles.slice(0, 3).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex"
                            >
                                <Link
                                    to={`/news/${item.id}`}
                                    className="flex-1 bg-[#e3eaf4] p-10 md:p-12 flex flex-col justify-between group hover:bg-[#d1dae8] transition-colors duration-500 min-h-[420px]"
                                >
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-[.3em] text-navy-deep/40 mb-10 block">
                                            {item.date}
                                        </span>
                                        <h4
                                            className="text-xl md:text-2xl text-navy-deep leading-relaxed mb-8 group-hover:text-navy-deep transition-colors"
                                            style={{ fontFamily: 'Georgia, serif' }}
                                        >
                                            {item.title}
                                        </h4>
                                        <div className="w-10 h-10 rounded-full border border-navy-deep/10 flex items-center justify-center group-hover:bg-[#BC9C33] group-hover:border-[#BC9C33] group-hover:text-white transition-all duration-300">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-navy-deep/5">
                                        <p className="text-[14px] font-bold text-[#BC9C33] mb-2">News</p>
                                        <p className="text-[12px] font-medium text-navy-deep/40">by {item.author}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* See All Button */}
                    <div className="mt-12 flex justify-start">
                        <Link
                            to="/news/archive"
                            className="flex items-center gap-3 group text-navy-deep font-bold uppercase tracking-[.3em] text-[11px]"
                        >
                            <span>See All</span>
                            <div className="w-8 h-8 rounded-full border border-navy-deep flex items-center justify-center group-hover:bg-navy-deep group-hover:text-white transition-all duration-300">
                                <ArrowRight size={14} />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= INFINITE SCROLL GALLERY (CSR STYLE) ================= */}
            <section className="py-24 bg-[#BC9C33] overflow-hidden">
                <div className="relative w-full">
                    <div className="flex overflow-hidden relative">
                        <motion.div
                            className="flex gap-12 px-4 py-12 items-center"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                ease: "linear",
                                duration: 120,
                                repeat: Infinity,
                            }}
                            style={{ width: "fit-content" }}
                        >
                            {[...allArticles, ...allArticles, ...allArticles].map((item, index) => (
                                <div
                                    key={`gallery-scroll-${index}`}
                                    className="w-[450px] h-[300px] shrink-0 rounded-xl overflow-hidden transition-all duration-700 group relative"
                                >
                                    <img
                                        src={getOptimizedNewsImage(item.image, 800, 80)}
                                        alt={item.title}
                                        className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2.5s] ease-out"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewsPage;
