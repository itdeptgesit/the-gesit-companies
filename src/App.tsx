import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop.tsx";
import PageTransition from "./components/PageTransition";
import { NewsProvider } from "./context/NewsContext.tsx";
import { CareerProvider } from "./context/CareerContext.tsx";
import { PropertyProvider } from "./context/PropertyContext.tsx";
import { SettingsProvider, useSettings } from "./context/SettingsContext.tsx";
import AnalyticsTracker from "./components/AnalyticsTracker";
import CookieConsent from "./components/CookieConsent";

// Lazy load all page components for better performance
const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const NewsPage = lazy(() => import("./pages/NewsPage.tsx"));
const CSRPage = lazy(() => import("./pages/CSRPage.tsx"));
const CareerPage = lazy(() => import("./pages/CareerPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const PropertyPage = lazy(() => import("./pages/PropertyPage.tsx"));
const TradingServicePage = lazy(() => import("./pages/TradingServicePage.tsx"));
const ManufacturingPage = lazy(() => import("./pages/ManufacturingPage.tsx"));
const NaturalResourcesPage = lazy(() => import("./pages/NaturalResourcesPage.tsx"));
const NewsDetailPage = lazy(() => import("./pages/NewsDetailPage.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.tsx"));
const MaintenancePage = lazy(() => import("./pages/MaintenancePage.tsx"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage.tsx"));

const AppContent = () => {
  const { settings, loading } = useSettings();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isMaintenancePage = location.pathname === "/maintenance";

  const isStandalone = isMaintenancePage ||
    !["/", "/about", "/news", "/csr", "/career", "/contact", "/property", "/trading-service", "/manufacturing", "/natural-resources"].some(path =>
      location.pathname === path || (path !== "/" && location.pathname.startsWith(`${path}/`))
    );

  useEffect(() => {
    // If maintenance mode is active, redirect to /maintenance unless path is admin or already maintenance
    if (settings.maintenanceMode && !isAdmin && !isMaintenancePage && !loading) {
      window.location.href = "/maintenance";
    }
  }, [settings.maintenanceMode, isAdmin, isMaintenancePage, loading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const titles: { [key: string]: string } = {
      "/": "Home",
      "/about": "About Us",
      "/news": "News",
      "/csr": "CSR",
      "/career": "Career",
      "/contact": "Contact Us",
      "/property": "Property",
      "/trading-service": "Trading & Service",
      "/manufacturing": "Manufacturing",
      "/natural-resources": "Natural Resources",
      "/admin": "Admin Dashboard",
      "/maintenance": "Under Maintenance",
    };

    const path = location.pathname;
    let title = titles[path] || "The Gesit Companies";

    const descriptions: { [key: string]: string } = {
      "/": "The Gesit Companies is committed to contributing to and growing with Indonesia through strategic investments and sustainable practices.",
      "/about": "Learn more about The Gesit Companies, our history, vision, and commitment to excellence in every business segment.",
      "/property": "Explore our property development portfolio, delivering high-quality residential and commercial spaces across Indonesia.",
      "/manufacturing": "Expertise in diverse manufacturing processes, delivering quality products with efficiency and sustainable methods.",
      "/natural-resources": "Sustainable management and development of natural resources, balancing economic growth with environmental care.",
      "/trading-service": "Comprehensive trading and services solutions, connecting markets and delivering value through excellence.",
      "/csr": "Discover how The Gesit Companies gives back through sustainable community impact and social responsibility initiatives.",
      "/news": "Stay updated with the latest insights, official newsroom releases, and corporate announcements from The Gesit Companies.",
      "/career": "Join our team and build your future with The Gesit Companies. Explore career opportunities in diverse business sectors.",
      "/contact": "Get in touch with us at The Gesit Companies headquarters. We're here to answer your inquiries and build partnerships.",
      "/maintenance": "Our website is currently under maintenance. We'll be back shortly.",
    };

    const keywords: { [key: string]: string } = {
      "/": "Gesit, Indonesia, Investment, Sustainability",
      "/about": "Gesit History, Corporate Vision, Timeline",
      "/property": "Property Development, Real Estate Indonesia, Residential",
      "/manufacturing": "Global Manufacturing, Industrial Quality, Sustainable Industry",
      "/natural-resources": "Energy Resources, Sustainable Mining, Environment Indonesia",
      "/trading-service": "Import Export, Market Solutions, Business Services",
      "/csr": "Social Impact, Sustainability Indonesia, Community Empowerment",
      "/news": "Corporate News, Press Releases, Industry Insights",
    };

    // Handle dynamic news routes
    if (path.startsWith("/news/")) {
      title = "News Detail";
    }

    document.title = `${title} - The Gesit Companies`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptions[path] || descriptions["/"]);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords[path] || keywords["/"]);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${title} - The Gesit Companies`);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', descriptions[path] || descriptions["/"]);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://gesit.co.id${path}`);
  }, [location]);

  useEffect(() => {
    // Phase 8: Image Content Protection
    const handleImageProtection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleImageProtection);
    window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('contextmenu', handleImageProtection);
      window.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Visitor Tracking - Optimized with dynamic import
  useEffect(() => {
    const initTracking = async () => {
      const { trackVisitor } = await import("./lib/tracking");
      trackVisitor();
    };

    initTracking();
  }, []);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 overflow-x-hidden">
      {!isAdmin && !isStandalone && <Navbar />}
      <main>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#BA9B32]"></div>
              <p className="mt-4 text-navy-deep font-semibold">Loading...</p>
            </div>
          </div>
        }>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/news" element={<PageTransition><NewsPage /></PageTransition>} />
              <Route path="/news/:id" element={<PageTransition><NewsDetailPage /></PageTransition>} />
              <Route path="/csr" element={<PageTransition><CSRPage /></PageTransition>} />
              <Route path="/career" element={<PageTransition><CareerPage /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
              <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
              <Route path="/property" element={<PageTransition><PropertyPage /></PageTransition>} />
              <Route path="/trading-service" element={<PageTransition><TradingServicePage /></PageTransition>} />
              <Route path="/manufacturing" element={<PageTransition><ManufacturingPage /></PageTransition>} />
              <Route path="/natural-resources" element={<PageTransition><NaturalResourcesPage /></PageTransition>} />
              <Route path="/maintenance" element={<PageTransition><MaintenancePage /></PageTransition>} />
              <Route path="/cookie-policy" element={<PageTransition><CookiePolicyPage /></PageTransition>} />
              <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isAdmin && !isStandalone && <Footer />}
      {!isStandalone && <BackToTop />}
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <NewsProvider>
        <CareerProvider>
          <PropertyProvider>
            <Router>
              <AnalyticsTracker />
              <AppContent />
              <CookieConsent />
              <SpeedInsights />
              <Analytics />
            </Router>
          </PropertyProvider>
        </CareerProvider>
      </NewsProvider>
    </SettingsProvider>
  );
}

export default App;
