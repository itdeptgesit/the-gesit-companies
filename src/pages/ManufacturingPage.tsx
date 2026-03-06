import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

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
                        ease: [0.645, 0.045, 0.355, 1] // Power3 ease in/out
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    <motion.img
                        src={images[index]}
                        initial={{ scale: 1.15, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="w-full h-full object-cover"
                        alt="Slideshow"
                    />
                    {/* Subtle Internal Overlay */}
                    <div className="absolute inset-0 bg-black/5"></div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const ProjectItem = ({ project }: { project: any, index: number }) => {
    return (
        <div
            className={`flex flex-col ${project.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center justify-center`}
        >
            {/* Image Section - Portrait (35%) - Animates from Left */}
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full lg:w-[35%] relative group"
            >
                <div className="relative aspect-[3/4] overflow-hidden rounded-card shadow-2xl bg-slate-200">
                    <ImageSlideshow images={project.images} />
                </div>
            </motion.div>

            {/* Content Section (55%) - Animates from Right */}
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="w-full lg:w-[55%]"
                style={{ maxWidth: '600px' }}
            >
                <h3 className="text-4xl md:text-5xl font-display text-navy-deep mb-6 leading-tight">{project.title}</h3>

                <div className="text-slate-600 text-lg leading-relaxed mb-10 font-medium space-y-4">
                    {project.desc.split('\n\n').map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>

                {/* Location & Links */}
                {(project.location || project.website || project.brochure) && (
                    <div className="mt-12 flex flex-wrap gap-4">
                        {project.website && (
                            <a
                                href={project.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block border border-navy-deep/20 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-navy-deep hover:text-white transition-all shadow-sm no-underline"
                            >
                                Visit Website
                            </a>
                        )}
                        {project.brochure && (
                            <a
                                href={project.brochure}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block border border-navy-deep/20 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-navy-deep hover:text-white transition-all shadow-sm no-underline"
                            >
                                Download Brochure
                            </a>
                        )}
                    </div>
                )}
            </motion.div>
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

    const projects = [
        {
            title: "Aluminum Fabrication",
            desc: "The Gesit Companies invests and manages its aluminum fabrication company—Alakasa Andalan Mitra Sejati—since its Joint Venture with Alcan Aluminum in 1972. We focus on aluminum fabrication company that specializes in the industrial sector (e.g., train, marine, plantation, other industrial products) to serve the local and international market.\n\nWe have served countries such as Singapore, Malaysia, Philippine, Brunei, Japan, and Hong Kong over the last 40 years, and we plan on continuing our vision to be recognized as a leader in Manufacturing and Fabricating Aluminum.",
            images: ["/manufacturing/aluminum1.jpeg", "/manufacturing/aluminum2.jpeg", "/manufacturing/aluminum3.jpeg"],
            brochure: "/files/Company-Profile-Alakasa-Andalan-Mitra-Sejati-2022.pdf",
            reverse: true
        },
        {
            title: "Steel & Plastic Packaging",
            desc: "The Gesit Companies invests and manages a packaging company — Rheem Indonesia, which was established by Rheem Australia in 1968. The focus is to build packaging company that specializes in industrial packaging products such as steel and plastic drums with various capacities.\n\nThe specialized sectors such as oil, paint, lubricant, chemical, and food processing to ensure that customers obtain the highest standard of quality products and services, using premium materials and operating internationally standards for have made them at the top of market.",
            images: ["/manufacturing/steel1.jpeg", "/manufacturing/steel2.png", "/manufacturing/steel3.png", "/manufacturing/steel4.jpeg"],
            website: "https://rheem.co.id/",
            reverse: false
        },
        {
            title: "Alumina Refinery & Aluminum Smelter",
            desc: "We believe the Alumina and Aluminum industries can be competitively developed to service domestic and global clients due to redundant rich natural resources and logistical advantages.\n\nThe Gesit Companies will develop a 2 Million-ton Alumina Refinery and, upon completion, develop an Aluminum Smelter which will reach 1 Million ton for the next phase.",
            images: ["/manufacturing/alumina.jpeg"],
            reverse: true
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
                                        alt={`Manufacturing Hero ${index + 1}`}
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
                                Manufacturing
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

            {/* 2. Intro Section - Gold Background Matching User Photo */}
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
                            Serving important industrial sectors, delivering high-quality products and establishing strong long-term partnership.
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
                                maxWidth: '750px',
                                margin: 0
                            }}>
                                The Gesit Companies operates aluminum fabrication and packaging company through two business lines: <span style={{ fontWeight: 700 }}>Alakasa Andalan Mitra Sejati</span> and <span style={{ fontWeight: 700 }}>Rheem Indonesia</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Project Showcase */}
            <section className="py-24 md:py-40 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="space-y-48">
                        {projects.map((project, index) => (
                            <ProjectItem key={index} project={project} index={index} />
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
        </div >
    );
};

export default ManufacturingPage;
