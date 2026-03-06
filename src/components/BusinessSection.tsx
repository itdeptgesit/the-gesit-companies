import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

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
                setBusinesses(data.map((b: any) => ({
                    title: b.title,
                    description: b.description,
                    image: b.image_url,
                    href: b.href
                })));
            }
        };
        fetchBusinesses();
    }, []);

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section style={{ backgroundColor: '#e3eaf4', padding: '120px 0' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 24px' }}>
                <motion.div
                    className="business-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}
                >
                    {businesses.map((biz) => (
                        <motion.div
                            key={biz.title}
                            variants={itemVariants}
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
                                    src={biz.image}
                                    alt={biz.title}
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
                                padding: '40px 32px 30px',
                                flex: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                textAlign: 'left',
                                position: 'relative',
                                borderRadius: '6px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                zIndex: 10
                            }}>
                                <h3 style={{
                                    color: 'white',
                                    fontSize: '24px',
                                    fontWeight: '400',
                                    marginBottom: '16px',
                                    fontFamily: 'Georgia, serif',
                                }}>
                                    {biz.title}
                                </h3>

                                <p style={{
                                    color: 'rgba(255,255,255,0.95)',
                                    fontSize: '15px',
                                    lineHeight: '1.6',
                                    marginBottom: '26px',
                                    fontFamily: "'Source Sans Pro', sans-serif",
                                    flex: '1',
                                    fontWeight: '400',
                                }}>
                                    {biz.description}
                                </p>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ marginTop: 'auto' }}
                                >
                                    <Link
                                        to={biz.href}
                                        className="learn-more-link"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            textDecoration: 'none',
                                            fontFamily: 'Georgia, serif',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        Learn More
                                        <span className="learn-more-arrow" style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: 'white',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#BC9C33" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Mobile responsive + Learn More hover animation */}
            <style>{`
                .learn-more-link:hover {
                    text-decoration: underline;
                    text-underline-offset: 4px;
                }
                .learn-more-link:hover .learn-more-arrow {
                    transform: translateX(5px);
                    box-shadow: 0 0 12px rgba(255,255,255,0.5);
                }
                @media (max-width: 1024px) {
                    .business-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 640px) {
                    .business-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default BusinessSection;
