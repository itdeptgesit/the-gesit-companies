import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const location = useLocation();

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        // Set initial state
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveSubMenu(null);
    }, [location]);

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
        if (href === "/") return location.pathname === "/";
        if (href === "#") return false;
        return location.pathname.startsWith(href);
    };

    const isBusinessActive = () => {
        return navLinks.find(l => l.name === "Our Business")?.subMenu?.some(sub => isLinkActive(sub.href));
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 shadow-md' : 'py-6 pt-8'}`}
            style={{
                backgroundColor: isScrolled ? '#103065' : 'transparent',
            }}
        >
            <div className="w-full px-8 md:px-16 lg:px-24 flex justify-between items-center h-[60px]">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-[14px] z-50 relative shrink-0"
                >
                    <img
                        alt="Gesit Logo"
                        className="w-[48px] h-[48px] object-contain"
                        src="/logo-gesit.png"
                        width="48"
                        height="48"
                        loading="eager"
                        decoding="async"
                    />
                    <span className="font-sans font-bold text-[16px] tracking-[0.14em] uppercase text-[#BC9C33] whitespace-nowrap">
                        THE GESIT COMPANIES
                    </span>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-11 uppercase text-[14px] tracking-[0.12em] font-semibold text-white font-sans">
                    {navLinks.map((link) => (
                        <li
                            key={link.name}
                            className="relative group h-full flex items-center"
                        >
                            {link.subMenu ? (
                                <div className="relative">
                                    <button
                                        className={`flex items-center gap-1.5 py-1 uppercase transition-colors hover:text-white/80 ${isBusinessActive() ? 'text-white' : 'text-white'}`}
                                        style={{ borderBottom: isBusinessActive() ? '2.5px solid #BC9C33' : '2.5px solid transparent' }}
                                    >
                                        {link.name}
                                    </button>
                                    {/* Dropdown */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 min-w-[220px] bg-white/75 backdrop-blur-sm shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 mt-2 rounded-sm border border-white/20">
                                        {link.subMenu.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                to={sub.href}
                                                className={`block px-6 py-3 text-[13px] text-[#333] hover:bg-[#103065]/5 hover:text-[#BC9C33] transition-colors uppercase font-bold tracking-wider ${isLinkActive(sub.href) ? 'text-[#BC9C33]' : ''}`}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to={link.href}
                                    className={`relative block py-1 transition-colors hover:text-white/80 ${isLinkActive(link.href) ? 'text-white' : 'text-white'}`}
                                    style={{ borderBottom: isLinkActive(link.href) ? '2.5px solid #BC9C33' : '2.5px solid transparent' }}
                                >
                                    {link.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Mobile Trigger */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden text-white p-2"
                    aria-label="Open menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] lg:hidden bg-[#103065]"
                    >
                        <div className="relative h-full flex flex-col justify-center px-12 md:px-24">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-10 right-10 text-white p-2"
                            >
                                <X size={32} />
                            </button>

                            {/* Nav Links */}
                            <div className="flex flex-col items-start gap-9">
                                {navLinks.map((link, idx) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="text-left"
                                    >
                                        {link.subMenu ? (
                                            <div className="flex flex-col items-start">
                                                <button
                                                    onClick={() => setActiveSubMenu(activeSubMenu === link.name ? null : link.name)}
                                                    className={`text-[19px] font-sans font-bold uppercase tracking-[0.15em] transition-colors flex items-center gap-3 ${activeSubMenu === link.name || isBusinessActive() ? 'text-[#BC9C33]' : 'text-white hover:text-[#BC9C33]'}`}
                                                >
                                                    {link.name}
                                                    <ChevronDown size={18} className={`transition-transform duration-300 ${activeSubMenu === link.name ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeSubMenu === link.name && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="flex flex-col items-start gap-5 mt-6 overflow-hidden pl-6 border-l border-white/10 ml-1"
                                                        >
                                                            {link.subMenu.map((sub) => (
                                                                <Link
                                                                    key={sub.name}
                                                                    to={sub.href}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className={`text-[15px] font-sans font-bold uppercase tracking-widest transition-colors ${isLinkActive(sub.href) ? 'text-[#BC9C33]' : 'text-white/60 hover:text-white'}`}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <Link
                                                to={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`text-[19px] font-sans font-bold uppercase tracking-[0.15em] transition-colors ${isLinkActive(link.href) ? 'text-[#BC9C33]' : 'text-white hover:text-[#BC9C33]'}`}
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
