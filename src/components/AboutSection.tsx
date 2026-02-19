import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

const AboutSection = () => {
    const [content, setContent] = useState<any>({});

    useEffect(() => {
        const fetchContent = async () => {
            const { data } = await supabase
                .from('page_content')
                .select('*')
                .eq('page', 'about');

            if (data) {
                const contentMap = data.reduce((acc: any, item: any) => {
                    acc[item.key] = item.value;
                    return acc;
                }, {});
                setContent(contentMap);
            }
        };
        fetchContent();
    }, []);

    return (
        <section className="bg-navy-deep py-32 text-white relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <div className="flex flex-col items-center text-center space-y-16">
                    {/* Centered Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] as any }}
                        className="max-w-4xl"
                    >
                        <h2 className="text-[#BC9C33] text-4xl md:text-[64px] font-display leading-[1.1] tracking-tight">
                            {content['intro_title'] || "Over 50 Years Of Investing In The Development Of Indonesia"}
                        </h2>
                    </motion.div>

                    {/* Centered Description with Left Border */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
                        className="flex gap-10 items-stretch max-w-4xl text-left"
                    >
                        <div className="w-[1px] bg-white/20 shrink-0" />
                        <p className="text-lg md:text-2xl leading-relaxed text-slate-200 font-light py-2 font-display">
                            {content['intro_description'] || "Founded in the 1950s as a small private trading company, Gesit has grown to become a business leader in the fields of Property, Trading & Service, Manufacturing, and Natural Resources."}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
