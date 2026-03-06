import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

const Footer = () => {
    const { settings } = useSettings();
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ backgroundColor: '#103065', padding: '80px 0 40px', color: 'white' }}>
            <div className="container mx-auto px-6">
                {/* 4-column grid: 1 empty on left, 3 content on right */}
                <div className="footer-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1.3fr',
                    gap: '40px',
                    marginBottom: '60px'
                }}>
                    {/* Empty first column to shift content right */}
                    <div className="hidden md:block"></div>

                    {/* Column 1: Company Links */}
                    <div>
                        <h3 style={{
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: '400',
                            marginBottom: '20px',
                            fontFamily: 'Georgia, serif',
                        }}>
                            Company Links
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'About Us', href: '/about' },
                                { label: 'CSR', href: '/csr' },
                                { label: 'News', href: '/news' },
                                { label: 'Career', href: '/career' },
                            ].map(item => (
                                <li key={item.href} style={{ marginBottom: '8px' }}>
                                    <Link
                                        to={item.href}
                                        style={{
                                            color: '#e2e8f0',
                                            textDecoration: 'none',
                                            fontSize: '16px',
                                            fontFamily: "'Source Sans Pro', sans-serif",
                                            fontWeight: '400',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#BC9C33')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '#e2e8f0')}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Our Business */}
                    <div>
                        <h3 style={{
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: '400',
                            marginBottom: '20px',
                            fontFamily: 'Georgia, serif',
                        }}>
                            Our Business
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                { label: 'Property', href: '/property' },
                                { label: 'Trading & Services', href: '/trading-service' },
                                { label: 'Manufacturing', href: '/manufacturing' },
                                { label: 'Natural Resources', href: '/natural-resources' },
                            ].map(item => (
                                <li key={item.href} style={{ marginBottom: '8px' }}>
                                    <Link
                                        to={item.href}
                                        style={{
                                            color: '#e2e8f0',
                                            textDecoration: 'none',
                                            fontSize: '16px',
                                            fontFamily: "'Source Sans Pro', sans-serif",
                                            fontWeight: '400',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#BC9C33')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '#e2e8f0')}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Find Us */}
                    <div>
                        <h3 style={{
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: '400',
                            marginBottom: '20px',
                            fontFamily: 'Georgia, serif',
                        }}>
                            Find Us
                        </h3>
                        <div style={{ color: '#e2e8f0', fontSize: '16px', lineHeight: '1.7', fontFamily: "'Source Sans Pro', sans-serif" }}>
                            <a
                                href={settings.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#BC9C33] transition-colors"
                                style={{ marginBottom: '14px', whiteSpace: 'pre-line', display: 'block', textDecoration: 'none', color: 'inherit' }}
                            >
                                {settings.officeAddress || "The City Tower, 27th Floor\nJl. M.H. Thamrin No 81\nMenteng, Jakarta Pusat\nDKI Jakarta 10310 – Indonesia"}
                            </a>
                            <p style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#94a3b8', fontWeight: '600' }}>Phone :</span> {settings.phoneNumber || "+62 21 3101601"}
                            </p>
                            <p>
                                <span style={{ color: '#94a3b8', fontWeight: '600' }}>Mail :</span>{" "}
                                <a
                                    href={`mailto:${settings.email || "contact@gesit.co.id"}`}
                                    style={{ color: '#e2e8f0', textDecoration: 'none', transition: 'color 0.3s ease' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#BC9C33')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#e2e8f0')}
                                >
                                    {settings.email || "contact@gesit.co.id"}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Logo and Copyright */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
                    {/* Gold Logo */}
                    <div style={{ marginBottom: '20px' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                            <img
                                alt="Gesit Gold Logo"
                                style={{ height: '40px', width: 'auto' }}
                                src="/logo-gesit.png"
                            />
                            <span style={{
                                fontFamily: "'Source Sans Pro', sans-serif",
                                fontWeight: '700',
                                fontSize: '13px',
                                letterSpacing: '0.15em',
                                color: '#BC9C33',
                                textTransform: 'uppercase'
                            }}>
                                THE GESIT COMPANIES
                            </span>
                        </Link>
                    </div>

                    {/* Copyright */}
                    <p style={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '11px',
                        fontWeight: '600',
                        fontFamily: "'Source Sans Pro', sans-serif",
                        letterSpacing: '0.1em'
                    }}>
                        © {currentYear} THE GESIT COMPANIES. ALL RIGHTS RESERVED
                    </p>
                </div>
            </div>

            {/* Mobile responsive */}
            <style>{`
                @media (max-width: 1024px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr 1fr !important;
                    }
                    .footer-grid .hidden {
                        display: none !important;
                    }
                }
                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
