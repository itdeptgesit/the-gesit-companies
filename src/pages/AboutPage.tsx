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
                            <div className="space-y-12">                                <motion.p variants={revealVariants} className="text-white/80 text-xl md:text-3xl font-light leading-relaxed max-w-4xl font-display">
                                {content['intro_description'] || <>Founded in the 1950s as a small private trading company, Gesit has grown to become a business leader in the fields of <span className="text-white font-medium">Property</span>, <span className="text-white font-medium">Trading & Service</span>, <span className="text-white font-medium">Manufacturing</span>, and <span className="text-white font-medium">Natural Resources</span>.</>}
                            </motion.p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Philosophy Section - Aligned Split Layout */}
            <section className="relative overflow-hidden bg-white border-y border-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[85vh]">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.2,
                                        ease: [0.22, 1, 0.36, 1]
                                    }
                                }
                            }}
                            className="py-24 lg:py-32 pr-0 lg:pr-20"
                        >
                            <div className="max-w-xl">
                                <motion.h3
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } }
                                    }}
                                    className="bg-gradient-to-br from-[#BC9C33] via-[#e2c15a] to-[#8a6d3b] bg-clip-text text-transparent text-7xl md:text-8xl mb-10 leading-none"
                                    style={{ fontWeight: 500, fontFamily: "'Noto Serif SC', serif" }}
                                >
                                    {content['philosophy_heading'] || "艺成"}
                                </motion.h3>

                                <motion.p
                                    variants={{
                                        hidden: { opacity: 0, x: -30 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } }
                                    }}
                                    className="text-navy-deep text-lg md:text-xl font-light mb-12 leading-relaxed border-l-4 border-[#BC9C33] pl-8"
                                >
                                    {content['philosophy_meaning'] || <>Based on the Mandarin <span className="font-bold">“yi cheng”</span> and Hokkien <span className="font-bold">“geseng”</span>, which means <span className="font-bold">“perfection for art”</span></>}
                                </motion.p>

                                <motion.h4
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } }
                                    }}
                                    className="text-navy-deep text-2xl md:text-3xl font-display font-light mb-14 leading-relaxed italic text-slate-500"
                                >
                                    {content['philosophy_subheading'] || "Gesit is a name chosen to represent our vision for strategic resourcefulness and passionate energy in our business endeavors."}
                                </motion.h4>

                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } }
                                    }}
                                    className="space-y-8 text-slate-600 font-light text-base md:text-lg leading-relaxed"
                                >
                                    <p>
                                        {content['philosophy_description'] || "Over the years, the Gesit Companies continue to capture opportunities to grow its business portfolio amidst changes in economy and increased competition – part of this by being resourceful, agile and competitive. Our businesses are managed and operated by a team of professionals, headquartered in Jakarta. As the Gesit Companies continue to grow, we also believe in investing in our human capital and other areas to build competitive advantages."}
                                    </p>

                                    <div className="pt-10 flex items-center gap-6 group">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: 64 }}
                                            transition={{ duration: 1.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                                            viewport={{ once: true }}
                                            className="h-px bg-[#BC9C33]"
                                        ></motion.div>
                                        <p className="font-bold text-navy-deep text-xl">
                                            {content['philosophy_closing'] || "We are committed to Indonesia."}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right: Large Hero Image Area */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="relative h-full py-24 lg:py-32 hidden lg:block"
                        >
                            <img
                                src="/about/resources.jpeg"
                                className="w-full h-full object-cover rounded-[2rem] shadow-xl"
                                alt="Philosophy"
                            />
                            <div className="absolute inset-0 bg-navy-deep/5 pointer-events-none rounded-[2rem] my-24 lg:my-32"></div>
                        </motion.div>

                        {/* Mobile Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="w-full h-[400px] lg:hidden mb-12 relative rounded-[2rem] overflow-hidden"
                        >
                            <img src="/about/resources.jpeg" className="w-full h-full object-cover" alt="Philosophy" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Vision & Mission - Refined Structure */}
            <section className="py-24 md:py-40 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50, scale: 0.95 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true }}
                            className="lg:col-span-7 relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                        >
                            <video autoPlay loop muted playsInline className="w-full aspect-video object-cover">
                                <source src="/video/about-us-video.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </motion.div>

                        <div className="lg:col-span-5 space-y-16">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                            >
                                <span className="text-[#BC9C33] font-bold uppercase tracking-[.4em] text-[11px] mb-4 block">Our Vision</span>
                                <h3 className="text-navy-deep text-2xl md:text-3xl font-display leading-relaxed font-light border-b border-slate-100 pb-10">
                                    {content['vision_statement'] || "To be a Group of Companies that are Recognized by Stakeholders as Strategic First Choice Business Partner"}
                                </h3>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <span className="text-[#BC9C33] font-bold uppercase tracking-[.4em] text-[11px] mb-4 block">Our Mission</span>
                                <h3 className="text-navy-deep text-2xl md:text-3xl font-display leading-relaxed font-light">
                                    {content['mission_statement'] || "To Establish Resourceful Business Entities that Deliver Sustainable Value to Stakeholders"}
                                </h3>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Our Business */}


            {/* 6. Core Values - CSR Style Display */}
            <section className="py-24 md:py-40 bg-white">
                <div className="container mx-auto px-6 mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-navy-deep text-5xl md:text-6xl font-display tracking-tight">Our Core Values</h2>
                        <div className="w-24 h-[2px] bg-[#BC9C33] mx-auto mt-8"></div>
                    </motion.div>
                </div>

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreValues.map((value, idx) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group flex flex-col items-center h-full"
                            >
                                {/* Top Image Section (Landscape) */}
                                <div className="relative w-full aspect-video rounded-[1.5rem] overflow-hidden shadow-xl mb-4 shrink-0">
                                    <img
                                        src={value.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                        alt={value.title}
                                    />
                                    <div className="absolute inset-0 bg-navy-deep/10 group-hover:bg-transparent transition-colors"></div>
                                </div>

                                {/* Connecting Line */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: 40 }}
                                    transition={{ duration: 0.8, delay: 0.5 + (idx * 0.1) }}
                                    className="w-[1.5px] bg-slate-200 shrink-0"
                                ></motion.div>

                                {/* Bottom Info Box (Gold) */}
                                <div className="w-full bg-[#BC9C33] p-8 text-center shadow-lg rounded-[2rem] relative z-10 group-hover:-translate-y-2 transition-transform duration-500 flex-1 flex flex-col justify-center">
                                    <h4 className="text-white text-xl md:text-2xl font-display mb-4 tracking-wide">{value.title}</h4>
                                    <div className="w-10 h-[1px] bg-white/40 mx-auto mb-6 shrink-0"></div>
                                    <p className="text-white/90 text-[13px] font-medium leading-relaxed px-2">
                                        {value.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div >
    );
};

export default AboutPage;
