import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const AboutSection = () => {
    const [content, setContent] = useState<any>({});

    useEffect(() => {
        const fetchContent = async () => {
            const { data } = await supabase
                .from('page_content')
                .select('*')
                .eq('page', 'about');

            if (data) {
                const contentMap = data.reduce((acc: any, item: any) => {
                    acc[item.key] = item.value;
                    return acc;
                }, {});
                setContent(contentMap);
            }
        };
        fetchContent();
    }, []);

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        // SECTION: padding atas-bawah 100px | backgroundColor: warna background
        <section style={{ backgroundColor: '#103065', padding: '100px 0' }}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }} // maxWidth: lebar konten | padding: kiri-kanan
            >
                {/* === TITLE: "Over 50 Years Of Investing In..." === */}
                <motion.h2
                    variants={fadeUp}
                    style={{
                        color: '#bc9c33',                          // Warna teks gold
                        fontSize: 'clamp(36px, 5vw, 54px)',       // Ukuran font (min, preferred, max)
                        fontFamily: 'Georgia, serif',              // Jenis font
                        fontWeight: '400',                         // Ketebalan font (400=normal, 700=bold)
                        lineHeight: '1.3',                         // Jarak antar baris
                        marginBottom: '28px',                      // Jarak bawah ke deskripsi
                        whiteSpace: 'pre-line',                    // Agar \n jadi new line
                    }}
                >
                    {content['intro_title'] || "Over 50 Years Of Investing In\nThe Development Of Indonesia"}
                </motion.h2>

                {/* === DESCRIPTION: "At Gesit, we put the stakeholders..." === */}
                <motion.p
                    variants={fadeUp}
                    transition={{ delay: 0.2 }}                    // Delay animasi (detik)
                    style={{
                        color: 'rgba(255, 255, 255, 1)',           // Warna teks putih 85% opacity
                        fontSize: '24px',                          // Ukuran font deskripsi
                        lineHeight: '1.3',                         // Jarak antar baris
                        fontFamily: 'Georgia, serif',              // Jenis font
                        borderLeft: '3px solid rgba(255, 255, 255, 1)', // Garis kiri (tebal | warna)
                        paddingLeft: '20px',                       // Jarak teks dari garis kiri
                    }}
                >
                    {content['intro_description'] || "At Gesit, we put the stakeholders first and we are committed to contribute and grow with Indonesia. We invest in our workforce, research, and innovation to create the best and most sustainable industry solutions, while remaining mindful of the environment and our impact."}
                </motion.p>
            </motion.div>
        </section>
    );
};

export default AboutSection;
