import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

/**
 * ManufacturingPage
 * Features industrial-premium imagery and staggered manufacturing showcases.
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
                    alt="Manufacturing"
                    width="800"
                    height="600"
                    loading="lazy"
                    decoding="async"
                />
            </AnimatePresence>
        </div>
    );
};

const ManufacturingPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const heroImages = [
        "/manufacturing/cover.png",
        "/manufacturing/cover2.jpg",
        "/manufacturing/aluminum1.jpeg"
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
                                        alt={`Manufacturing Hero ${index + 1}`}
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
                                            Manufacturing
                                        </motion.span>
                                    </h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.7 }}
                                        className="text-white text-sm md:text-lg font-light max-w-xl drop-shadow-md leading-relaxed"
                                    >
                                        Precision engineering for industrial excellence
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
            <section className="bg-[#BC9C33] py-28 md:py-40 relative overflow-hidden">
                {/* Background Industrial Accents */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
                    <div className="absolute top-10 left-10 text-[10px] font-mono tracking-widest uppercase">COORD: 6.2088° S, 106.8456° E</div>
                    <div className="absolute bottom-10 right-10 text-[10px] font-mono tracking-widest uppercase">REF: MFG-GESIT-2026</div>
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
                    <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white"></div>
                    <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white"></div>
                </div>

                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-white"
                    >
                        <h2 className="text-2xl md:text-5xl font-display leading-[1.25] mb-12 max-w-4xl font-light">
                            Serving <span className="italic text-white/90">important</span> industrial sectors,
                            delivering <span className="relative inline-block mx-1">
                                <span className="relative z-10 font-bold">high-quality products</span>
                                <motion.span
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                    className="absolute bottom-1 left-0 h-[8px] bg-white/20 -rotate-1"
                                ></motion.span>
                            </span>
                            and establishing <span className="font-bold">strong long-term partnership.</span>
                        </h2>

                        <div className="flex gap-8 items-start">
                            <div className="flex flex-col items-center shrink-0">
                                <div className="w-[1.5px] h-20 bg-gradient-to-b from-white to-transparent"></div>
                                <div className="w-1.5 h-1.5 rounded-full border border-white/50 mt-1"></div>
                            </div>
                            <p className="text-white/80 text-base md:text-xl font-light leading-relaxed max-w-2xl pt-2">
                                The Gesit Companies operates aluminum fabrication and packaging company through two business lines: <a href="https://aams.co.id/" target="_blank" rel="noopener noreferrer" className="font-bold text-white border-b border-white/30 hover:border-white transition-colors">Alakasa Andalan Mitra Sejati</a> and <a href="https://rheem.co.id/" target="_blank" rel="noopener noreferrer" className="font-bold text-white border-b border-white/30 hover:border-white transition-colors">Rheem Indonesia</a>.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Abstract decoration */}
                <div className="absolute -bottom-20 -right-20 text-[25vw] font-display text-white/5 select-none pointer-events-none leading-none tracking-tighter">
                    MFG
                </div>
            </section>

            {/* 3. Aluminum Fabrication Section (Editorial Staggered) */}
            <section className="py-24 md:py-40 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <div className="order-2 lg:order-1">
                            <motion.div {...fadeIn}>
                                <h3 className="text-[#BC9C33] text-5xl md:text-7xl font-display mb-10 leading-tight">Aluminum <br /> Fabrication</h3>
                                <div className="space-y-8 text-slate-600 font-light text-lg leading-relaxed">
                                    <p>
                                        The Gesit Companies invests and manages its aluminum fabrication company — Alakasa Andalan Mitra Sejati (AAMS). Since its inception in 1972, the focus of aluminum fabrication company has specialized in the industrial sector (e.g., building materials, automotive, other industrial products) to serve the local and international markets.
                                    </p>
                                    <p>
                                        We have served several countries such as Japan, Malaysia, Philippines, Taiwan, Australia, Hong Kong, Vietnam, US, Syria, and we plan on continuing our effort to be recognized as leading manufacturing and engineering aluminum.
                                    </p>
                                </div>
                                <div className="mt-12">
                                    <a
                                        href="/files/Company-Profile-Alakasa-Andalan-Mitra-Sejati-2022.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block border border-navy-deep/20 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-navy-deep hover:text-white transition-all shadow-sm"
                                    >
                                        Download Brochure
                                    </a>
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
                                    <ImageSlideshow images={["/manufacturing/aluminum1.jpeg", "/manufacturing/aluminum2.jpeg", "/manufacturing/aluminum3.jpeg"]} />
                                </div>
                                <div className="absolute -top-10 -right-10 w-2/3 aspect-square rounded-full border border-[#BC9C33]/20 -z-10 animate-spin-slow"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 4. Steel & Plastic Packaging Section (Editorial Staggered) */}
            < section className="py-24 md:py-40 bg-slate-50" >
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="aspect-[4/3] rounded-card overflow-hidden shadow-2xl relative z-10 bg-slate-100">
                                <ImageSlideshow images={["/manufacturing/steel1.jpeg", "/manufacturing/steel2.png", "/manufacturing/steel3.png", "/manufacturing/steel4.jpeg"]} />
                            </div>
                        </motion.div>
                        <div>
                            <motion.div {...fadeIn}>
                                <h3 className="text-[#BC9C33] text-5xl md:text-7xl font-display mb-10 leading-tight">Steel & Plastic <br /> Packaging</h3>
                                <div className="space-y-8 text-slate-600 font-light text-lg leading-relaxed">
                                    <p>
                                        The Gesit Companies invests and manages a packaging company — Rheem Indonesia, which was established by Rheem Australia in 1968. The focus is to build packaging company that specializes in industrial packaging products such as steel and plastic drums with various capacities.
                                    </p>
                                    <p>
                                        The specialized sectors such as oil, paint, lubricant, chemical, and food processing to ensure that customers obtain the highest standard of quality products and services, using premium materials and operating internationally standards for have made them at the top of market.
                                    </p>
                                </div>
                                <div className="mt-12">
                                    <button className="border border-navy-deep/20 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-navy-deep hover:text-white transition-all">Learn More</button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 5. Smelter Development Section */}
            < section className="py-24 md:py-40 bg-white" >
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <div className="order-2 lg:order-1">
                            <motion.div {...fadeIn}>
                                <h3 className="text-[#BC9C33] text-5xl md:text-7xl font-display mb-10 leading-tight">Alumina Refinery & <br /> Aluminum Smelter <br /> Development</h3>
                                <div className="space-y-8 text-slate-600 font-light text-lg leading-relaxed">
                                    <p>
                                        We believe the Alumina and Aluminum industries can be competitively developed to service domestic and global clients due to redundant rich natural resources and logistical advantages.
                                    </p>
                                    <p>
                                        The Gesit Companies will develop a 2 Million-ton Alumina Refinery and, upon completion, develop an Aluminum Smelter which will reach 1 Million ton for the next phase.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="relative rounded-card overflow-hidden shadow-2xl aspect-[4/5]"
                            >
                                <img src="/manufacturing/alumina.jpeg" className="w-full h-full object-cover" alt="Smelter Development" width="800" height="1000" loading="lazy" decoding="async" />
                                <div className="absolute inset-0 bg-navy-deep/20"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default ManufacturingPage;
