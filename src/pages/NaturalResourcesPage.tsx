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
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-900">
            <AnimatePresence initial={false}>
                <motion.div
                    key={index}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{
                        duration: 1.2,
                        ease: [0.645, 0.045, 0.355, 1]
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    <motion.img
                        src={images[index]}
                        initial={{ scale: 1.15, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="w-full h-full object-cover"
                        alt="Natural Resources"
                    />
                    <div className="absolute inset-0 bg-black/5"></div>
                </motion.div>
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
                        speed={2000}
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        navigation={{
                            prevEl: '.hero-prev',
                            nextEl: '.hero-next',
                        }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        loop={true}
                        className="h-full w-full"
                    >
                        {heroImages.map((img: string, index: number) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-full overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`Natural Resources Hero ${index + 1}`}
                                        className="w-full h-full object-cover animate-property-zoom"
                                        style={{ transformOrigin: 'center' }}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#103065]/70 via-[#103065]/30 to-transparent" />
                                    <div className="absolute inset-0 bg-black/10" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Gold Progress Bar - TOP */}
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

                {/* Text & Navigation at bottom */}
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
                                Natural Resources
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

            {/* 2. Intro Section - Gold Background Matching Manufacturing */}
            <section style={{ backgroundColor: '#BC9C33', padding: '120px 0' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 40px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Heading - Georgia font */}
                        <h2 style={{
                            color: 'white',
                            fontSize: 'clamp(24px, 4vw, 36px)',
                            fontFamily: 'Georgia, serif',
                            fontWeight: 300,
                            lineHeight: '1.4',
                            marginBottom: '48px',
                            maxWidth: '900px',
                            textAlign: 'left'
                        }}>
                            Developing Indonesia's vast natural resources and continually expanding to other types of minerals and resources.
                        </h2>
                    </motion.div>
                </div>
            </section>

            {/* 3. Bauxite Mining Section (Aligned with Manufacturing) */}
            <section className="py-24 md:py-40 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-24 items-center justify-center">
                        {/* Image Section - Portrait (35%) - Animates from Left */}
                        <div className="w-full lg:w-[35%] relative group">
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="relative rounded-card overflow-hidden shadow-2xl aspect-[3/4] bg-slate-200"
                            >
                                <ImageSlideshow images={[
                                    "/natural/bauxite_mining.jpg",
                                    "/natural/natural_lds_bauxite_1.png",
                                    "/natural/natural_lds_bauxite_2.png"
                                ]} />
                            </motion.div>
                        </div>

                        {/* Content Section (55%) - Animates from Right */}
                        <div className="w-full lg:w-[55%]" style={{ maxWidth: '600px' }}>
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            >
                                <h3 className="text-4xl md:text-5xl font-display text-navy-deep mb-8 leading-tight">Bauxite Mining</h3>
                                <div className="text-slate-600 font-medium text-lg leading-relaxed mb-10 space-y-4">
                                    <p>
                                        The Gesit Companies have 2 bauxite concessions of about 7,000 Ha along the Kapuas River in West Kalimantan.
                                    </p>
                                </div>
                                <div className="mt-12 flex items-center gap-6">
                                    <div className="w-[3px] h-10 bg-[#BC9C33]"></div>
                                    <p className="text-navy-deep text-2xl font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                                        Location : West Kalimantan, Indonesia
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. New Business Development Section */}
            <section className="py-24 md:py-40 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <h2 className="text-navy-deep text-4xl md:text-5xl" style={{ fontFamily: 'Georgia, serif' }}>New Business Development</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {newBusinesses.map((biz, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className="group flex flex-col rounded-card overflow-hidden"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden">
                                    <img
                                        src={biz.image}
                                        alt={biz.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content Box - Attached directly below image */}
                                <div className="bg-[#103065] p-6 text-center shadow-lg w-full flex items-center justify-center min-h-[100px]">
                                    <h4 className="text-white text-lg font-medium leading-snug" style={{ fontFamily: 'Georgia, serif' }}>{biz.title}</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Custom Animations */}
            <style>{`
                .animate-property-zoom {
                    animation: propertyZoom 30s linear infinite alternate;
                    will-change: transform;
                }
                @keyframes propertyZoom {
                    0% { transform: scale(1.0); }
                    100% { transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
};

export default NaturalResourcesPage;
