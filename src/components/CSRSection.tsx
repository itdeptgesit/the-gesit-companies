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
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] as any }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="aspect-video shadow-lg overflow-hidden rounded-[2rem] bg-slate-100 relative">
                            {latestCSR ? (
                                <img
                                    src={latestCSR.image}
                                    alt={latestCSR.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <video
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                >
                                    <source src="https://dev.gesit.co.id/wp-content/uploads/2021/08/csr-video.mp4" type="video/mp4" />
                                </video>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] as any }}
                        className="w-full lg:w-1/2 space-y-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-[1px] bg-[#BC9C33]"></span>
                                <span className="text-[12px] font-bold uppercase tracking-[.3em] text-[#BC9C33]">Social Responsibility</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-display leading-[1.15] text-navy-deep">
                                {latestCSR ? latestCSR.title : "We want to create a positive effect on lives and communities in Indonesia"}
                            </h2>
                        </div>

                        {latestCSR ? (
                            <p className="text-slate-600 text-base leading-relaxed font-body">
                                {latestCSR.excerpt}
                            </p>
                        ) : (
                            <p className="text-slate-600 text-base leading-relaxed font-body">
                                Our social investment programs focus on three areas where we believe Gesit will add
                                the most value and make a significant and lasting impact:
                                <span className="text-navy-deep font-bold"> Healthcare</span>,
                                <span className="text-navy-deep font-bold"> Environment & Cultural Outreach</span>, and
                                <span className="text-navy-deep font-bold"> Education</span>.
                            </p>
                        )}

                        <div className="bg-slate-50 p-8 border-l-4 border-[#BC9C33] rounded-r-xl">
                            <h3 className="text-lg font-display font-bold text-navy-deep uppercase tracking-wide mb-2">
                                {latestCSR ? latestCSR.category : "GESIT FOUNDATION COVID-19 VACCINATION PROGRAM"}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {latestCSR ? `Publication date: ${latestCSR.date}` : "Participating in COVID control and distributing vaccines."}
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link
                                to={latestCSR ? `/news/${latestCSR.id}` : "/csr"}
                                className="group inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.3em] text-[#BC9C33] hover:text-navy-deep transition-colors"
                            >
                                {latestCSR ? "Read Full Story" : "Read Our CSR Report"}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CSRSection;
