import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
// @ts-ignore
import { supabase } from "../lib/supabase";

// Static backup just in case
const defaultBusinesses = [
    {
        title: "Property",
        description: "Creating value-adding and sustainable assets to our communities and partnering with leading multinational corporations.",
        image: "/home/property.jpeg",
        href: "/property"
    },
    {
        title: "Trading & Services",
        description: "Leveraging local Indonesian expertise and broad international network to source and deliver high-quality products.",
        image: "/home/trading.jpg",
        href: "/trading-service"
    },
    {
        title: "Manufacturing",
        description: "Serving important industrial sectors, delivering high-quality products, and establishing strong long-term partnership.",
        image: "/home/manufacturing.jpg",
        href: "/manufacturing"
    },
    {
        title: "Natural Resources",
        description: "Developing Indonesia's vast natural resources and continually expanding to other types of minerals and resources.",
        image: "/home/resources.jpeg",
        href: "/natural-resources"
    },
];

const BusinessSection = () => {
    const [businesses, setBusinesses] = useState<any[]>(defaultBusinesses);

    useEffect(() => {
        const fetchBusinesses = async () => {
            const { data } = await supabase
                .from('business_segments')
                .select('*')
                .order('order_index', { ascending: true });

            if (data && data.length > 0) {
                setBusinesses(data.map(b => ({
                    title: b.title,
                    description: b.description,
                    image: b.image_url,
                    href: b.href
                })));
            }
        };
        fetchBusinesses();
    }, []);
    return (
        <section className="bg-white py-32 overflow-hidden relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] as any }}
                        className="text-primary font-semibold tracking-widest uppercase text-base block mb-4"
                    >
                        Our Business
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
                        className="text-5xl md:text-6xl font-display text-navy-deep"
                    >
                        Diversified Excellence
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
                    {businesses.map((biz, index) => (
                        <div key={biz.title} className="w-full">
                            <Link to={biz.href} className="block h-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 1.2, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] as any }}
                                    className="group flex flex-col items-center h-full"
                                >
                                    {/* Top Image Section - Aspect Video to match Core Values */}
                                    <div className="relative w-full aspect-video rounded-[1.5rem] overflow-hidden shadow-xl mb-4 shrink-0">
                                        <img
                                            src={biz.image}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                            alt={biz.title}
                                            width="400"
                                            height="300"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute inset-0 bg-navy-deep/10 group-hover:bg-transparent transition-colors duration-500"></div>
                                    </div>

                                    {/* Connecting Line - Match About Page Style */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: 32 }}
                                        transition={{ duration: 0.8, delay: 0.5 + (index * 0.1) }}
                                        className="w-[1.5px] bg-slate-200 shrink-0"
                                    ></motion.div>

                                    {/* Bottom Info Box - Match About Page P8 and rounded corners */}
                                    <div className="w-full bg-[#BC9C33] p-8 text-center shadow-lg rounded-[2.5rem] relative z-10 group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-500 flex-1 flex flex-col justify-center min-h-[220px]">
                                        {/* Cinematic Background Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]"></div>

                                        <h3 className="text-white text-2xl font-display mb-4 tracking-wide relative z-10">{biz.title}</h3>

                                        <div className="w-10 h-[1px] bg-white/40 mx-auto mb-6 shrink-0 relative z-10 group-hover:w-16 transition-all duration-500"></div>

                                        <p className="text-white/90 text-[13px] font-medium leading-relaxed tracking-wide px-2 mb-6 line-clamp-3 relative z-10">
                                            {biz.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-center gap-2 text-white font-bold text-[10px] uppercase tracking-[0.3em] group-hover:gap-4 transition-all duration-300 relative z-10 opacity-70 group-hover:opacity-100">
                                            <span>Explore</span>
                                            <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default BusinessSection;
