import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Calendar, Share2, Bookmark, ChevronRight, Check } from "lucide-react";

/**
 * NewsDetailPage - Premium Immersive Reading Experience
 * Focuses on high-quality typography, readability, and cinematic presentation.
 */
import { useNews } from "../context/NewsContext.tsx";

const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : "";
};

const NewsDetailPage = () => {
    const { id } = useParams();
    const { newsItems, loading, error, getNewsById } = useNews();
    const article = getNewsById(Number(id));
    const [showCopied, setShowCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: article?.title,
            text: article?.excerpt,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
            } catch (err) {
                console.error("Clipboard error:", err);
            }
        }
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen pt-40 flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 border-4 border-[#BC9C33] border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                    Loading Story...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white min-h-screen pt-40 text-center px-6">
                <p className="text-red-500 font-bold uppercase tracking-widest mb-4">
                    Service Unavailable
                </p>
                <p className="text-slate-500 text-sm max-w-md mx-auto">{error}</p>
            </div>
        );
    }

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
    };

    if (!article) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-4xl font-display mb-4">Story Not Found</h2>
                    <Link to="/news" className="text-[#BC9C33] font-bold uppercase tracking-widest text-xs">Return to Archive</Link>
                </div>
            </div>
        );
    }

    // Split content by newlines for rendering
    const paragraphs = (article.content || "").split('\n').filter(p => p.trim() !== '');
    const relatedStories = newsItems.filter(item => item.id !== article.id).slice(0, 3);

    return (
        <div className="bg-white min-h-screen text-navy-deep font-body">
            {/* 1. Cinematic Header */}
            <header className="relative h-[70vh] flex items-end pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {article.media_type === 'video' && article.video_url ? (
                        <div className="w-full h-full relative">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`${getYoutubeEmbedUrl(article.video_url)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYoutubeEmbedUrl(article.video_url).split('/').pop()}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full object-cover pointer-events-none scale-150"
                            ></iframe>
                            <div className="absolute inset-0 bg-navy-deep/40 pointer-events-auto"></div>
                        </div>
                    ) : (
                        <>
                            <motion.img
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 10, ease: "linear" }}
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/20"></div>
                            <div className="absolute inset-0 bg-black/20"></div>
                        </>
                    )}
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-white/80 text-xs font-bold uppercase tracking-[.4em] mb-8 drop-shadow-md"
                        >
                            <Link to="/news" className="hover:text-[#BC9C33] transition-colors">Archive</Link>
                            <ChevronRight size={14} className="text-[#BC9C33] drop-shadow-none" />
                            <span className="text-white">Full Article</span>
                        </motion.div>

                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#BC9C33] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 inline-block shadow-2xl"
                        >
                            {article.category}
                        </motion.span>

                        <motion.h1
                            {...fadeIn}
                            className="text-white text-3xl md:text-6xl font-display leading-[1.1] mb-8 md:mb-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                        >
                            {article.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap items-center gap-8 text-[11px] font-bold uppercase tracking-[.3em] text-white/80 drop-shadow-md"
                        >
                            <span className="flex items-center gap-2"><Calendar size={14} className="text-[#BC9C33] drop-shadow-none" /> {article.date}</span>
                            <span className="flex items-center gap-2"><User size={14} className="text-[#BC9C33] drop-shadow-none" /> {article.author}</span>
                            <span className="flex items-center gap-2"><Clock size={14} className="text-[#BC9C33] drop-shadow-none" /> 4 MIN READ</span>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* 2. Main Article Content */}
            <section className="py-24 md:py-32 relative">
                {/* Decorative Side Elements */}
                <div className="absolute top-40 left-0 w-24 h-[1px] bg-slate-100 hidden lg:block"></div>
                <div className="absolute top-40 right-0 w-24 h-[1px] bg-slate-100 hidden lg:block"></div>

                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Sidebar: Interactions */}
                        <aside className="lg:col-span-1 flex lg:flex-col gap-6 items-center border-r border-slate-50 relative">
                            <div className="lg:sticky lg:top-32 flex lg:flex-col gap-4">
                                <button
                                    onClick={handleShare}
                                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${showCopied ? 'bg-green-500 border-green-500 text-white' : 'border-slate-100 text-slate-400 hover:text-[#BC9C33] hover:border-[#BC9C33]'}`}
                                >
                                    {showCopied ? <Check size={18} /> : <Share2 size={18} />}
                                </button>
                                <button className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#BC9C33] hover:border-[#BC9C33] transition-all">
                                    <Bookmark size={18} />
                                </button>
                            </div>
                        </aside>

                        {/* Article Text */}
                        <motion.article
                            {...fadeIn}
                            className="lg:col-span-11 prose prose-slate prose-lg max-w-none"
                        >
                            <p className="text-lg md:text-2xl font-light text-slate-500 italic border-l-4 border-[#BC9C33] pl-6 md:pl-8 mb-8 md:mb-16 leading-relaxed">
                                {article.excerpt}
                            </p>

                            <div className="space-y-6 md:space-y-12 text-slate-600 font-light text-base md:text-xl leading-loose">
                                {paragraphs.map((paragraph, idx) => {
                                    const trimmedP = paragraph.trim();

                                    // 1. Check if paragraph is a single YouTube URL
                                    const youtubeEmbed = getYoutubeEmbedUrl(trimmedP);
                                    if (youtubeEmbed && trimmedP.length < 150) {
                                        return (
                                            <div key={idx} className="my-12 w-full aspect-video rounded-card overflow-hidden shadow-2xl relative group">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`${youtubeEmbed}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                                                    title="YouTube video player"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-full"
                                                ></iframe>
                                            </div>
                                        );
                                    }

                                    // 2. Check if paragraph is a direct video link (.mp4, .webm, .ogg)
                                    const videoRegex = /\.(mp4|webm|ogg)(\?.*)?$/i;
                                    if (videoRegex.test(trimmedP) && trimmedP.length < 300) {
                                        const ext = trimmedP.split('.').pop()?.split('?')[0].toLowerCase() || 'mp4';
                                        return (
                                            <div key={idx} className="my-12 w-full aspect-video rounded-card overflow-hidden shadow-2xl bg-black flex items-center justify-center">
                                                <video
                                                    controls
                                                    preload="metadata"
                                                    playsInline
                                                    className="w-full h-full object-contain"
                                                    poster={article.image}
                                                    src={trimmedP}
                                                >
                                                    <source src={trimmedP} type={`video/${ext}`} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        );
                                    }
                                    return <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }}></p>;
                                })}
                            </div>

                            {/* Pull Quote Mockup - Only show if quote exists */}
                            {article.quote && (
                                <div className="my-20 p-12 bg-slate-50 rounded-card text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#BC9C33]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                    <h3 className="text-xl md:text-4xl font-display leading-tight italic relative z-10">
                                        "{article.quote}"
                                    </h3>
                                    {article.quote_author && (
                                        <p className="mt-8 text-[#BC9C33] font-bold uppercase tracking-widest text-[10px]">{article.quote_author}</p>
                                    )}
                                </div>
                            )}

                            {/* Article Footer */}
                            <div className="mt-24 pt-12 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    to="/news"
                                    className="flex items-center gap-4 text-navy-deep font-bold uppercase tracking-widest text-xs hover:text-[#BC9C33] transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Archive
                                </Link>
                                <div className="flex gap-4">
                                    {(article.tags ? article.tags.split(',').map(tag => tag.trim()) : [article.category]).map(tag => (
                                        <span key={tag} className="text-[10px] font-bold uppercase text-slate-400 tracking-widest bg-slate-50 px-4 py-2 rounded-full">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.article>
                    </div>
                </div>
            </section>

            {/* 3. Related Stories (Mini Grid) */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center justify-between mb-16">
                        <h3 className="text-3xl md:text-4xl font-display">Keep Reading</h3>
                        <div className="h-[1px] bg-slate-200 flex-grow mx-12 hidden md:block"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {relatedStories.map((item) => (
                            <Link key={item.id} to={`/news/${item.id}`} className="group cursor-pointer">
                                <div className="aspect-[16/10] overflow-hidden rounded-card-sm mb-6 shadow-lg">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                                </div>
                                <h4 className="text-xl font-display leading-snug group-hover:text-[#BC9C33] transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewsDetailPage;
