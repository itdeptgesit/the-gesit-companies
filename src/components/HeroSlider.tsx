import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
    {
        image: "/hero/property.png",
        title: "Your First Choice Strategic Partner",
        subtitle: "Over 50 Years Of Investing In The Development Of Indonesia"
    },
    {
        image: "/hero/manufacturing.jpg",
        title: "Industrial Manufacturing Excellence",
        subtitle: "Advanced production and engineering solutions for global standards."
    },
    {
        image: "/hero/trading.png",
        title: "Global Trading & Services",
        subtitle: "Connecting Indonesia with international markets through quality and trust."
    },
    {
        image: "/hero/mining.jpg",
        title: "Sustainable Natural Resources",
        subtitle: "Maximizing value from Indonesia's rich mineral assets responsibly."
    }
];

const HeroSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Top Progress Bar (Timer Moving) */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 z-30">
                <motion.div
                    key={activeIndex}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                    style={{ originX: 0 }}
                    className="h-full bg-[#BC9C33] shadow-[0_0_8px_rgba(188,156,51,0.6)]"
                />
            </div>

            <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                speed={1200}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                pagination={{
                    clickable: true,
                    renderBullet: (_index, className) => {
                        return `<span class="${className}"></span>`;
                    }
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative h-full w-full">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 h-full w-full object-cover scale-105 animate-slow-zoom"
                                fetchPriority={index === 0 ? "high" : "low"}
                                loading={index === 0 ? "eager" : "lazy"}
                                decoding="async"
                            />
                            {/* Rich Overlay System */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                                <div className="max-w-6xl">
                                    <div className="overflow-hidden py-4">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeIndex}
                                                initial={{ opacity: 0, y: 40, filter: "blur(15px)" }}
                                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                                transition={{
                                                    duration: 1.2,
                                                    ease: [0.22, 1, 0.36, 1],
                                                    opacity: { duration: 0.8 },
                                                    filter: { duration: 1 }
                                                }}
                                            >
                                                <h1 className="text-white text-5xl md:text-8xl font-display leading-[1.1] mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] tracking-tight">
                                                    {slides[activeIndex].title}
                                                </h1>

                                                <motion.p
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                                    className="text-white/70 text-base md:text-xl font-light tracking-[0.1em] max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
                                                >
                                                    {slides[activeIndex].subtitle}
                                                </motion.p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style>{`
        .animate-slow-zoom {
          animation: slowZoom 25s infinite alternate ease-in-out;
        }
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.18); }
        }
        :root {
          --swiper-theme-color: #BC9C33;
        }
        .swiper-pagination {
            bottom: 40px !important;
        }
        .swiper-pagination-bullet {
            background: rgba(255,255,255,0.3) !important;
            opacity: 1 !important;
            width: 10px !important;
            height: 10px !important;
            margin: 0 8px !important;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .swiper-pagination-bullet-active {
            background: #BC9C33 !important;
            width: 40px !important;
            height: 10px !important;
            border-radius: 20px !important;
            border-color: #BC9C33;
        }
      `}</style>
        </section>
    );
};

export default HeroSlider;
