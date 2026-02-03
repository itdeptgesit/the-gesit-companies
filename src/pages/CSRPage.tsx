import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const CSRPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [openInitiative, setOpenInitiative] = useState<string | null>("Healthcare");

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    /* ================= HERO IMAGES ================= */
    const heroImages = [
        "/csr/cover1.jpeg",
        "/csr/cover2.jpeg",
        "/csr/cover3.jpeg",
    ];

    /* ================= GALLERY IMAGES ================= */
    const csrGalleryImages = [
        "/csr/gallery/gallery1.jpeg",
        "/csr/gallery/gallery2.jpeg",
        "/csr/gallery/gallery3.jpeg",
        "/csr/gallery/gallery4.jpeg",
        "/csr/gallery/gallery5.jpeg",
        "/csr/gallery/gallery6.jpeg",
        "/csr/gallery/gallery7.jpeg",
        "/csr/gallery/gallery8.jpeg",
        "/csr/gallery/gallery9.jpeg",
        "/csr/gallery/gallery10.jpeg",
        "/csr/gallery/gallery11.jpeg",
        "/csr/gallery/gallery12.jpg",
        "/csr/gallery/gallery13.jpg",
        "/csr/gallery/gallery14.jpg",
        "/csr/gallery/gallery15.jpg",
        "/csr/gallery/gallery16.jpg",
        "/csr/gallery/gallery17.jpg",
        "/csr/gallery/gallery18.jpg",
        "/csr/gallery/gallery19.jpg",
        "/csr/gallery/gallery20.jpg",
    ];

    const focusAreas = [
        {
            title: "Healthcare",
            desc: "We provide individual healthcare programs that focus on healthcare for the poor and those in need across Indonesia.",
            image: "/csr/Healthcare.jpeg"
        },
        {
            title: "Environment & Cultural Outreach",
            desc: "We conduct our business responsibly while supporting environmental and cultural sustainability.",
            image: "/csr/Environment & Cultural Outreach.jpeg"
        },
        {
            title: "Education",
            desc: "We encourage education for disadvantaged children through scholarships and facilities.",
            image: "/csr/Education.jpeg"
        }
    ];

    const initiatives = [
        {
            title: "Healthcare",
            content: [
                {
                    subtitle: "Pandemic",
                    items: [
                        "Distributing ventilators and PPE to hospitals across Indonesia",
                        "Providing food aid during COVID-19"
                    ]
                },
                {
                    subtitle: "Natural Disaster",
                    items: [
                        "Rebuilding healthcare facilities",
                        "Emergency relief for disaster victims"
                    ]
                }
            ]
        },
        {
            title: "Environment & Cultural Outreach",
            content: [
                {
                    subtitle: "Environmental Conservation",
                    items: [
                        "Tree planting and reforestation programs",
                        "Sustainable business practices"
                    ]
                }
            ]
        },
        {
            title: "Education",
            content: [
                {
                    subtitle: "Scholarships",
                    items: [
                        "Educational aid for underprivileged children",
                        "University partnerships"
                    ]
                }
            ]
        }
    ];

    return (
        <div className="bg-white min-h-screen">

            {/* ================= HERO ================= */}
            <section className="relative h-screen overflow-hidden">
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
                        {heroImages.map((src, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative h-full w-full overflow-hidden">
                                    <motion.img
                                        src={src}
                                        alt={`CSR Hero ${index + 1}`}
                                        initial={{ scale: 1.05 }}
                                        animate={{ scale: activeIndex === index ? 1.2 : 1.05 }}
                                        transition={{ duration: 7, ease: "linear" }}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-navy-deep/75 backdrop-blur-[1px]" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Hero Timeline / Progress Bar - TOP */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-white/10 z-20 shadow-lg">
                        <motion.div
                            key={activeIndex}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-full bg-[#BA9B32] shadow-[0_0_10px_rgba(186,155,50,0.5)]"
                        />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                </div>

                {/* Hero Content Area */}
                <div className="absolute inset-0 z-20 flex items-end pb-20">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="max-w-4xl">
                                <h1 className="text-white text-5xl md:text-6xl font-display leading-[1.2] mb-0 pb-4 overflow-hidden drop-shadow-lg">
                                    <motion.span
                                        initial={{ opacity: 0, y: 100 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="inline-block"
                                    >
                                        Corporate Social Responsibility
                                    </motion.span>
                                </h1>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 z-30">
                                <button className="hero-prev w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#BA9B32] hover:border-[#BA9B32] transition-all duration-300 group">
                                    <ChevronLeft size={20} className="md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button className="hero-next w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#BA9B32] hover:border-[#BA9B32] transition-all duration-300 group">
                                    <ChevronRight size={20} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            {/* ================= OVERVIEW ================= */}
            <section className="py-24">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-display mb-8">
                        Creating a positive and lasting impact through Gesit Foundation
                    </motion.h2>
                    <motion.p {...fadeIn} className="font-semibold">
                        Focused on Healthcare, Environment & Culture, and Education.
                    </motion.p>
                </div>
            </section>

            {/* ================= FOCUS AREAS ================= */}
            <section className="pb-24">
                <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
                    {focusAreas.map((area, index) => (
                        <motion.div
                            key={area.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="group flex flex-col items-center h-full"
                        >
                            {/* Top Image Section */}
                            <div className="relative w-full aspect-[4/3] rounded-card-sm overflow-hidden shadow-xl mb-4 shrink-0">
                                <img
                                    src={area.image}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                    alt={area.title}
                                />
                                <div className="absolute inset-0 bg-navy-deep/10"></div>
                            </div>

                            {/* Connecting Line */}
                            <motion.div
                                initial={{ height: 0 }}
                                whileInView={{ height: 40 }}
                                transition={{ duration: 0.8, delay: 0.5 + (index * 0.1) }}
                                className="w-[1.5px] bg-slate-200 shrink-0"
                            ></motion.div>

                            {/* Bottom Info Box */}
                            <div className="w-full bg-[#BA9B32] p-8 text-center shadow-lg rounded-card relative z-10 group-hover:-translate-y-2 transition-transform duration-500 flex-1 flex flex-col justify-center">
                                <h3 className="text-white text-2xl font-display mb-4 tracking-wide">{area.title}</h3>
                                <div className="w-10 h-[1px] bg-white/40 mx-auto mb-6 shrink-0"></div>
                                <p className="text-white/90 text-sm font-medium leading-relaxed tracking-wide px-2">
                                    {area.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ================= INITIATIVES ================= */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <motion.h2 {...fadeIn} className="text-center text-5xl font-display mb-20 text-navy-deep">
                        Our CSR Initiatives & Programs
                    </motion.h2>

                    <div className="space-y-4">
                        {initiatives.map(initiative => (
                            <div key={initiative.title} className="bg-white rounded-card-sm overflow-hidden shadow-sm border border-slate-100">
                                <button
                                    onClick={() =>
                                        setOpenInitiative(
                                            openInitiative === initiative.title ? null : initiative.title
                                        )
                                    }
                                    className="w-full px-8 py-6 flex justify-between items-center hover:bg-slate-50 transition-colors"
                                >
                                    <span className="text-xl font-display text-navy-deep">{initiative.title}</span>
                                    <div className={`p-2 rounded-full transition-all duration-300 ${openInitiative === initiative.title ? "bg-[#BA9B32] text-white rotate-180" : "bg-slate-100 text-slate-400"}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openInitiative === initiative.title && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="overflow-hidden bg-slate-50/50"
                                        >
                                            <div className="px-8 pb-8 pt-4">
                                                {initiative.content.map(block => (
                                                    <div key={block.subtitle} className="mb-6 last:mb-0">
                                                        <h4 className="text-xs uppercase font-bold tracking-widest text-[#BA9B32] mb-4">
                                                            {block.subtitle}
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {block.items.map((item, i) => (
                                                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-light">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= SMOOTH INFINITE SCROLL GALLERY ================= */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="text-center mb-16">
                    <span className="text-[#BA9B32] font-bold uppercase tracking-[.3em] text-xs mb-3 block">From the Ground</span>
                    <h2 className="text-4xl font-display text-navy-deep">Gallery of Impact</h2>
                </div>

                <div className="relative w-full">
                    <div className="flex overflow-hidden relative">
                        <motion.div
                            className="flex gap-12 px-4 py-20 items-center"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                ease: "linear",
                                duration: 180,
                                repeat: Infinity,
                            }}
                            style={{ width: "fit-content" }}
                        >
                            {[...csrGalleryImages, ...csrGalleryImages].map((src, index) => (
                                <div
                                    key={index}
                                    className="w-[450px] h-[300px] shrink-0 rounded-card-sm overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[#BA9B32]/40 group relative"
                                >
                                    <img
                                        src={src}
                                        alt={`CSR Gallery ${index}`}
                                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2.5s] ease-out"
                                    />
                                    <div className="absolute inset-0 bg-navy-deep/10 group-hover:bg-transparent transition-colors duration-700"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CSRPage;
