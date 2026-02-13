import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
// @ts-ignore
import { supabase } from "../lib/supabase";

/**
 * AboutPage - Ultra-Premium Editorial Design
 * Refined version with smooth reveals and no scroll-parallax.
 */
const AboutPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [content, setContent] = useState<any>({});


    // Default static values for Core Values as fallback
    const defaultCoreValues = [
        {
            id: "01",
            title: "Integrity",
            desc: "Think, Talk, Act Honestly and be Ethical",
            image: "/about/integrity.jpeg"
        },
        {
            id: "02",
            title: "Respect",
            desc: "Be Emphatetic, Listen to Others and Give an Ethical Response",
            image: "/about/respect.jpeg"
        },
        {
            id: "03",
            title: "Competency",
            desc: "Knowledgeable, Skillful and Right Attitude",
            image: "/about/competency.jpeg"
        },
        {
            id: "04",
            title: "Passion",
            desc: "Strongly Engaged and Fully Accountable with Respective Job",
            image: "/about/passion.jpeg"
        }
    ];
    const [coreValues, setCoreValues] = useState<any[]>(defaultCoreValues);


    const revealVariants: Variants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } as any
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay was prevented:", error);
            });
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch key-value content
            const { data: pageData } = await supabase
                .from('page_content')
                .select('*')
                .eq('page', 'about');

            if (pageData) {
                const map = pageData.reduce((acc: any, item: any) => {
                    acc[item.key] = item.value;
                    return acc;
                }, {});
                setContent(map);

                // Parse business segments if available

            }

            // Fetch core values
            const { data: valuesData } = await supabase
                .from('core_values')
                .select('*')
                .order('order_index', { ascending: true });

            if (valuesData && valuesData.length > 0) {
                setCoreValues(valuesData.map(v => ({
                    id: v.id,
                    title: v.title,
                    desc: v.description,
                    image: v.image_url
                })));
            }

        };
        fetchData();
    }, []);

    return (
        <div ref={containerRef} className="bg-white font-body selection:bg-[#BC9C33] selection:text-white">
            {/* 1. Hero */}
            <section className="relative h-screen flex items-end justify-start overflow-hidden bg-navy-deep">
                <div className="absolute inset-0 z-0">
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/video/about-us-video.mp4" type="video/mp4" />
                    </video>
                    {/* Lightened Overlays */}
                    <div className="absolute inset-0 bg-navy-deep/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 pb-24 md:pb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] } as any}
                        className="max-w-6xl"
                    >
                        <h1 className="text-white text-[10vw] md:text-8xl font-display leading-[1] mb-0 uppercase tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                            About <span className="text-[#BC9C33]">Us</span>
                        </h1>
                    </motion.div>
                </div>

                <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-16">
                    <div className="w-[1px] h-40 bg-white/10"></div>
                    <span className="text-white/40 uppercase tracking-[.8em] text-[10px] [writing-mode:vertical-lr] font-bold">
                        THE GESIT COMPANIES
                    </span>
                    <div className="w-[1px] h-40 bg-white/10"></div>
                </div>
            </section>

            {/* 2. Intro */}
            <section className="py-24 md:py-40 bg-navy-deep overflow-hidden relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="relative"
                        >
                            <div className="space-y-12">                                <motion.p variants={revealVariants} className="text-white/80 text-xl md:text-3xl font-light leading-relaxed max-w-4xl">
                                {content['intro_description'] || <>Founded in the 1950s as a small private trading company, Gesit has grown to become a business leader in the fields of <span className="text-white font-medium">Property</span>, <span className="text-white font-medium">Trading & Service</span>, <span className="text-white font-medium">Manufacturing</span>, and <span className="text-white font-medium">Natural Resources</span>.</>}
                            </motion.p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Philosophy */}
            <section className="pb-24 md:pb-40 relative overflow-hidden bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-start">
                        <div className="absolute top-0 right-0 text-[35vw] font-display text-slate-50 pointer-events-none -z-10 select-none leading-none translate-x-[10%]">
                            艺成
                        </div>

                        <div className="lg:col-span-6 pt-10 md:pt-20">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={containerVariants}
                            >
                                <motion.h3
                                    variants={{
                                        hidden: { opacity: 0, filter: "blur(20px)", y: 20 },
                                        visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } as any }
                                    }}
                                    className="bg-gradient-to-br from-[#BC9C33] via-[#e2c15a] to-[#8a6d3b] bg-clip-text text-transparent text-7xl md:text-8xl font-display mb-6 leading-none py-2"
                                    style={{ fontWeight: 510 }}
                                >
                                    {content['philosophy_heading'] || "艺成"}
                                </motion.h3>

                                <motion.p variants={revealVariants} className="text-navy-deep text-xl font-light mb-12 leading-relaxed">
                                    {content['philosophy_meaning'] || "Based on the Mandarin “yi cheng” and Hokkien “geseng”, which means “perfection for art”"}
                                </motion.p>

                                <motion.h4 variants={revealVariants} className="text-navy-deep text-2xl md:text-3xl font-display font-light mb-14 leading-[1.4] max-w-xl border-l-2 border-[#BC9C33]/30 pl-8">
                                    {content['philosophy_subheading'] || "Gesit is a name chosen to represent our vision for strategic resourcefulness and passionate energy in our business endeavors."}
                                </motion.h4>

                                <div className="space-y-8 text-slate-600 font-light text-base md:text-lg leading-relaxed max-w-lg whitespace-pre-line">
                                    <motion.p variants={revealVariants}>
                                        {content['philosophy_description'] || "Over the years, the Gesit Companies continue to capture opportunities to grow its business portfolio amidst changes in economy and increased competition – part of this by being resourceful, agile and competitive. Our businesses are managed and operated by a team of professionals, headquartered in Jakarta. As the Gesit Companies continue to grow, we also believe in investing in our human capital and other areas to build competitive advantages."}
                                    </motion.p>

                                    <motion.p variants={revealVariants} className="font-bold text-navy-deep text-xl mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
                                        <span className="w-12 h-[1px] bg-[#BC9C33]"></span>
                                        {content['philosophy_closing'] || "We are committed to Indonesia."}
                                    </motion.p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-6 relative pt-20 md:pt-32">
                            <motion.div
                                initial={{ opacity: 0, scale: 1.05 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] } as any}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="aspect-[4/5] rounded-card-sm md:rounded-card overflow-hidden shadow-2xl relative z-10">
                                    <img src="/about/property.jpeg" className="w-full h-full object-cover" alt="History" loading="lazy" />
                                    <div className="absolute inset-0 bg-navy-deep/20"></div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1.5, delay: 0.4 }}
                                    viewport={{ once: true }}
                                    className="absolute -bottom-12 md:-bottom-20 -left-8 md:-left-20 w-3/4 aspect-square rounded-card-sm md:rounded-card overflow-hidden shadow-2xl border-[8px] md:border-[12px] border-white z-20 hidden md:block"
                                >
                                    <img src="/about/resources.jpeg" className="w-full h-full object-cover" alt="Context" loading="lazy" />
                                    <div className="absolute inset-0 bg-[#BC9C33]/10"></div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Vision & Mission */}
            <section className="py-24 md:py-40 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="relative group/vision"
                        >

                            <div className="relative aspect-video rounded-card-sm md:rounded-card shadow-2xl overflow-hidden bg-navy-deep">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    poster="/hero/property.png"
                                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                                >
                                    <source src="/video/about-us-video.mp4" type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="space-y-16"
                        >
                            <motion.div variants={revealVariants}>
                                <span className="text-[#BC9C33] font-semibold uppercase tracking-[.4em] text-[11px] mb-4 block">Our Vision</span>
                                <h3 className="text-navy-deep text-2xl md:text-3xl font-display leading-relaxed font-light">
                                    {content['vision_statement'] || "To be a Group of Companies that are Recognized by Stakeholders as Strategic First Choice Business Partner"}
                                </h3>
                            </motion.div>

                            <motion.div variants={revealVariants}>
                                <span className="text-[#BC9C33] font-semibold uppercase tracking-[.4em] text-[11px] mb-4 block">Our Mission</span>
                                <h3 className="text-navy-deep text-2xl md:text-3xl font-display leading-relaxed font-light">
                                    {content['mission_statement'] || "To Establish Resourceful Business Entities that Deliver Sustainable Value to Stakeholders"}
                                </h3>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. Our Business */}


            {/* 6. Core Values (Restored) */}
            <section className="py-24 md:py-40 bg-slate-50">
                <div className="container mx-auto px-6 mb-20 md:mb-32 flex flex-col items-center text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-navy-deep text-5xl md:text-6xl font-display">Our Core Values.</h2>
                    </motion.div>
                </div>

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-6">
                        {coreValues.map((value, idx) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group flex flex-col items-center h-full"
                            >
                                <div className="relative w-full aspect-video rounded-card-sm overflow-hidden shadow-xl mb-4 shrink-0">
                                    <img src={value.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt={value.title} loading="lazy" />
                                    <div className="absolute inset-0 bg-navy-deep/10"></div>
                                </div>
                                <div className="w-[1.5px] h-10 bg-slate-200 shrink-0"></div>
                                <div className="w-full bg-[#BC9C33] p-8 text-center shadow-lg rounded-card relative group-hover:-translate-y-2 transition-transform duration-500 flex-1 flex flex-col justify-center">
                                    <h4 className="text-white text-2xl font-display mb-6 tracking-wide">{value.title}</h4>
                                    <div className="w-10 h-[1px] bg-white/40 mx-auto mb-6 shrink-0"></div>
                                    <p className="text-white/90 text-sm font-medium leading-relaxed tracking-wide">{value.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
