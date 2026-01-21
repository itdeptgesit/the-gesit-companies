import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const PropertyPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const projects = [
        {
            title: "Trinity Tower",
            subtitle: "Premium Office Tower",
            location: "Jakarta, Indonesia",
            propertyType: "Office and Multifunction Area",
            desc: "Completed in 2021, the Trinity Tower is a Premium Grade A office tower constructed by Shimizu Construction located in the heart of Jakarta’s Golden Triangle. It spans over 50 floors with a total of 140,000m2 in built up area. It has a separate 9-floor structure for food, retail, and tenant parking facility",
            points: ["50 Floors High-Rise", "140,000m² Area", "Retail & Food Court"],
            images: ["/property/trinity_05.jpeg", "/property/trinity_06.jpeg"],
            reverse: false
        },
        {
            title: "JS Luwansa",
            subtitle: "Hotel & Convention Center",
            location: "Jakarta, Indonesia",
            propertyType: "Hotel",
            desc: "JS Luwansa Hotel and Convention Center is located in Jakarta’s Golden Triangle, Jakarta’s fastest growing and exclusive business district. Conveniently located in close proximity to major embassies, shopping malls and the toll way. JS Luwansa Hotel and Convention Center is the perfect place for discerning business travelers who need a strategic base to support their business activities from a location within close proximity to the rest of Jakarta.",
            points: ["Strategic Location", "Convention Center", "Luxury Amenities"],
            images: ["/property/property_jsl_2.png", "/property/property_jsl_3.png"],
            reverse: true
        },
        {
            title: "PPHUI Building & Usmar Ismail Hall",
            subtitle: "Integrated Cultural Hub",
            location: "Jakarta, Indonesia",
            propertyType: "Office Space & Concert Hall",
            desc: "Usmar Ismail Hall is an important part of the PPHUI building, which includes a 6,400 m2 office space and state of the art cinema and concert hall located in CBD Jakarta. The Usmar Ismail Concert Hall has been designed with an exclusive interior, comfortable seating arrangement and modern lighting. The design concept ensures the ultimate enjoyment experience for the audience of each presented program. This is the first Integrated Cinema and Concert Hall in Indonesia.",
            points: ["First Integrated Hall", "6,400m² Office", "Heritage Site"],
            images: ["/property/property_PPHUI_Exterior_1.png", "/property/property_PPHUI_Theater_2.png"],
            reverse: false
        },
        {
            title: "Senayan Development",
            subtitle: "Luxury Hotel & Ballroom",
            location: "Jakarta, Indonesia",
            propertyType: "Tower Building",
            desc: "This development boasts a world-class international standard and comprises over 180 rooms with 1,500 m2 of multifunction & ballroom space.",
            points: ["180+ Rooms", "1,500m² Ballroom", "World-Class Standard"],
            images: ["/property/senayan-development-.jpeg"],
            reverse: true
        },
        {
            title: "TOD Rasuna",
            subtitle: "Transit Oriented Development",
            location: "Jakarta, Indonesia",
            propertyType: "Tower Building",
            desc: "This TOD development within inner Jakarta’s Golden Triangle will combine retail, residential, and a world-class theater space together into one – enabling ease of mobility for tenants and reducing on-street traffic.",
            points: ["Golden Triangle", "Retail & Residential", "World-Class Theater"],
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
                                        alt={`Property Hero ${index + 1}`}
                                        initial={{ scale: 1.05 }}
                                        animate={{ scale: activeIndex === index ? 1.2 : 1.05 }}
                                        transition={{ duration: 7, ease: "linear" }}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-navy-deep/75 backdrop-blur-[1px]"></div>
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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                </div>

                <div className="absolute inset-0 z-20 flex items-end pb-20">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="max-w-4xl">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="flex items-center gap-3 text-[#BA9B32] font-bold uppercase tracking-[.4em] text-[10px] mb-4"
                                >
                                    <Sparkles size={16} /> <span>Business Segment</span>
                                </motion.div>

                                <h1 className="text-white text-5xl md:text-6xl font-display leading-[1.2] mb-0 pb-4 overflow-hidden drop-shadow-lg">
                                    <motion.span
                                        initial={{ opacity: 0, y: 100 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="inline-block"
                                    >
                                        Property
                                    </motion.span>
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    className="text-white text-sm md:text-lg max-w-xl font-light leading-relaxed drop-shadow-md"
                                >
                                    Focusing on high-quality residential, commercial and industrial developments across Indonesia.
                                </motion.p>
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

            {/* 2. Refined Gold Introduction Section */}
            <section className="bg-[#BA9B32] py-24 md:py-32 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-white"
                    >
                        <h2 className="text-2xl md:text-5xl font-display leading-[1.3] mb-10 max-w-4xl font-light">
                            Creating value-adding and sustainable assets to our communities and partnering with leading multinational corporations.
                        </h2>
                        <div className="flex gap-8 items-start">
                            <div className="w-1 h-24 bg-white/20"></div>
                            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl pt-2">
                                The Gesit Companies’ property portfolio is historically centered within Jakarta’s Golden Triangle and is focused on commercial real estate development.
                            </p>
                        </div>
                    </motion.div>
                </div>
                {/* Abstract decoration */}
                <div className="absolute -bottom-20 -right-20 text-[20vw] font-display text-white/5 select-none pointer-events-none">
                    GESIT
                </div>
            </section>

            {/* 3. Project Showcase */}
            <section className="py-24 md:py-32 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="space-y-32">
                        {projects.map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col ${project.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}
                            >
                                {/* Image Section */}
                                <div className="w-full lg:w-1/2 relative group">
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                                        <Swiper
                                            modules={[Autoplay, Pagination, EffectFade]}
                                            effect="fade"
                                            autoplay={{ delay: 3000 + (index * 500) }}
                                            pagination={{ clickable: true }}
                                            className="h-full w-full"
                                        >
                                            {project.images.map((img, i) => (
                                                <SwiperSlide key={i}>
                                                    <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                        {/* Floating Location Badge */}
                                        <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
                                            <MapPin size={18} className="text-[#BA9B32]" />
                                            <span className="text-navy-deep text-xs font-bold uppercase tracking-wider">{project.location}</span>
                                        </div>
                                    </div>

                                    {/* Decorative Element */}
                                    <div className={`absolute -bottom-10 ${project.reverse ? '-left-10' : '-right-10'} w-2/3 h-2/3 border border-[#BA9B32]/30 rounded-[2rem] -z-10`}></div>
                                </div>

                                {/* Content Section */}
                                <div className="w-full lg:w-1/2">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-px w-12 bg-[#BA9B32]"></div>
                                        <span className="text-[#BA9B32] font-bold uppercase tracking-widest text-xs">{project.subtitle}</span>
                                    </div>

                                    <h3 className="text-4xl md:text-5xl font-display text-navy-deep mb-4">{project.title}</h3>

                                    {/* Tags */}
                                    <div className="flex gap-4 mb-8">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                            <div className={`w-2 h-2 rounded-full ${project.propertyType === 'Under Development' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                                            {project.propertyType}
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-lg leading-relaxed font-light mb-10">
                                        {project.desc}
                                    </p>

                                    {/* Features Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                        {project.points.map((point, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#BA9B32]/10 flex items-center justify-center text-[#BA9B32]">
                                                    <Sparkles size={14} />
                                                </div>
                                                <span className="text-navy-deep font-medium text-sm">{point}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="group flex items-center gap-3 text-navy-deep font-bold border-b-2 border-[#BA9B32] pb-1 hover:text-[#BA9B32] transition-colors">
                                        <span>View Details</span>
                                        <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PropertyPage;
