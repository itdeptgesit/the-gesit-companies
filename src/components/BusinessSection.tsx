import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const businesses = [
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
    return (
        <section className="bg-gray-50 py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-primary font-semibold tracking-widest uppercase text-sm block mb-4"
                    >
                        Our Sectors
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display text-navy-deep"
                    >
                        Diversified Excellence
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
                    {businesses.map((biz, index) => (
                        <div key={biz.title} className="w-full">
                            <Link to={biz.href} className="block h-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="group flex flex-col items-center h-full"
                                >
                                    {/* Top Image Section */}
                                    <div className="relative w-full aspect-[4/3] rounded-card-sm overflow-hidden shadow-xl mb-4 shrink-0">
                                        <img
                                            src={biz.image}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                            alt={biz.title}
                                            loading="lazy"
                                            decoding="async"
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
                                    <div className="w-full bg-[#BA9B32] p-8 text-center shadow-lg rounded-card relative z-10 group-hover:-translate-y-4 group-hover:shadow-2xl transition-all duration-700 ease-[0.22,1,0.36,1] flex-1 flex flex-col justify-center overflow-hidden">
                                        {/* Cinematic Background Glow */}
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                                        <h3 className="text-white text-2xl font-display mb-4 tracking-wide relative z-10">{biz.title}</h3>
                                        <div className="w-10 h-[1px] bg-white/40 mx-auto mb-6 shrink-0 relative z-10 group-hover:w-20 transition-all duration-700"></div>
                                        <p className="text-white/90 text-sm font-medium leading-relaxed tracking-wide px-2 relative z-10">
                                            {biz.description}
                                        </p>

                                        <div className="mt-8 flex items-center justify-center gap-2 text-white font-bold text-[10px] uppercase tracking-[0.3em] group-hover:gap-4 transition-all duration-500 relative z-10">
                                            <span className="relative">
                                                Explore
                                                <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/50 group-hover:w-full transition-all duration-500"></div>
                                            </span>
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
