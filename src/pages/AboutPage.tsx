import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * AboutPage - Ultra-Premium Editorial Design
 * This version pushes beyond corporate standards into a magazine-style artistic layout.
 */
const AboutPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const philosophyRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: philosophyRef,
        offset: ["start end", "end start"]
    });

    const bgTextY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    const bgTextOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.2, 0.2, 0]);

    // New Sliding Content Transforms
    const contentX = useTransform(scrollYProgress, [0, 1], ["0px", "-50px"]);
    const imageMainY = useTransform(scrollYProgress, [0, 1], ["0px", "-80px"]);
    const imageSubX = useTransform(scrollYProgress, [0, 1], ["0px", "50px"]);
    const imageSubY = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);


    const fadeIn = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1, ease: "easeOut" as any }
    };

    const coreValues = [
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

    return (
        <div ref={containerRef} className="bg-white font-body selection:bg-[#BA9B32] selection:text-white">
            {/* 1. Immersive Video Hero (Editorial Typography) */}
            <section className="relative h-screen flex items-end justify-start overflow-hidden bg-navy-deep">
                <div className="absolute inset-0 z-0">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                        <source src="/video/about-us-video.mp4" type="video/mp4" />
                        <img src="/hero/hero (1).png" className="w-full h-full object-cover" alt="Fallback" />
                    </video>
                    {/* Darker Overlays for "Shadow Hitam" Feel */}
                    <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
                    {/* Bottom Dark shadow fade instead of white */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 pb-24 md:pb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-6xl"
                    >
                        <h1 className="text-white text-[10vw] md:text-8xl font-display leading-[1] mb-0 uppercase tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                            About <span className="text-[#BA9B32]">Us</span>
                        </h1>
                    </motion.div>
                </div>

                {/* Vertical Branding - Institutional Feel */}
                <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-16">
                    <div className="w-[1px] h-40 bg-white/10"></div>
                    <span className="text-white/40 uppercase tracking-[.8em] text-[10px] [writing-mode:vertical-lr] font-bold">
                        THE GESIT COMPANIES
                    </span>
                    <div className="w-[1px] h-40 bg-white/10"></div>
                </div>
            </section>

            {/* 2. Introduction Narrative (Editorial Spacing) */}
            <section className="py-24 md:py-40 bg-navy-deep overflow-hidden relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeIn} className="relative">
                            <span className="absolute -top-12 -left-20 text-[20rem] font-display text-white/5 leading-none -z-10 select-none">01</span>
                            <div className="space-y-12">
                                <h2 className="text-white text-4xl md:text-7xl font-display leading-[1.1]">
                                    Strategic partners in <br />
                                    <span className="text-[#BA9B32]">Indonesia's growth</span> since <br />
                                    the 1950s.
                                </h2>
                                <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                                    Founded in the 1950s as a small private trading company, Gesit has grown to become a business leader in the fields of Property, Trading & Service, Manufacturing, and Natural Resources.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. The "Yi Cheng" Philosophy (Asymmetrical Masonry) */}
            <section ref={philosophyRef} className="pb-24 md:pb-40 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-start">
                        {/* Parallax Background Text Overlay */}
                        <motion.div
                            style={{ y: bgTextY, opacity: bgTextOpacity }}
                            className="absolute top-0 right-0 text-[35vw] font-display text-slate-200 pointer-events-none -z-10 select-none leading-none translate-x-[10%]"
                        >
                            艺成
                        </motion.div>

                        <motion.div
                            style={{ x: contentX }}
                            className="lg:col-span-6 pt-10 md:pt-20"
                        >
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.2
                                        }
                                    }
                                }}
                            >
                                {/* Large Chinese Characters - Premium Gradient Reveal */}
                                <motion.h3
                                    variants={{
                                        hidden: { opacity: 0, x: -30, filter: "blur(10px)" },
                                        visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
                                    }}
                                    className="bg-gradient-to-br from-[#BA9B32] via-[#e2c15a] to-[#8a6d3b] bg-clip-text text-transparent text-8xl md:text-9xl font-display mb-10 leading-none py-2"
                                >
                                    艺成
                                </motion.h3>

                                <motion.p
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                    }}
                                    className="text-navy-deep text-xl font-medium mb-12 leading-relaxed"
                                >
                                    Based on the Mandarin <span className="italic font-bold">"yi cheng"</span> and Hokkien <span className="italic font-bold">"geseng"</span>, which means <span className="text-[#BA9B32] font-bold">"perfection for art."</span>
                                </motion.p>

                                <motion.h4
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                    }}
                                    className="text-navy-deep text-2xl md:text-3xl font-display font-light mb-14 leading-[1.4] max-w-xl border-l-2 border-[#BA9B32]/30 pl-8"
                                >
                                    Gesit is a name chosen to represent our vision for <span className="font-bold">strategic resourcefulness</span> and <span className="font-bold">passionate energy</span> in our business endeavors.
                                </motion.h4>

                                <div className="space-y-8 text-slate-600 font-light text-base md:text-lg leading-relaxed max-w-lg">
                                    {[
                                        "Over the years, the Gesit Companies continue to capture opportunities to grow its business portfolio amidst changes in economy and increased competition – part of this by being resourceful, agile and competitive.",
                                        "Our businesses are managed and operated by a team of professionals, headquartered in Jakarta.",
                                        "As the Gesit Companies continue to grow, we also believe in investing in our human capital and other areas to build competitive advantages. Likewise, we believe in creating positive contributions towards the environment and communities in which we operate in and will continue to invest in these areas."
                                    ].map((paragraph, i) => (
                                        <motion.p
                                            key={i}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                            }}
                                        >
                                            {paragraph}
                                        </motion.p>
                                    ))}
                                    <motion.p
                                        variants={{
                                            hidden: { opacity: 0, scale: 0.95 },
                                            visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
                                        }}
                                        className="font-bold text-navy-deep text-xl mt-12 pt-8 border-t border-slate-100 flex items-center gap-4"
                                    >
                                        <span className="w-12 h-[1px] bg-[#BA9B32]"></span>
                                        We are committed to Indonesia.
                                    </motion.p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right: Narrative Images (Overlapping Masonry) */}
                        <div className="lg:col-span-6 relative pt-20 md:pt-32">
                            <div className="relative">
                                {/* Main Image */}
                                <motion.div
                                    style={{ y: imageMainY }}
                                    initial={{ opacity: 0, scale: 1.1, y: 50 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                    viewport={{ once: true }}
                                    className="aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative z-10"
                                >
                                    <img src="/about/property.jpeg" className="w-full h-full object-cover" alt="History" />
                                    <div className="absolute inset-0 bg-navy-deep/20"></div>
                                </motion.div>

                                {/* Secondary Overlapping Image */}
                                <motion.div
                                    style={{ x: imageSubX, y: imageSubY }}
                                    initial={{ opacity: 0, x: 50, rotate: 5 }}
                                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                                    transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    viewport={{ once: true }}
                                    className="absolute -bottom-12 md:-bottom-20 -left-8 md:-left-20 w-3/4 aspect-square rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] md:border-[12px] border-white z-20 hidden md:block"
                                >
                                    <img src="/about/resources.jpeg" className="w-full h-full object-cover" alt="Context" />
                                    <div className="absolute inset-0 bg-[#BA9B32]/10"></div>
                                </motion.div>

                                {/* Accent Decorative Element */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="absolute -top-10 -right-10 w-32 h-32 border-t border-r border-[#BA9B32]/40 z-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Vision & Mission (Refined Corporate Editorial) */}
            <section className="py-24 md:py-40 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">

                        {/* Video Background Replacement */}
                        <motion.div {...fadeIn} className="relative group/vision">
                            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-[#BA9B32]/20 z-0"></div>

                            <div className="relative aspect-video rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden bg-navy-deep">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                                >
                                    <source src="/video/about-us-video.mp4" type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent"></div>
                            </div>
                        </motion.div>

                        {/* Vision & Mission Text */}
                        <div className="space-y-20">

                            {/* Vision */}
                            <motion.div {...fadeIn}>
                                <span className="text-[#BA9B32] font-bold uppercase tracking-[.6em] text-[10px] mb-6 block">
                                    Our Vision
                                </span>
                                <h3 className="text-navy-deep text-2xl md:text-4xl font-display leading-relaxed">
                                    To be a <span className="font-bold">Group of Companies</span> that are recognized by
                                    <span className="text-[#BA9B32] font-bold"> Stakeholders</span> as{' '}
                                    <span className="underline decoration-[#BA9B32] decoration-[2px] underline-offset-6 font-bold">
                                        Strategic First Choice Business Partner
                                    </span>.
                                </h3>
                            </motion.div>

                            {/* Mission */}
                            <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
                                <span className="text-[#BA9B32] font-bold uppercase tracking-[.6em] text-[10px] mb-6 block">
                                    Our Mission
                                </span>
                                <h3 className="text-navy-deep text-2xl md:text-4xl font-display leading-relaxed">
                                    To establish <span className="font-bold">resourceful business entities</span> that deliver
                                    <span className="text-[#BA9B32] font-bold"> sustainable value</span> to stakeholders.
                                </h3>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </section>


            {/* 5. Core Values (Premium Split-Axis Design) */}
            <section className="py-24 md:py-40 bg-white">
                <div className="container mx-auto px-6 mb-20 md:mb-32 flex flex-col md:flex-row justify-between items-end gap-10">
                    <motion.div {...fadeIn}>
                        <h2 className="text-navy-deep text-5xl md:text-7xl font-display">Our Core Values.</h2>
                    </motion.div>
                    <p className="text-slate-400 max-w-sm italic font-light hidden md:block">
                        The four pillars that define our culture and drive our collective ambition for Indonesian excellence.
                    </p>
                </div>

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-6">
                        {coreValues.map((value, idx) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" as any }}
                                className="group flex flex-col items-center h-full"
                            >
                                {/* Top Image Section */}
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl mb-4 shrink-0">
                                    <img
                                        src={value.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                        alt={value.title}
                                    />
                                    <div className="absolute inset-0 bg-navy-deep/10"></div>
                                </div>

                                {/* Connecting Line */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: 40 }}
                                    transition={{ duration: 0.8, delay: 0.5 + (idx * 0.1) }}
                                    className="w-[1.5px] bg-slate-200 shrink-0"
                                ></motion.div>

                                {/* Bottom Info Box */}
                                <div className="w-full bg-[#BA9B32] p-8 md:p-10 text-center shadow-lg relative z-10 group-hover:-translate-y-2 transition-transform duration-500 flex-1 flex flex-col justify-center">
                                    <h4 className="text-white text-3xl font-display mb-6 tracking-wide">{value.title}</h4>
                                    <div className="w-10 h-[1px] bg-white/40 mx-auto mb-6 shrink-0"></div>
                                    <p className="text-white/90 text-[13px] font-medium leading-relaxed tracking-wide uppercase px-2">
                                        {value.desc}
                                    </p>

                                    {/* Abstract background element */}
                                    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                                        <span className="absolute -bottom-4 -right-4 text-7xl font-display text-white select-none">{value.id}</span>
                                    </div>
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
