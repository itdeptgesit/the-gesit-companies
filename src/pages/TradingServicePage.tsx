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
                    alt="Trading & Services"
                />
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

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

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
                                        alt={`Trading Hero ${index + 1}`}
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
                                            Trading & Services
                                        </motion.span>
                                    </h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.7 }}
                                        className="text-white text-sm md:text-lg font-light max-w-xl drop-shadow-md leading-relaxed"
                                    >
                                        Leveraging expertise across the aluminum value chain
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

            {/* 2. High-Impact Gold Introduction Section */}
            <section className="bg-[#BC9C33] py-24 md:py-32 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <motion.div {...fadeIn} className="text-white">
                        <h2 className="text-2xl md:text-5xl font-display leading-[1.3] mb-10 max-w-4xl font-light">
                            Leveraging local Indonesian expertise and broad international network to source and deliver high-quality products.
                        </h2>
                        <div className="flex gap-8 items-start">
                            <div className="w-1 h-24 bg-white/20"></div>
                            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl pt-2">
                                The Gesit Companies have been trading commodities along the aluminum value chain and providing agency services used by banks and other consumers for over 30 years.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Showcase */}
            <section className="py-24 md:py-40 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="space-y-32">
                        {/* Service 1: Trading */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                            <div className="order-2 lg:order-1">
                                <motion.div {...fadeIn}>
                                    <h3 className="text-[#BC9C33] text-5xl md:text-7xl font-display mb-10 leading-tight">Trading</h3>
                                    <div className="space-y-8 text-slate-600 font-light text-lg leading-relaxed">
                                        <p>
                                            The Gesit Companies has been in this business for over 30 years. We source and deliver a variety of products including Bauxite, Alumina, Calcined Petroleum Coke, Aluminum Ingots, to domestic and international markets - Indonesia, China, South America and the Middle East.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1 }}
                                    className="relative"
                                >
                                    <div className="aspect-[4/3] rounded-card overflow-hidden shadow-2xl relative z-10 bg-slate-50">
                                        <ImageSlideshow images={["/trading/trading1.png", "/trading/trading2.png"]} />
                                    </div>
                                    <div className="absolute -top-10 -right-10 w-2/3 aspect-square rounded-full border border-[#BC9C33]/20 -z-10 animate-spin-slow"></div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Service 2: Agency Services */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                className="relative"
                            >
                                <div className="aspect-[4/3] rounded-card overflow-hidden shadow-2xl relative z-10 bg-slate-50">
                                    <ImageSlideshow images={["/trading/agency1.jpeg", "/trading/agency2.jpeg", "/trading/agency3.jpeg"]} />
                                </div>
                            </motion.div>
                            <div>
                                <motion.div {...fadeIn}>
                                    <h3 className="text-[#BC9C33] text-5xl md:text-7xl font-display mb-10 leading-tight">Agency <br /> Services</h3>
                                    <div className="space-y-8 text-slate-600 font-light text-lg leading-relaxed">
                                        <p>
                                            For over two decades, this division has provided its agency services to support the supply and distribution of products and technology used by banks and other consumers. Representative products include special currency paper and coins, high security technology to identify brand and documents, and disposal machines.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TradingServicePage;
