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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {businesses.map((biz, index) => (
                        <Link to={biz.href} key={biz.title} className="block h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="group flex flex-col items-center h-full"
                            >
                                {/* Top Image Section */}
                                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl mb-4 shrink-0">
                                    <img
                                        src={biz.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                        alt={biz.title}
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
                                <div className="w-full bg-[#BA9B32] p-8 text-center shadow-lg relative z-10 group-hover:-translate-y-2 transition-transform duration-500 flex-1 flex flex-col justify-center">
                                    <h3 className="text-white text-3xl font-display leading-tight mb-4">{biz.title}</h3>
                                    <div className="w-10 h-[1px] bg-white/30 mx-auto mb-6 shrink-0"></div>
                                    <p className="text-white/90 text-[15px] font-normal leading-relaxed px-2">
                                        {biz.description}
                                    </p>

                                    <div className="mt-8 flex items-center justify-center gap-2 text-white font-bold text-[10px] uppercase tracking-[0.3em] group-hover:gap-4 transition-all duration-300">
                                        <span>Explore</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BusinessSection;
