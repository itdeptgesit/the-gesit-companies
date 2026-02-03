import { motion } from "framer-motion";

const AboutSection = () => {
    return (
        <section className="bg-navy-deep py-32 text-white relative">
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <div className="flex flex-col items-center text-center space-y-16">
                    {/* Centered Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }}
                        className="max-w-4xl"
                    >
                        <h2 className="text-[#BC9C33] text-4xl md:text-[64px] font-display leading-[1.1] tracking-tight">
                            Over 50 Years Of Investing In <br className="hidden md:block" />
                            The Development Of Indonesia
                        </h2>
                    </motion.div>

                    {/* Centered Description with Left Border */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
                        className="flex gap-10 items-stretch max-w-4xl text-left"
                    >
                        <div className="w-[1px] bg-white/20 shrink-0" />
                        <p className="text-lg md:text-2xl leading-relaxed text-slate-200 font-light py-2">
                            Founded in the 1950s as a small private trading company, Gesit has grown to become a business leader in the fields of <span className="text-white font-medium">Property</span>, <span className="text-white font-medium">Trading & Service</span>, <span className="text-white font-medium">Manufacturing</span>, and <span className="text-white font-medium">Natural Resources</span>.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
