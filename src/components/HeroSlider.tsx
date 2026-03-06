import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
// @ts-ignore
import { supabase, getOptimizedNewsImage } from '../lib/supabase';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [slides, setSlides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
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
            } else {
                setSlides([
                    { image: "/hero/property.png" },
                    { image: "/hero/trading.jpg" },
                    { image: "/hero/manufacturing.jpg" },
                    { image: "/hero/resources.jpeg" }
                ]);
            }
            setIsLoading(false);
        };
        fetchSlides();
    }, []);

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#103065]">
            <div className="w-10 h-10 border-4 border-[#BC9C33] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black">
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
                            />

                            {/* Very light top-down blue gradient matching the older website */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#103065]/70 via-[#103065]/30 to-transparent" />
                            {/* Even slighter overall darken just to maintain text contrast */}
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Center-placed text (Fixed/Persistent) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="max-w-4xl"
                >
                    <h1
                        className="text-white font-serif leading-tight drop-shadow-md mb-4"
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: 'clamp(42px, 6.5vw, 82px)',
                            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
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
        .animate-slow-zoom {
          animation: slowZoom 30s linear infinite alternate;
          will-change: transform;
        }
        @keyframes slowZoom {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.1); }
        }
        :root {
          --swiper-theme-color: #BC9C33;
        }
      `}</style>
        </section>
    );
};

export default HeroSlider;
