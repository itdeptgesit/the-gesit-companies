import { useNews } from "../context/NewsContext";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const CSRSection = () => {
    const { newsItems } = useNews();
    const latestCSR = newsItems.find(item => item.type === "csr");
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1.0 }
        }
    };

    return (
        <section ref={sectionRef} className="bg-white py-24 md:py-32">
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 24px' }}>
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start justify-center">
                    {/* Left side: Video / Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-[1.3] w-full"
                    >
                        <div className="relative aspect-video bg-slate-100 overflow-hidden shadow-sm" style={{ borderRadius: '6px' }}>
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                style={{ borderRadius: '6px' }}
                                autoPlay={isVisible}
                                muted
                                loop
                                playsInline
                                controls
                                poster={latestCSR?.image || "/about/resources.jpeg"}
                                key={isVisible ? "playing" : "loading"}
                            >
                                <source src="https://dev.gesit.co.id/wp-content/uploads/2021/08/csr-video.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </motion.div>

                    {/* Right side: Text content */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.35 } }
                        }}
                        className="flex-1"
                    >
                        <motion.h2
                            variants={fadeUp}
                            style={{
                                fontSize: '30px',
                                fontFamily: 'Georgia, serif',
                                color: '#1a1a1a',
                                fontWeight: '400',
                                lineHeight: '1.2',
                                marginBottom: '16px',
                                marginTop: '-8px'
                            }}
                        >
                            {latestCSR
                                ? latestCSR.title
                                : <>We want to create a positive effect on lives and communities in Indonesia</>
                            }
                        </motion.h2>

                        <motion.p
                            variants={fadeUp}
                            style={{
                                color: '#666',
                                fontSize: '16px',
                                lineHeight: '1.6',
                                marginBottom: '20px',
                                fontFamily: 'Source Sans Pro, sans-serif',
                                maxWidth: '480px'
                            }}
                        >
                            {latestCSR
                                ? latestCSR.excerpt
                                : <>Our social investment programs focus on three areas where we believe Gesit will add the most value and make a significant and lasting impact:<br /><strong>Healthcare, Environment & Cultural Outreach, and Education.</strong></>
                            }
                        </motion.p>

                        <motion.div variants={fadeUp} className="mb-10">
                            <Link
                                to={latestCSR ? `/news/${latestCSR.id}` : "/csr"}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: '#BC9C33',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    fontFamily: 'Georgia, serif',
                                }}
                            >
                                Read More
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    backgroundColor: '#BC9C33',
                                }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        </motion.div>

                        {/* Featured news item with gold accent line */}
                        <motion.div
                            variants={fadeUp}
                            style={{
                                borderLeft: '2px solid #BC9C33',
                                paddingLeft: '20px',
                                marginLeft: '2px',
                            }}
                        >
                            <p style={{
                                color: '#103065',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                fontFamily: 'Georgia, serif',
                                marginBottom: '6px',
                            }}>
                                {latestCSR ? latestCSR.category : "Gesit Foundation COVID-19 Vaccination Program"}
                            </p>
                            <p style={{
                                color: '#777',
                                fontSize: '15px',
                                fontFamily: 'Source Sans Pro, sans-serif',
                            }}>
                                {latestCSR
                                    ? `Publication date: ${latestCSR.date}`
                                    : "Participating in COVID control and distributing vaccines."
                                }
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CSRSection;
