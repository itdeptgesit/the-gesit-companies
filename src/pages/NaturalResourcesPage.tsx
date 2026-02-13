import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

/**
 * NaturalResourcesPage
 * Features high-fidelity imagery and staggered resources showcases.
 * Focuses on global efficiency, precision, and partnership-driven growth.
 */

const ImageSlideshow = ({ images }: { images: string[] }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="w-full h-full relative overflow-hidden">
            <AnimatePresence initial={false}>
                <motion.img
                    key={index}
                    src={images[index]}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Natural Resources"
                />
            </AnimatePresence>
        </div>
    );
};

const NaturalResourcesPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const heroImages = [
        "/natural/mining.jpg",
        "/natural/bauxite_mining.jpg",
        "/natural/nickel.jpeg"
    ];

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    const newBusinesses = [
        {
            title: "Nickel Mining",
            image: "/natural/nickel.jpeg"
        },
        {
            title: "Silica Sand Mining",
            image: "/natural/silica.jpeg"
        },
        {
            title: "Alumina Refinery and Aluminum Smelter",
            image: "/natural/alumina.jpg"
        }
    ];

    return (
        <div className="bg-white min-h-screen text-navy-deep font-body">
            {/* 1. Cinematic Hero Section */}
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
                                        alt={`Natural Resources Hero ${index + 1}`}
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
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-white/10 z-20">
                        <motion.div
                            key={activeIndex}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-full bg-[#BC9C33] shadow-[0_0_10px_rgba(188,156,51,0.5)]"
                        />
                    </div>

                    <div className="absolute inset-0 z-20 flex items-end pb-20">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="max-w-4xl">

                                    <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-display leading-[1.2] mb-0 pb-4 overflow-hidden drop-shadow-lg px-1">
                                        <motion.span
                                            initial={{ opacity: 0, y: 100 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            className="inline-block"
                                        >
                                            Natural Resources
                                        </motion.span>
                                    </h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.7 }}
                                        className="text-white text-sm md:text-lg font-light max-w-xl drop-shadow-md leading-relaxed"
                                    >
                                        Developing Indonesia's vast natural resources sustainably
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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                </div>


            </section>

            {/* 2. High-Impact Navy Introduction Section */}
            <section className="bg-navy-deep py-24 md:py-32 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <motion.div {...fadeIn} className="text-white text-center">
                        <h2 className="text-2xl md:text-5xl font-display leading-[1.3] mb-0 max-w-5xl mx-auto font-light">
                            Developing Indonesia's vast <span className="text-[#BC9C33] font-bold">natural resources</span> and continually expanding to other types of minerals and resources.
                        </h2>
                    </motion.div>
                </div>
                {/* Abstract decoration */}
                <div className="absolute -bottom-20 -right-20 text-[20vw] font-display text-white/5 select-none pointer-events-none">
                    GESIT
                </div>
            </section>

            {/* 3. Bauxite Mining Section (Editorial Staggered) */}
            <section className="py-24 md:py-40 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <div className="order-2 lg:order-1">
                            <motion.div {...fadeIn}>
                                <h3 className="text-navy-deep text-5xl md:text-7xl font-display mb-10 leading-tight">Bauxite Mining</h3>
                                <div className="space-y-8 text-slate-600 font-light text-xl leading-relaxed max-w-xl">
                                    <p>
                                        The Gesit Companies have 2 bauxite concessions of about 7,000 Ha along the Kapuas River in West Kalimantan.
                                    </p>
                                </div>
                                <div className="mt-12 flex items-center gap-4">
                                    <div className="w-12 h-[1px] bg-[#BC9C33]"></div>
                                    <p className="text-[#BC9C33] font-semibold tracking-widest uppercase text-sm">Location : West Kalimantan, Indonesia</p>
                                </div>
                            </motion.div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="relative rounded-card overflow-hidden shadow-2xl aspect-[4/5] bg-slate-50"
                            >
                                <ImageSlideshow images={[
                                    "/natural/bauxite_mining.jpg",
                                    "/natural/natural_lds_bauxite_1.png",
                                    "/natural/natural_lds_bauxite_2.png"
                                ]} />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. New Business Development Section */}
            <section className="py-24 md:py-40 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div {...fadeIn} className="text-center mb-24">
                        <h2 className="text-navy-deep text-4xl md:text-7xl font-display">New Business Development</h2>
                        <div className="w-24 h-1 bg-[#BC9C33] mx-auto mt-8"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {newBusinesses.map((biz, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className="group flex flex-col items-center"
                            >
                                {/* Image Container - CSR Style */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card shadow-xl mb-0">
                                    <img
                                        src={biz.image}
                                        alt={biz.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-navy-deep/20 group-hover:bg-navy-deep/10 transition-colors"></div>
                                </div>

                                {/* Connector Line */}
                                <div className="w-px h-12 bg-gray-200 mx-auto"></div>

                                {/* Content Box - CSR Style (Blue) */}
                                <div className="bg-navy-deep p-8 rounded-card text-center shadow-xl w-full flex flex-col items-center justify-center min-h-[160px] transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <h4 className="text-white text-xl md:text-2xl font-display tracking-wide leading-snug">{biz.title}</h4>
                                    <div className="w-12 h-0.5 bg-white/20 mt-4"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NaturalResourcesPage;
