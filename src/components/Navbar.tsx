import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const [isHoveredMenu, setIsHoveredMenu] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            setActiveSubMenu(null);
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        {
            name: "Our Business",
            href: "#",
            subMenu: [
                { name: "Property", href: "/property" },
                { name: "Trading & Services", href: "/trading-service" },
                { name: "Manufacturing", href: "/manufacturing" },
                { name: "Natural Resources", href: "/natural-resources" },
            ]
        },
        { name: "CSR", href: "/csr" },
        { name: "News", href: "/news" },
        { name: "Career", href: "/career" },
        { name: "Contact Us", href: "/contact" },
    ];

    const isLinkActive = (href: string) => {
        if (href === "/" || href === "#") return location.pathname === href;
        return location.pathname.startsWith(href);
    };

    const isBusinessActive = () => {
        return navLinks.find(l => l.name === "Our Business")?.subMenu?.some(sub => isLinkActive(sub.href));
    };

    const navTextColor = isScrolled ? "text-navy-deep" : "text-white";
    const navHoverColor = "hover:text-[#BA9B32]";

    const menuVariants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const, when: "afterChildren" as const }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: 20 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <motion.nav
            initial={false}
            animate={{
                backgroundColor: isScrolled ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)",
                boxShadow: isScrolled ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" : "0 0 0 0 rgb(0 0 0 / 0)",
                borderBottomColor: isScrolled ? "rgba(241, 245, 249, 1)" : "rgba(241, 245, 249, 0)",
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 w-full z-50 border-b transition-[padding] duration-500 ${isScrolled ? "py-4" : "py-8"}`}
        >
            <div className="container mx-auto px-6 sm:px-12 flex justify-between items-center h-full">
                <Link
                    to="/"
                    className={`flex items-center gap-3 active:scale-95 transition-all duration-500 z-50 relative ${isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                >
                    <img
                        alt="Gesit Logo"
                        className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                        src="/logo gesit.png"
                        width="59"
                        height="70"
                        loading="eager"
                        decoding="async"
                    />
                    <div className={`flex flex-col uppercase tracking-[.15em] font-black text-[13px] sm:text-[16px] transition-all duration-500 ${isScrolled ? "text-navy-deep" : "text-white drop-shadow-md"}`}>
                        <span>THE GESIT COMPANIES</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className={`hidden lg:flex items-center gap-10 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}>
                    <ul className={`flex items-center gap-8 uppercase text-[13px] font-bold tracking-wider transition-all duration-300 ${navTextColor} ${!isScrolled ? "drop-shadow-md" : ""}`}>
                        {navLinks.map((link) => (
                            <li
                                key={link.name}
                                className="relative group"
                                onMouseEnter={() => setIsHoveredMenu(link.name)}
                                onMouseLeave={() => setIsHoveredMenu(null)}
                            >
                                <div className="flex items-center gap-1 cursor-pointer py-2 relative">
                                    {link.subMenu ? (
                                        <span className={`${navHoverColor} transition-colors flex items-center gap-1 ${isBusinessActive() ? "text-[#BA9B32]" : ""}`}>
                                            {link.name}
                                        </span>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className={`${navHoverColor} transition-colors ${isLinkActive(link.href) ? "text-[#BA9B32]" : ""}`}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                    {link.subMenu && (
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isHoveredMenu === link.name ? "rotate-180 text-[#BA9B32]" : ""}`} />
                                    )}

                                    {/* Underline Indicator */}
                                    <AnimatePresence>
                                        {(isLinkActive(link.href) || (link.name === "Our Business" && isBusinessActive())) && (
                                            <motion.span
                                                layoutId="navUnderline"
                                                className="absolute bottom-0 left-0 w-full h-0.5 bg-[#BA9B32]"
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                exit={{ scaleX: 0 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                {link.subMenu && (
                                    <AnimatePresence>
                                        {isHoveredMenu === link.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-xl rounded-card-sm py-4 mt-2 border border-slate-100 overflow-hidden"
                                            >
                                                {link.subMenu.map((sub) => (
                                                    <Link
                                                        key={sub.name}
                                                        to={sub.href}
                                                        className="block px-8 py-3 text-[11px] text-navy-deep hover:bg-slate-50 hover:text-[#BA9B32] transition-all uppercase tracking-widest font-bold"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mobile Trigger */}
                <div className={`lg:hidden transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`p-2 transition-all duration-300 ${isScrolled ? "text-navy-deep" : "text-white drop-shadow-md"}`}
                        aria-label="Open menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence mode="wait">
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
                        />

                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed inset-0 z-[60] bg-white w-full h-full flex flex-col pt-10 px-8 shadow-2xl lg:hidden"
                        >
                            <div className="flex flex-col h-full">
                                {/* Drawer Header */}
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-3">
                                        <img
                                            alt="Gesit Logo"
                                            className="w-8 h-8 object-contain"
                                            src="/logo gesit.png"
                                            loading="eager"
                                            decoding="async"
                                        />
                                        <div className="flex flex-col uppercase tracking-[.15em] font-black text-[13px] text-navy-deep">
                                            <span>THE GESIT COMPANIES</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-navy-deep p-1 active:scale-90 transition-transform"
                                        aria-label="Close menu"
                                    >
                                        <X size={28} />
                                    </button>
                                </div>

                                <ul className="flex flex-col space-y-1 relative z-10 flex-1">
                                    {navLinks.map((link, idx) => (
                                        <motion.li
                                            key={link.name}
                                            variants={itemVariants}
                                            custom={idx}
                                            className="border-b border-slate-50"
                                        >
                                            <div className="py-1">
                                                {link.subMenu ? (
                                                    <div className="w-full">
                                                        <button
                                                            onClick={() => setActiveSubMenu(activeSubMenu === link.name ? null : link.name)}
                                                            className={`flex items-center justify-between w-full py-4 text-[14px] font-black uppercase tracking-widest transition-colors ${activeSubMenu === link.name ? "text-[#BA9B32]" : (isLinkActive(link.href) ? "text-[#BA9B32]" : "text-navy-deep")}`}
                                                            aria-label={`Toggle ${link.name} submenu`}
                                                            aria-expanded={activeSubMenu === link.name}
                                                        >
                                                            <span>{link.name}</span>
                                                            <ChevronDown
                                                                size={18}
                                                                className={`transition-transform duration-500 ${activeSubMenu === link.name ? "rotate-180" : ""}`}
                                                            />
                                                        </button>
                                                        <AnimatePresence>
                                                            {activeSubMenu === link.name && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="flex flex-col gap-1 pb-6 pt-1 pl-4 border-l-2 border-[#BA9B32]/20 ml-1">
                                                                        {link.subMenu.map((sub) => (
                                                                            <Link
                                                                                key={sub.name}
                                                                                to={sub.href}
                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                                className="py-3 text-slate-500 text-[12px] uppercase tracking-widest font-bold flex items-center gap-3 active:text-[#BA9B32]"
                                                                            >
                                                                                <span className="w-1 h-1 rounded-full bg-[#BA9B32]/40" />
                                                                                {sub.name}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        to={link.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`flex items-center justify-between w-full py-4 text-[14px] font-black uppercase tracking-widest transition-colors ${isLinkActive(link.href) ? "text-[#BA9B32]" : "text-navy-deep"}`}
                                                    >
                                                        <span>{link.name}</span>
                                                        {isLinkActive(link.href) && <div className="w-1.5 h-1.5 rounded-full bg-[#BA9B32]" />}
                                                    </Link>
                                                )}
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>

                                <motion.div
                                    variants={itemVariants}
                                    className="mt-auto pb-10 pt-8"
                                >
                                    <div className="text-center">
                                        <div className="text-slate-300 text-[10px] tracking-[.3em] uppercase font-bold">
                                            © {new Date().getFullYear()} The Gesit Companies
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
