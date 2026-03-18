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
        "/trading/hero1.png",
        "/trading/hero2.png",
        "/trading/hero3.png"
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

                <div className="absolute inset-0 z-20 flex items-center md:items-end justify-center md:justify-start pb-0 md:pb-24">
                    <div className="w-full px-8 md:px-16 lg:px-24">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-8 text-center md:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="text-white text-5xl md:text-7xl leading-tight drop-shadow-md text-center md:text-left"
                                style={{
                                    fontFamily: 'Georgia, serif',
                                    fontWeight: 400,
                                    textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                                }}
                            >
                                Trading & Services
                            </motion.h1>

                            {/* Navigation Buttons */}
                            <div className="hidden md:flex gap-4 z-30">
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
            <section className="flex justify-center" style={{ backgroundColor: '#BC9C33', padding: '150px 0' }}>
                <div style={{ maxWidth: '824px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Heading */}
                        <div style={{ margin: '0 0 15px', padding: 0 }}>
                            <h2 className="text-[30px] md:text-[36px] leading-[40px] md:leading-[50px] font-normal" style={{
                                color: '#fff',
                                fontFamily: 'Georgia, serif',
                                textAlign: 'left',
                                margin: 0
                            }}>
                                Leveraging local Indonesian expertise and broad international network to source and deliver high-quality products.
                            </h2>
                        </div>

                        {/* Description with Left Border */}
                        <div style={{
                            padding: '0 0 0 40px',
                            borderStyle: 'solid',
                            borderWidth: '0 0 0 2px',
                            borderColor: '#fff',
                            borderRadius: '0',
                            textAlign: 'left'
                        }}>
                            <p className="text-[16px] md:text-[24px] leading-[25px] md:leading-[1.5em]" style={{
                                color: '#fff',
                                fontFamily: "'Source Sans Pro', sans-serif",
                                fontWeight: 400,
                                margin: 0
                            }}>
                                The Gesit Companies have been trading commodities along the aluminum value chain and providing agency services used by banks and other consumers for over 30 years.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Showcase */}
            {/* Services Showcase */}
            <section className="py-24 md:py-40 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="space-y-48">
                        {/* Service 1: Trading */}
                        <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-24 items-center justify-center">
                            {/* Image Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full lg:w-[45%] relative group"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden shadow-sm bg-slate-200 rounded-[4px]">
                                    <ImageSlideshow images={["/trading/trading1.png", "/trading/trading2.png", "/trading/cover.jpg"]} />
                                </div>
                            </motion.div>

                            {/* Content Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                className="w-full lg:w-[45%]"
                                style={{ maxWidth: '480px' }}
                            >
                                <h3 className="text-[#1a1a1a] mb-4 text-4xl md:text-[3rem]" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, lineHeight: '1.2' }}>
                                    Trading
                                </h3>

                                <div className="text-[#000] mt-8 mb-12" style={{ fontSize: '19px', fontWeight: 400, lineHeight: '1.7', fontFamily: "'Source Sans Pro', sans-serif" }}>
                                    The Gesit Companies has been in this business for over 30 years. We source and deliver a variety of products including Bauxite, Alumina, Calcined Petroleum Coke, Aluminum Ingots, to domestic and international markets - Indonesia, China, South America and the Middle East.
                                </div>
                            </motion.div>
                        </div>

                        {/* Service 2: Agency Services */}
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center">
                            {/* Image Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full lg:w-[45%] relative group"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden shadow-sm bg-slate-200 rounded-[4px]">
                                    <ImageSlideshow images={["/trading/agency1.jpeg", "/trading/agency2.jpeg", "/trading/agency3.jpeg"]} />
                                </div>
                            </motion.div>

                            {/* Content Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                className="w-full lg:w-[45%]"
                                style={{ maxWidth: '480px' }}
                            >
                                <h3 className="text-[#1a1a1a] mb-4 text-4xl md:text-[3rem]" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, lineHeight: '1.2' }}>
                                    Agency Services
                                </h3>

                                <div className="text-[#000] mt-8 mb-12" style={{ fontSize: '19px', fontWeight: 400, lineHeight: '1.7', fontFamily: "'Source Sans Pro', sans-serif" }}>
                                    For over two decades, this division has provided its agency services to support the supply and distribution of products and technology used by banks and other consumers. Representative products include special currency paper and coins, high security technology to identify brand and documents, and disposal machines.
                                </div>
                            </motion.div>
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
