import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

/**
 * TradingServicePage
 * Features high-fidelity imagery and staggered service showcases.
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
                        alt="Trading & Services"
                    />
                    <div className="absolute inset-0 bg-black/5"></div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const TradingServicePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const heroImages = [
        "/trading/cover.jpg",
        "/trading/trading1.png",
        "/trading/agency1.jpeg"
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
                        {heroImages.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-full overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`Trading Hero ${index + 1}`}
                                        className="w-full h-full object-cover animate-property-zoom"
                                        style={{ transformOrigin: 'center' }}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                    />
                                    {/* Blue gradient overlay */}
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
                                Trading & Services
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

            {/* 2. Intro Section - Gold Background */}
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
                            Leveraging local Indonesian expertise and broad international network to source and deliver high-quality products.
                        </h2>

                        {/* Description with Vertical Line on the Left */}
                        <div style={{ display: 'flex', gap: '32px', textAlign: 'left' }}>
                            <div style={{ width: '2px', backgroundColor: 'white', opacity: 1 }}></div>
                            <p style={{
                                color: 'white',
                                fontSize: '20px',
                                lineHeight: '1.6',
                                fontFamily: "'Source Sans Pro', sans-serif",
                                fontWeight: 400,
                                maxWidth: '700px',
                                margin: 0
                            }}>
                                The Gesit Companies have been trading commodities along the aluminum value chain and providing agency services used by banks and other consumers for over 30 years.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Showcase */}
            <section className="py-24 md:py-40 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="space-y-40">
                        {/* Service 1: Trading */}
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
                            {/* Image Section - 35% - Animates from Left */}
                            <div className="w-full lg:w-[35%]">
                                <motion.div
                                    initial={{ opacity: 0, x: -100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative"
                                >
                                    <div className="aspect-[3/4] rounded-card overflow-hidden shadow-2xl relative z-10 bg-slate-50">
                                        <ImageSlideshow images={["/trading/trading1.png", "/trading/trading2.png", "/trading/cover.jpg"]} />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Content Section - 55% - Animates from Right */}
                            <div className="w-full lg:w-[55%]" style={{ maxWidth: '600px' }}>
                                <motion.div
                                    initial={{ opacity: 0, x: 100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                >
                                    <h3 className="text-4xl md:text-5xl font-display text-navy-deep mb-8 leading-tight">Trading</h3>

                                    <div className="text-slate-600 text-lg leading-relaxed font-medium">
                                        The Gesit Companies has been in this business for over 30 years. We source and deliver a variety of products including Bauxite, Alumina, Calcined Petroleum Coke, Aluminum Ingots, to domestic and international markets - Indonesia, China, South America and the Middle East.
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Service 2: Agency Services */}
                        <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-12 lg:gap-24">
                            {/* Image Section - 35% - Animates from Left */}
                            <div className="w-full lg:w-[35%]">
                                <motion.div
                                    initial={{ opacity: 0, x: -100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative"
                                >
                                    <div className="aspect-[3/4] rounded-card overflow-hidden shadow-2xl relative z-10 bg-slate-50">
                                        <ImageSlideshow images={["/trading/agency1.jpeg", "/trading/agency2.jpeg", "/trading/agency3.jpeg"]} />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Content Section - 55% - Animates from Right */}
                            <div className="w-full lg:w-[55%]" style={{ maxWidth: '600px' }}>
                                <motion.div
                                    initial={{ opacity: 0, x: 100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                >
                                    <h3 className="text-4xl md:text-5xl font-display text-navy-deep mb-8 leading-tight">
                                        Agency Services
                                    </h3>

                                    <div className="text-slate-600 text-lg leading-relaxed font-medium">
                                        The Gesit Companies provides agency services locally and internationally for various industries such as mining, power plants and other industrial projects. We have been the agent for major global organizations and for over 30 years.
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Simple slow zoom animation for hero */}
            <style>{`
                @keyframes propertyZoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }
                .animate-property-zoom {
                    animation: propertyZoom 30s linear infinite alternate;
                }
            `}</style>
        </div>
    );
};

export default TradingServicePage;
