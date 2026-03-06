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
                        alt="Slideshow"
                    />
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
            {/* Image Section (35%) - Animates from Left */}
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

                <div className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                    {project.desc}
                </div>

                {/* Location & Property Type - Aligned with Image Reference */}
                <div className="mb-12 flex gap-8 items-start">
                    <div className="w-[3px] h-20 bg-[#BC9C33] opacity-80 mt-1"></div>
                    <div className="space-y-4">
                        {project.location && (
                            <h4 className="text-navy-deep text-2xl" style={{ fontFamily: 'Georgia, serif' }}>
                                Location : {project.location}
                            </h4>
                        )}
                        {project.propertyType && (
                            <p className="text-slate-500 text-xl font-body">
                                Property Type : {project.propertyType}
                            </p>
                        )}
                    </div>
                </div>

                {project.website && (
                    <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-10 py-4 border border-navy-deep rounded-full text-navy-deep text-lg hover:bg-navy-deep hover:text-white transition-all duration-300 no-underline shadow-sm hover:shadow-md"
                    >
                        Learn More
                    </a>
                )}
            </motion.div>
        </div>
    );
};

const PropertyPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const projects = [
        {
            title: "Trinity Tower",
            subtitle: "",
            location: "Jakarta, Indonesia",
            propertyType: "Office and Multifunction Area",
            desc: "Completed in 2021, the Trinity Tower is a Premium Grade A office tower constructed by Shimizu Construction located in the heart of Jakarta’s Golden Triangle. It spans over 50 floors with a total of 140,000m2 in built up area. It has a separate 9-floor structure for food, retail, and tenant parking facility",
            points: [],
            images: [
                "/property/trinity_01.jpeg",
                "/property/trinity_02.jpeg",
                "/property/trinity_03.jpeg",
                "/property/trinity_04.jpeg",
                "/property/trinity_05.jpeg",
                "/property/trinity_06.jpeg"
            ],
            reverse: false,
            website: "https://trinitytower.co.id/"
        },
        {
            title: "JS Luwansa",
            subtitle: "",
            location: "Jakarta, Indonesia",
            propertyType: "Hotel",
            desc: "JS Luwansa Hotel and Convention Center is located in Jakarta’s Golden Triangle, Jakarta’s fastest growing and exclusive business district. Conveniently located in close proximity to major embassies, shopping malls and the toll way.",
            points: [],
            images: ["/property/property_jsl_2.png", "/property/property_jsl_3.png"],
            reverse: true,
            website: "https://www.jsluwansa.com/"
        },
        {
            title: "PPHUI Building & Usmar Ismail Hall",
            subtitle: "",
            location: "Jakarta, Indonesia",
            propertyType: "Office Space & Concert Hall",
            desc: "Usmar Ismail Hall is an important part of the PPHUI building, which includes a 6,400 m2 office space and state of the art cinema and concert hall located in CBD Jakarta. This is the first Integrated Cinema and Concert Hall in Indonesia.",
            points: [],
            images: ["/property/property_PPHUI_Exterior_1.png", "/property/property_PPHUI_Theater_2.png"],
            reverse: false,
            website: "https://usmarismailhall.com/"
        },
        {
            title: "Senayan Development",
            subtitle: "",
            location: "Jakarta, Indonesia",
            propertyType: "Tower Building",
            desc: "This development boasts a world-class international standard and comprises over 180 rooms with 1,500 m2 of multifunction & ballroom space.",
            points: [],
            images: ["/property/senayan-development-.jpeg"],
            reverse: true
        },
        {
            title: "TOD Rasuna",
            subtitle: "",
            location: "Jakarta, Indonesia",
            propertyType: "Tower Building",
            desc: "This TOD development within inner Jakarta’s Golden Triangle will combine retail, residential, and a world-class theater space together into one – enabling ease of mobility for tenants and reducing on-street traffic.",
            points: [],
            images: ["/property/property_TOD_Rasuna_1.png", "/property/tod-property-lrtcitycibubur.jpg"],
            reverse: false
        }
    ];

    const heroImages = [
        "/property/cover.png",
        "/property/cover 2.jpeg",
        "/property/cover 3.png"
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
                                        alt={`Property Hero ${index + 1}`}
                                        className="w-full h-full object-cover animate-property-zoom"
                                        style={{ transformOrigin: 'center' }}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                    />
                                    {/* Blue gradient from top - same as home hero */}
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
                            {/* Only "Property" title */}
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
                                Property
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
                            Creating value-adding and sustainable assets to our communities and partnering with leading multinational corporations.
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
                                The Gesit Companies’ property portfolio is historically centered within Jakarta’s Golden Triangle and is focused on commercial real estate development.
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

            {/* Slow zoom animation for hero */}
            <style>{`
                .animate-property-zoom {
                    animation: propertyZoom 30s linear infinite alternate;
                    will-change: transform;
                }
                @keyframes propertyZoom {
                    0% { transform: scale(1.0); }
                    100% { transform: scale(1.1); }
                }

                /* Custom Swiper Improvements */
                .property-swiper-container .swiper-slide-active img {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default PropertyPage;
