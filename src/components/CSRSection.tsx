import { motion } from "framer-motion";
import { useNews } from "../context/NewsContext";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CSRSection = () => {
    const { newsItems } = useNews();
    const latestCSR = newsItems.find(item => item.type === "csr");

    return (
        <section className="bg-white py-24 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative group"
                    >
                        <div className="aspect-video shadow-2xl overflow-hidden rounded-card-sm bg-black relative">
                            {latestCSR ? (
                                <img
                                    src={latestCSR.image}
                                    alt={latestCSR.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                            ) : (
                                <video
                                    className="w-full h-full object-cover opacity-80"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                >
                                    <source src="https://dev.gesit.co.id/wp-content/uploads/2021/08/csr-video.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            <div className="absolute inset-0 bg-navy-deep/20 transition-opacity duration-700 group-hover:opacity-0"></div>
                        </div>
                    </motion.div>

                    <div className="w-full lg:w-1/2 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-[#BA9B32]">
                                <div className="w-10 h-[1px] bg-[#BA9B32]" />
                                <span className="font-bold uppercase tracking-[.4em] text-[10px]">
                                    Social Responsibility
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-[42px] font-display leading-[1.2] text-navy-deep">
                                {latestCSR ? latestCSR.title : "We want to create a positive effect on lives and communities in Indonesia"}
                            </h2>
                        </div>

                        {latestCSR ? (
                            <p className="text-slate-600 text-lg leading-relaxed font-light line-clamp-4">
                                {latestCSR.excerpt}
                            </p>
                        ) : (
                            <p className="text-slate-600 text-lg leading-relaxed font-light">
                                Our social investment programs focus on three areas where we believe Gesit will add the most value and make a significant and lasting impact:
                                <span className="text-navy-deep font-semibold"> Healthcare</span>,
                                <span className="text-navy-deep font-semibold"> Environment & Cultural Outreach</span>, and
                                <span className="text-navy-deep font-semibold"> Education</span>.
                            </p>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gray-50 p-8 border-l-[4px] border-[#BA9B32] shadow-sm"
                        >
                            <h4 className="text-lg font-display font-bold mb-2 text-navy-deep tracking-wide uppercase">
                                {latestCSR ? latestCSR.category : "Gesit Foundation COVID-19 Vaccination Program"}
                            </h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-light">
                                {latestCSR ? `Update published on ${latestCSR.date}` : "Participating in COVID control and distributing vaccines."}
                            </p>
                        </motion.div>

                        <Link
                            to={latestCSR ? `/news/${latestCSR.id}` : "/csr"}
                            className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-[#BA9B32] hover:gap-6 transition-all"
                        >
                            {latestCSR ? "Read Full Story" : "Read Our CSR Report"}
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CSRSection;
