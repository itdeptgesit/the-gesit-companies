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
import PageSEO from "./components/PageSEO";
import { ToastProvider } from "./context/ToastContext";

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
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage.tsx"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage.tsx"));
const NewsArchivePage = lazy(() => import("./pages/NewsArchivePage.tsx"));

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

  // Apply selected fonts to the website
  useEffect(() => {
    if (!loading) {
      const root = document.documentElement;

      // Apply heading font
      if (settings.headingFont) {
        root.style.setProperty('--font-heading', settings.headingFont);
      }

      // Apply body font
      if (settings.bodyFont) {
        root.style.setProperty('--font-body', settings.bodyFont);
      }
    }
  }, [settings.headingFont, settings.bodyFont, loading]);

  // Dynamic SEO is now handled by the PageSEO component
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      <PageSEO />
      {!isAdmin && !isStandalone && <Navbar />}
      <main>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#BC9C33]"></div>
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
              <Route path="/news/archive" element={<PageTransition><NewsArchivePage /></PageTransition>} />
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
              <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
              <Route path="/terms-of-service" element={<PageTransition><TermsOfServicePage /></PageTransition>} />
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
      <ToastProvider>
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
      </ToastProvider>
    </SettingsProvider>
  );
}

export default App;
