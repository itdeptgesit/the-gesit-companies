import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const CSRPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [openInitiative, setOpenInitiative] = useState<string | null>("Healthcare");


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
            desc: "We provide initiatives that ensure proper medical treatment and aid for the sick and injured. Our focus goes beyond donations; we get involved in the causes that help improve the infrastructures needed to support healthcare.",
            image: "/csr/Healthcare.jpeg"
        },
        {
            title: "Environment & Cultural Outreach",
            desc: "We provide cultural training, concerts, religious infrastructure, and enforce diversity in our society, but most importantly we prioritize initiatives that improve the environments in which we operate everyday.",
            image: "/csr/Environment & Cultural Outreach.jpeg"
        },
        {
            title: "Education",
            desc: "We provide hands-on opportunities for disadvantaged children through various initiatives, such as scholarships. Most notably, we ensure that educational facilities are available to the people that we believe need it most.",
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
                        "Distributing ventilators and PPE to 128 Hospitals across in Indonesia",
                        "Distributing food aid to people affected by COVID in 5 provinces in Indonesia"
                    ]
                },
                {
                    subtitle: "Natural Disaster",
                    items: [
                        "Rebuilding healthcare facilities and hospitals",
                        "Donating food and other resources to victims of natural disasters, such as the volcanic eruption at Mount Merapi, Mentawai, the landslide at Puncak and the floods in Jakarta"
                    ]
                },
                {
                    subtitle: "Medical Equipment",
                    items: [
                        "Donating speedboat ambulances in West Kalimantan",
                        "Providing ambulances for DKI Jakarta Region, in partnership with Red Cross Indonesia",
                        "Contributed in the construction of YPAC (Yayasan Penyandang Anak Cacat) by providing Aluminum Profile"
                    ]
                }
            ]
        },
        {
            title: "Environment & Cultural Outreach",
            content: [
                {
                    subtitle: "Environment",
                    items: [
                        "Developing water projects and clean water facilities in remote areas",
                        "Creating and maintaining roads and open road access in some districts in Indonesia",
                        "Collaborating with Yayasan Kebun Raya Indonesia in the conservation of endangered and rare botanical species in Kebun Raya Cibodas and Kebun Raya Bedugul, Bali",
                        "Planting 1,000 trees in West Kalimantan Deforestation Areas"
                    ]
                },
                {
                    subtitle: "Cultural Outreach",
                    items: [
                        "Holding charitable concerts in partnership with foreign embassies to gather donations for disaster victims",
                        "Contributed to the construction of a mosque in Ciloto-Puncak as well as renovation of local churches and temples"
                    ]
                }
            ]
        },
        {
            title: "Education",
            content: [
                {
                    subtitle: "School Facilities & Scholarships",
                    items: [
                        "Building, renovating, and providing school facilities for: North Sumatera (Sekolah Mitra Inalum), Jakarta (Down Syndrome & Deaf School of Cempaka Putih), Jakarta (School of YPAC), and Fujian (Primary, Secondary School, Sport and Library in Normal University)",
                        "Providing over 300 university scholarships per year"
                    ]
                }
            ]
        }
    ];

    return (
        <div className="bg-white min-h-screen">

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
                        {heroImages.map((src, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative h-full w-full overflow-hidden">
                                    <img
                                        src={src}
                                        alt={`CSR Hero ${index + 1}`}
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
                                Corporate Social Responsibility
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

            {/* ================= OVERVIEW ================= */}
            <section className="py-32" style={{ backgroundColor: '#e3eaf4' }}>
                <div className="container mx-auto px-8 md:px-16 lg:px-24 flex flex-col items-center border-b border-slate-200/50 pb-20">
                    <div className="max-w-4xl text-left w-full">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="text-2xl md:text-[32px] text-navy-deep mb-10 leading-[1.5]"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            Creating a positive effect on lives and communities <br className="hidden md:block" />
                            by adding the most value and making a significant <br className="hidden md:block" />
                            and lasting impact through Gesit Foundation.
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="flex gap-6 items-start text-left"
                        >
                            <div className="w-[3px] h-[80px] bg-[#BC9C33] shrink-0 mt-1"></div>
                            <p className="text-navy-deep text-xl md:text-[24px] font-medium leading-[1.6]">
                                Our social investment programs focus on three areas: <span className="font-bold">Healthcare,</span> <br className="hidden md:block" />
                                <span className="font-bold">Environment & Cultural Outreach, and Education.</span>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= FOCUS AREAS ================= */}
            <section className="py-32 bg-navy-deep">
                <div className="container mx-auto px-8 md:px-16 lg:px-24">
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {focusAreas.map((area, index) => (
                            <motion.div
                                key={area.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover="hover"
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="relative group flex flex-col items-center"
                            >
                                {/* Top Image Section */}
                                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-card shadow-2xl shrink-0">
                                    <img
                                        src={area.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                                        alt={area.title}
                                    />
                                    <div className="absolute inset-0 bg-black/10"></div>
                                </div>

                                {/* Connecting Line Spacer & Animated Overlay */}
                                <div className="relative h-10 w-full flex justify-center shrink-0 z-40">
                                    {/* Base subtle line - in front (z-20) */}
                                    <div className="absolute top-[-32px] bottom-[-16px] w-[2.5px] bg-white/40 z-20 pointer-events-none"></div>

                                    {/* Animated active line on hover - clearly in front (z-30) */}
                                    <motion.div
                                        variants={{
                                            hover: { scaleY: 1, opacity: 1 }
                                        }}
                                        initial={{ scaleY: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="absolute top-[-32px] bottom-[-16px] w-[3px] bg-white z-30 pointer-events-none origin-top"
                                    />
                                </div>

                                {/* Bottom Info Box */}
                                <div className="w-full bg-[#BC9C33] p-8 text-left shadow-2xl relative z-10 min-h-[260px] flex flex-col items-start rounded-card">
                                    <h3 className="text-white text-2xl font-display mb-6 leading-tight h-16 flex items-center">{area.title}</h3>
                                    <p className="text-white/95 text-sm font-light leading-relaxed tracking-wide flex-1">
                                        {area.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= INITIATIVES ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-center text-5xl font-display mb-20 text-navy-deep"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        Our CSR Initiatives & Programs
                    </motion.h2>

                    <div className="divide-y divide-slate-200">
                        {initiatives.map(initiative => (
                            <div key={initiative.title} className="py-4">
                                <button
                                    onClick={() =>
                                        setOpenInitiative(
                                            openInitiative === initiative.title ? null : initiative.title
                                        )
                                    }
                                    className="w-full py-8 flex items-center gap-8 text-left transition-colors group"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${openInitiative === initiative.title ? "bg-[#BC9C33] text-white" : "bg-[#BC9C33] text-white"}`}>
                                        {openInitiative === initiative.title ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                    <span className="text-3xl font-display text-navy-deep group-hover:text-[#BC9C33] transition-colors">{initiative.title}</span>
                                </button>

                                <AnimatePresence>
                                    {openInitiative === initiative.title && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-20 pr-8 pb-12 pt-2">
                                                {initiative.content.map(block => (
                                                    <div key={block.subtitle} className="mb-10 last:mb-0">
                                                        <h4 className="text-xl font-bold text-navy-deep/80 mb-6">
                                                            {block.subtitle}
                                                        </h4>
                                                        <ul className="space-y-5">
                                                            {block.items.map((item, i) => (
                                                                <li key={i} className="flex items-start gap-5 text-lg text-slate-600 font-light leading-relaxed">
                                                                    <div className="w-2 h-2 rounded-full bg-slate-400 mt-3 shrink-0" />
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
                        {/* Closing line for the last item */}
                        <div className="border-b border-slate-200"></div>
                    </div>
                </div>
            </section>

            {/* ================= SMOOTH INFINITE SCROLL GALLERY ================= */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="relative w-full">
                    <div className="flex overflow-hidden relative">
                        <motion.div
                            className="flex gap-12 px-4 py-12 items-center"
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
                                    className="w-[450px] h-[300px] shrink-0 rounded-xl overflow-hidden transition-all duration-700 group relative"
                                >
                                    <img
                                        src={src}
                                        alt={`CSR Gallery ${index}`}
                                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2.5s] ease-out"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
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
