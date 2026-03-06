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
            {/* 1. Hero - Full screen video background */}
            <section className="relative h-screen flex items-end overflow-hidden bg-[#103065]">
                <div className="absolute inset-0 z-0">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                        <source src="/video/about-us-video.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/30"></div>
                    {/* Navy blue gradient from top for navbar area */}
                    <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-[#103065]/90 to-transparent z-[1]"></div>
                </div>
                <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 pb-16 md:pb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="text-white text-5xl md:text-7xl"
                        style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
                    >
                        About
                    </motion.h2>
                </div>
            </section>

            {/* 2. Intro Statement - Navy blue background, white text, centered */}
            <section className="bg-[#103065] py-24 md:py-36">
                <div className="max-w-[900px] mx-auto px-8 md:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                    >
                        <h3
                            className="text-white text-2xl md:text-[2.2rem] leading-[1.6] font-normal text-center"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            {content['intro_description_text'] || "Founded in the 1950s as a small private trading company, Gesit has grown to become a business leader in the fields of Property, Trading & Service, Manufacturing, and Natural Resources."}
                        </h3>
                    </motion.div>
                </div>
            </section>

            {/* 3. Philosophy Section - 50/50 split: text left (centered), image right */}
            <section className="relative overflow-hidden">
                <div className="flex flex-col-reverse lg:flex-row w-full">
                    {/* Left: Content - centered */}
                    <div className="w-full lg:w-1/2 bg-[#e3eaf4] py-16 md:py-24 px-8 md:px-16 lg:px-20 flex flex-col items-center justify-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="max-w-[560px]"
                        >
                            {/* 艺成 SVG */}
                            <motion.div
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
                                className="mb-8 w-[160px] md:w-[200px]"
                            >
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" className="w-full h-auto fill-[#BC9C33]">
                                    <g>
                                        <path d="M416.77,124.05h66.25l27.45-39.99c2.78-3.97,5.37-5.97,7.76-5.97c6.36,0,19.59,8.86,39.69,26.56 c20.09,17.71,30.14,28.95,30.14,33.72c0,2-3.79,2.98-11.34,2.98H416.77c0,12.74,0.39,25.87,1.19,39.39l1.19,19.7 c0,1.99-0.4,3.49-1.19,4.48c-0.8,1-3.98,2.69-9.55,5.07c-5.58,2.39-12.83,4.68-21.79,6.86c-8.95,2.19-14.62,3.28-17.01,3.28 c-2.39,0-3.58-2.78-3.58-8.36v-70.43H235.33v71.03c0,3.58-0.7,6.17-2.09,7.76c-1.4,1.6-7.07,3.68-17.01,6.27 c-9.95,2.59-20.1,3.88-30.44,3.88c-3.19,0-4.78-2.39-4.78-7.16l1.79-81.77H62.84c-10.35,0-18.71,1.19-25.07,3.58l-14.32-23.87 c8.36,1.99,18.3,2.98,29.84,2.98h129.51V66.16c0-13.13-0.6-27.65-1.79-43.57c34.22,7.16,55.4,12.24,63.56,15.22 c8.15,2.98,12.24,5.88,12.24,8.65c0,4.38-7.16,9.55-21.49,15.52v62.07h130.71V73.32c0-19.1-0.8-33.62-2.39-43.57 c14.72,3.19,29.64,6.77,44.76,10.74c15.12,3.98,24.07,6.77,26.86,8.36c2.78,1.6,4.18,3.38,4.18,5.37c0,3.58-7.56,8.76-22.68,15.52 V124.05z M342.76,254.76l29.84-23.28c3.58-2.78,7.36-4.18,11.34-4.18c5.17,0,12.03,3.49,20.59,10.44 c8.55,6.97,18.1,14.13,28.65,21.49c10.54,7.37,15.82,12.53,15.82,15.52c0,2.98-1.3,5.18-3.88,6.56c-2.59,1.4-9.05,2.09-19.4,2.09 c-10.35,0-18.9,1.89-25.66,5.67c-6.77,3.79-22.18,14.83-46.26,33.12c-24.08,18.31-51.23,40.19-81.47,65.65 c-30.24,25.47-51.53,43.87-63.86,55.21c-12.34,11.34-19.99,19.7-22.98,25.07c-2.98,5.37-4.48,10.25-4.48,14.62 c0,9.15,5.27,16.31,15.82,21.49c10.54,5.17,27.16,8.36,49.84,9.55c22.68,1.19,54.11,1.79,94.3,1.79 c79.17,0,125.64-2.29,139.36-6.86c13.73-4.58,24.17-16.52,31.33-35.81c7.16-19.3,13.33-51.82,18.5-97.58l13.13,1.19 c0.39,32.23,1.19,55.31,2.39,69.23c1.19,13.93,3.58,24.08,7.16,30.44c3.58,6.37,9.94,13.33,19.1,20.89 c4.37,3.58,6.57,6.66,6.57,9.25c0,2.58-3.49,8.75-10.44,18.5c-6.97,9.75-16.82,17.8-29.54,24.17 c-12.74,6.36-28.55,10.44-47.45,12.24c-18.9,1.79-51.53,2.69-97.88,2.69c-46.36,0-89.43-0.6-129.22-1.79 c-39.79-1.19-66.45-3.09-79.98-5.67c-13.53-2.59-25.37-7.07-35.51-13.43c-10.15-6.37-17.81-13.73-22.98-22.08 c-5.18-8.36-7.76-16.62-7.76-24.77c0-8.16,1.19-15.61,3.58-22.38c2.39-6.76,5.76-13.22,10.15-19.4 c4.37-6.16,14.72-16.91,31.04-32.23c16.31-15.31,39.99-36.01,71.03-62.07c31.04-26.06,65.45-54.01,103.25-83.86H121.33 c-8.36,0-15.13,1-20.29,2.98L89.7,252.37c7.16,1.59,15.12,2.39,23.87,2.39H342.76z" />
                                        <path d="M752.79,158.07h158.76c-3.19-43.36-5.37-87.53-6.56-132.5c15.52,2.39,30.93,5.47,46.26,9.25 c15.31,3.79,24.67,6.56,28.05,8.36c3.38,1.79,5.07,3.68,5.07,5.67c0,3.98-7.16,9.16-21.49,15.52c0.79,42.97,1.79,74.21,2.98,93.7 h110.42l20.29-31.63c4.37-7.16,8.15-10.74,11.34-10.74c3.18,0,14.32,8.06,33.42,24.17c19.1,16.11,28.65,26.17,28.65,30.14 c0,3.98-5.37,5.97-16.11,5.97H967.06c5.57,82.77,16.91,148.22,34.02,196.36c23.07-40.98,42.57-94.3,58.49-159.95 c43.36,16.71,65.06,27.85,65.06,33.42c0,2.79-3.68,5.18-11.04,7.16c-7.37,2-14.03,10.95-19.99,26.86 c-23.08,62.47-46.36,110.03-69.83,142.65c14.72,24.68,31.13,42.48,49.24,53.42c18.1,10.94,30.14,16.41,36.11,16.41 c2.39,0,4.27-1.1,5.67-3.28c1.39-2.19,4.97-10.74,10.74-25.66c5.76-14.92,13.82-38.89,24.17-71.92l11.34,1.79 c-5.97,37.81-8.95,64.26-8.95,79.38c0,15.12,1.29,27.75,3.88,37.9c2.58,10.15,6.66,20.19,12.23,30.14 c5.57,9.94,8.36,17.31,8.36,22.08c0,7.55-3.88,11.34-11.64,11.34c-7.76,0-22.29-3.49-43.57-10.44 c-21.29-6.97-43.37-18.71-66.25-35.21c-22.88-16.52-44.27-38.5-64.16-65.95c-38.6,40.18-103.85,76.4-195.76,108.62l-7.76-7.16 c80.77-43.78,140.65-90.72,179.65-140.86c-26.66-51.72-44.57-134.08-53.72-247.09H752.19c-0.8,40.99-1.59,72.81-2.39,95.49h72.22 l14.92-23.87c2.78-4.37,5.76-6.57,8.95-6.57c3.18,0,11.24,3.09,24.17,9.25c12.93,6.17,21.09,10.55,24.47,13.13 c3.38,2.59,5.07,5.47,5.07,8.66c0,6.37-6.37,13.73-19.1,22.08c-0.4,28.26-1.89,59.19-4.48,92.81c-2.59,33.63-5.37,54.82-8.36,63.56 c-2.98,8.76-7.76,16.71-14.33,23.87c-6.56,7.16-17.11,14.42-31.63,21.78c-14.53,7.36-23.38,11.04-26.56,11.04 c-3.19,0-5.97-3.58-8.36-10.74c-3.58-10.74-7.76-18.59-12.53-23.57c-4.77-4.97-14.72-10.04-29.84-15.22l0.6-11.34 c16.31,1.99,30.04,2.98,41.18,2.98c11.14,0,19.4-1.69,24.77-5.07c5.37-3.38,8.85-8.95,10.44-16.71c1.59-7.76,3.08-25.16,4.48-52.22 c1.39-27.05,2.48-55.51,3.28-85.35h-79.98l-3.58,73.41c-1.6,30.24-5.67,56.91-12.24,79.98c-6.57,23.08-17.41,44.76-32.53,65.06 c-15.13,20.29-37.6,42.77-67.44,67.44l-9.55-6.57c34.62-36.61,55.7-75.5,63.27-116.68c7.55-41.18,11.34-114.09,11.34-218.74 c0-24.27-0.4-58.29-1.19-102.06C717.97,138.18,736.47,146.93,752.79,158.07z M989.14,54.22c23.07,4.77,41.08,9.65,54.01,14.62 c12.93,4.98,21.98,10.44,27.16,16.41c5.17,5.97,7.76,13.73,7.76,23.28c0,9.55-3.68,19.1-11.04,28.65 c-7.37,9.55-13.83,14.32-19.4,14.32c-2.39,0-5.37-4.57-8.95-13.73c-6.77-18.7-14.43-33.22-22.98-43.57 c-8.56-10.34-19.01-20.29-31.33-29.84L989.14,54.22z" />
                                    </g>
                                </svg>
                            </motion.div>

                            <motion.p
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.15 } } }}
                                className="text-[#103065] mb-10"
                                style={{ fontFamily: "'Source Sans Pro', sans-serif", fontSize: '19px', fontWeight: 400, lineHeight: '1.47em' }}
                            >
                                Based on the Mandarin <i><b>"yi cheng"</b></i> and Hokkien <i><b>"geseng"</b></i>, which means <i><b>"perfection for art"</b></i>
                            </motion.p>

                            <motion.h4
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.25 } } }}
                                className="text-[#BC9C33] text-[1.65rem] md:text-[1.85rem] mb-10"
                                style={{ fontFamily: "Georgia, serif", fontWeight: 600, lineHeight: '36px' }}
                            >
                                Gesit is a name chosen to represent our vision for strategic resourcefulness and passionate energy in our business endeavors.
                            </motion.h4>

                            <motion.div
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.35 } } }}
                                className="space-y-5 text-[#103065]"
                                style={{ fontFamily: "'Source Sans Pro', sans-serif", fontSize: '19px', fontWeight: 400, lineHeight: '1.47em' }}
                            >
                                <p>Over the years, the Gesit Companies continue to capture opportunities to grow its business portfolio amidst changes in economy and increased competition – part of this by being resourceful, agile and competitive.</p>
                                <p>Our businesses are managed and operated by a team of professionals, headquartered in Jakarta.</p>
                                <p>As the Gesit Companies continue to grow, we also believe in investing in our human capital and other areas to build competitive advantages. Likewise, we believe in creating positive contributions towards the environment and communities in which we operate in and will continue to invest in these areas.</p>
                                <p>We are committed to Indonesia.</p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right: Image */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        className="w-full lg:w-1/2 min-h-[400px] lg:min-h-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/about/hero_image_natural_1-2 (1).png')" }}
                    />
                </div>
            </section>

            {/* White spacer */}
            <div className="w-full h-16 bg-white"></div>

            {/* 4. Vision & Mission - video left, text right */}
            <section className="overflow-hidden bg-white">
                <div className="flex flex-col lg:flex-row w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 min-h-[300px] lg:min-h-[500px] overflow-hidden"
                        style={{ borderRadius: '6px' }}
                    >
                        <video autoPlay muted loop playsInline className="w-full h-full object-cover" style={{ borderRadius: '6px' }}>
                            <source src="/video/about-us-video.mp4" type="video/mp4" />
                        </video>
                    </motion.div>
                    <div className="w-full lg:w-1/2 flex items-center py-16 md:py-24 px-8 md:px-16 lg:px-20">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="w-full"
                        >
                            <h6 className="text-[#BC9C33] font-bold text-lg md:text-xl mb-4" style={{ fontFamily: "Georgia, serif" }}>Our Vision</h6>
                            <p className="text-[#333] text-xl md:text-2xl leading-snug mb-10" style={{ fontFamily: "'Source Sans Pro', sans-serif", fontWeight: 400 }}>
                                To be a Group of Companies that are Recognized by Stakeholders as Strategic First Choice Business Partner
                            </p>

                            <div className="w-full h-px bg-[#ddd] my-8"></div>

                            <h6 className="text-[#BC9C33] font-bold text-lg md:text-xl mb-4" style={{ fontFamily: "Georgia, serif" }}>Our Mission</h6>
                            <p className="text-[#333] text-xl md:text-2xl leading-snug" style={{ fontFamily: "'Source Sans Pro', sans-serif", fontWeight: 400 }}>
                                To Establish Resourceful Business Entities that Deliver Sustainable Value to Stakeholders
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* White spacer */}
            <div className="w-full h-16 bg-white"></div>

            {/* 5. Core Values - same style as home BusinessSection */}
            <section style={{ backgroundColor: '#E3EAF4', padding: '120px 0' }}>
                <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '0 24px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: '56px', textAlign: 'center' }}
                    >
                        <h3 style={{ color: '#103065', fontSize: '2.2rem', fontFamily: 'Georgia, serif', fontWeight: 700 }}>Our Core Values</h3>
                    </motion.div>

                    <motion.div
                        className="core-values-grid"
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}
                    >
                        {coreValues.map((value) => (
                            <motion.div
                                key={value.title}
                                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                                whileHover="hover"
                                transition={{ duration: 0.3 }}
                                style={{ display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer' }}
                            >
                                {/* Image with slower zoom effect like CSR */}
                                <div
                                    className="relative w-full aspect-[4/3] overflow-hidden shadow-xl"
                                    style={{ borderRadius: '6px' }}
                                >
                                    <motion.img
                                        variants={{
                                            hover: { scale: 1.1 }
                                        }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        src={value.image}
                                        alt={value.title}
                                        style={{ borderRadius: '6px' }}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-black/5"></div>
                                </div>

                                {/* Connecting Line Section - CSR Animated Style (Centered) */}
                                <div className="relative h-10 w-full flex justify-center z-40">
                                    {/* Base subtle line */}
                                    <div className="absolute top-[-24px] bottom-[-12px] w-[2.5px] bg-white/40 z-20 pointer-events-none"></div>

                                    {/* Animated active line on hover */}
                                    <motion.div
                                        variants={{
                                            hover: { scaleY: 1, opacity: 1 }
                                        }}
                                        initial={{ scaleY: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="absolute top-[-24px] bottom-[-12px] w-[3px] bg-white z-30 pointer-events-none origin-top"
                                    />
                                </div>

                                {/* Gold Card */}
                                <div style={{
                                    backgroundColor: '#BC9C33',
                                    padding: '50px 32px 40px',
                                    flex: '1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    position: 'relative',
                                    borderRadius: '6px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    zIndex: 10
                                }}>

                                    <h3 style={{
                                        color: 'white',
                                        fontSize: '32px',
                                        fontWeight: '400',
                                        marginBottom: '18px',
                                        fontFamily: 'Georgia, serif',
                                    }}>
                                        {value.title}
                                    </h3>

                                    <p style={{
                                        color: 'rgba(255,255,255,0.95)',
                                        fontSize: '17px',
                                        lineHeight: '1.6',
                                        fontFamily: "'Source Sans Pro', sans-serif",
                                        fontWeight: '400',
                                    }}>
                                        {value.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Mobile responsive */}
                <style>{`
                    @media (max-width: 1024px) {
                        .core-values-grid {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                    }
                    @media (max-width: 640px) {
                        .core-values-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>
            </section>
        </div>
    );
};

export default AboutPage;
