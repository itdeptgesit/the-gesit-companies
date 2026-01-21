import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import NewsPage from "./pages/NewsPage.tsx";
import CSRPage from "./pages/CSRPage.tsx";
import CareerPage from "./pages/CareerPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import PropertyPage from "./pages/PropertyPage.tsx";
import TradingServicePage from "./pages/TradingServicePage.tsx";
import ManufacturingPage from "./pages/ManufacturingPage.tsx";
import NaturalResourcesPage from "./pages/NaturalResourcesPage.tsx";
import NewsDetailPage from "./pages/NewsDetailPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop.tsx";
import { NewsProvider } from "./context/NewsContext.tsx";
import { CareerProvider } from "./context/CareerContext.tsx";

import { PropertyProvider } from "./context/PropertyContext.tsx";

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

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
    };

    const path = location.pathname;
    let title = titles[path] || "The Gesit Companies";

    // Handle dynamic news routes
    if (path.startsWith("/news/")) {
      title = "News Detail";
    }

    document.title = `${title} - The Gesit Companies`;
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

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/csr" element={<CSRPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/property" element={<PropertyPage />} />
          <Route path="/trading-service" element={<TradingServicePage />} />
          <Route path="/manufacturing" element={<ManufacturingPage />} />
          <Route path="/natural-resources" element={<NaturalResourcesPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      <BackToTop />
    </div>
  );
};

function App() {
  return (
    <NewsProvider>
      <CareerProvider>
        <PropertyProvider>
          <Router>
            <AppContent />
          </Router>
        </PropertyProvider>
      </CareerProvider>
    </NewsProvider>
  );
}

export default App;
