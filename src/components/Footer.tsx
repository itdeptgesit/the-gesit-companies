import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-navy-deep pt-24 pb-12 text-white border-t border-[#BA9B32]/20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Logo & Description */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-4 mb-8 group/logo">
                            <img
                                alt="Gesit Logo"
                                className="w-10 h-10 object-contain transition-transform duration-500 group-hover/logo:scale-110"
                                src="/logo gesit.png"
                            />
                            <span className="font-extrabold text-[13px] tracking-[.15em] uppercase text-white group-hover/logo:text-[#BA9B32] transition-colors whitespace-nowrap">
                                THE GESIT COMPANIES
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light">
                            A trusted strategic partner in Indonesia&apos;s growth for over five decades.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[#BA9B32] font-display text-sm mb-10 uppercase tracking-[0.3em] font-extrabold">
                            Quick Links
                        </h4>
                        <ul className="space-y-4 text-slate-300 text-sm font-semibold tracking-wide">
                            <li><Link to="/" className="hover:text-[#BA9B32] transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-[#BA9B32] transition-colors">About Us</Link></li>
                            <li><Link to="/news" className="hover:text-[#BA9B32] transition-colors">News & Insights</Link></li>
                            <li><Link to="/csr" className="hover:text-[#BA9B32] transition-colors">CSR Initiatives</Link></li>
                            <li><Link to="/career" className="hover:text-[#BA9B32] transition-colors">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-[#BA9B32] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Our Business */}
                    <div>
                        <h4 className="text-[#BA9B32] font-display text-sm mb-10 uppercase tracking-[0.3em] font-extrabold">
                            Our Business
                        </h4>
                        <ul className="space-y-4 text-slate-300 text-sm font-semibold tracking-wide">
                            <li><Link to="/property" className="hover:text-[#BA9B32] transition-colors">Property</Link></li>
                            <li><Link to="/trading-service" className="hover:text-[#BA9B32] transition-colors">Trading & Services</Link></li>
                            <li><Link to="/manufacturing" className="hover:text-[#BA9B32] transition-colors">Manufacturing</Link></li>
                            <li><Link to="/natural-resources" className="hover:text-[#BA9B32] transition-colors">Natural Resources</Link></li>
                        </ul>
                    </div>

                    {/* Find Us */}
                    <div>
                        <h4 className="text-[#BA9B32] font-display text-sm mb-10 uppercase tracking-[0.3em] font-extrabold">
                            Find Us
                        </h4>
                        <div className="space-y-5 text-slate-300 text-sm font-medium leading-relaxed tracking-wide">
                            <p className="font-semibold">
                                The City Tower, 27th Floor<br />
                                Jl. M.H. Thamrin No 81<br />
                                Jakarta Pusat, 10310 – Indonesia
                            </p>
                            <div className="space-y-3">
                                <p className="flex items-center gap-4 group/contact font-bold">
                                    <Phone size={16} className="text-[#BA9B32] transition-transform group-hover/contact:scale-110" />
                                    <span>+62 21 3101601</span>
                                </p>
                                <p className="flex items-center gap-4 group/contact font-bold">
                                    <Mail size={16} className="text-[#BA9B32] transition-transform group-hover/contact:scale-110" />
                                    <Link
                                        to="mailto:contact@gesit.co.id"
                                        className="hover:text-[#BA9B32] transition-colors outline-none"
                                    >
                                        contact@gesit.co.id
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/5 pt-12 flex justify-center items-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-medium text-center">
                        © {currentYear} THE GESIT COMPANIES. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
