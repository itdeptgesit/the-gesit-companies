import { useNews } from "../context/NewsContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// @ts-ignore
import { getOptimizedNewsImage } from "../lib/supabase";

const LatestNewsSection = () => {
    const { newsItems, loading } = useNews();
    const latestNews = newsItems.filter(item => item.type === "news").slice(0, 3);

    if (loading || latestNews.length === 0) return null;

    return (
        <section style={{ backgroundColor: '#ffffff', padding: '50px 0' }}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <p style={{
                            color: '#BC9C33',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.25em',
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body), sans-serif',
                        }}>
                            Our Perspective
                        </p>
                        <h2 style={{
                            color: '#103065',
                            fontSize: 'clamp(24px, 3vw, 36px)',
                            fontFamily: 'Georgia, serif',
                            fontWeight: '400',
                            lineHeight: '1.3',
                        }}>
                            Latest News &amp; Insights
                        </h2>
                    </div>
                    <Link
                        to="/news"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#103065',
                            color: 'white',
                            padding: '10px 24px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            fontFamily: 'var(--font-body), sans-serif',
                        }}
                    >
                        View All Stories
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* News Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {latestNews.map((item) => (
                        <Link key={item.id} to={`/news/${item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                            <div style={{ overflow: 'hidden', aspectRatio: '16/9', marginBottom: '12px', backgroundColor: '#f0f0f0' }}>
                                <img
                                    src={getOptimizedNewsImage(item.image, 800, 75)}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                                    loading="lazy"
                                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                            </div>

                            <div>
                                <p style={{
                                    color: '#999',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    marginBottom: '6px',
                                    fontFamily: 'var(--font-body), sans-serif',
                                }}>
                                    {item.date} • {item.category}
                                </p>
                                <h3 style={{
                                    color: '#103065',
                                    fontSize: '16px',
                                    fontFamily: 'Georgia, serif',
                                    fontWeight: '400',
                                    lineHeight: '1.4',
                                    marginBottom: '8px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{
                                    color: '#777',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    fontFamily: 'var(--font-body), sans-serif',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>
                                    {item.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile responsive */}
            <style>{`
                @media (max-width: 768px) {
                    .news-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default LatestNewsSection;
