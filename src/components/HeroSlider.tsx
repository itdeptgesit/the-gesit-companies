import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
// @ts-ignore
import { supabase, getOptimizedNewsImage } from '../lib/supabase';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Fallback slides used while Supabase loads (and as default if no DB data)
const FALLBACK_SLIDES = [
    { image: "/hero/property.png" },
    { image: "/hero/trading.png" },
    { image: "/hero/manufacturing.jpg" },
    { image: "/hero/mining.jpg" }
];

const HeroSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [slides, setSlides] = useState<any[]>(FALLBACK_SLIDES);
    const firstImageLoaded = useRef(false);
    const [showContent, setShowContent] = useState(false);

    // Fetch slides from Supabase in background — render fallback immediately (no loading state)
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data } = await supabase
                    .from('hero_slides')
                    .select('*')
                    .order('order_index', { ascending: true });

                if (data && data.length > 0) {
                    setSlides(data.map((s: any) => ({
                        image: getOptimizedNewsImage(s.image_url, 1920, 85),
                        title: s.title,
                        subtitle: s.subtitle
                    })));
                }
            } catch {
                // Keep fallback slides on error
            }
        };
        fetchSlides();
    }, []);

    // Show content once first image is decoded
    const handleFirstImageLoad = () => {
        if (!firstImageLoaded.current) {
            firstImageLoaded.current = true;
            setShowContent(true);
        }
    };

    return (
        <section className="relative w-full h-screen overflow-hidden bg-[#103065]">
            {/* Top yellow progress bar (Timer moving) */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-black/20 z-40">
                <motion.div
                    key={activeIndex}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
                    style={{ originX: 0 }}
                    className="h-full bg-[#BC9C33]"
                />
            </div>

            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                speed={2000}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={true}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative h-full w-full">
                            <img
                                src={slide.image}
                                alt="Gesit Companies"
                                className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
                                style={{ transformOrigin: "center" }}
                                loading={index === 0 ? "eager" : "lazy"}
                                {...(index === 0 ? { fetchPriority: "high" as const } : {})}
                                decoding={index === 0 ? "sync" : "async"}
                                onLoad={index === 0 ? handleFirstImageLoad : undefined}
                                width={1920}
                                height={1080}
                            />

                            {/* Adjusted blue gradient for better visual balance */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#103065]/60 via-[#103065]/20 to-transparent" />
                            {/* Slight darken for text contrast */}
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Center-placed text (Fixed/Persistent) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-[800px]"
                >
                    <h1
                        className="text-white font-serif leading-tight drop-shadow-md mb-4"
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: 'clamp(42px, 6.5vw, 82px)',
                            textShadow: '0 4px 24px rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.4)',
                            whiteSpace: 'pre-line'
                        }}
                    >
                        {slides[0]?.title || "Your First Choice\nStrategic Partner"}
                    </h1>
                    {slides[0]?.subtitle && (
                        <p className="text-white/80 text-lg md:text-xl font-light tracking-widest uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            {slides[0].subtitle}
                        </p>
                    )}
                </motion.div>
            </div>

            <style>{`
        .swiper-slide .animate-slow-zoom {
          transform: scale(1);
          transition: transform 14s ease-in-out;
          will-change: transform;
        }
        .swiper-slide-active .animate-slow-zoom {
          transform: scale(1.12);
          transition: transform 20s linear;
        }
        :root {
          --swiper-theme-color: #BC9C33;
        }
      `}</style>
        </section>
    );
};

export default HeroSlider;
