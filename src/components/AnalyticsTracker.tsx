import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

const AnalyticsTracker = () => {
    const { settings } = useSettings();
    const location = useLocation();

    // Initialize GA script
    useEffect(() => {
        const initGA = () => {
            if (!settings.googleAnalyticsId?.startsWith('G-')) return;
            const consent = localStorage.getItem('cookie_consent');
            if (consent !== 'true') return;

            const scriptId = 'ga-script';
            if (document.getElementById(scriptId)) return;

            const script = document.createElement('script');
            script.id = scriptId;
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`;

            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
                window.dataLayer.push(args);
            }
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', settings.googleAnalyticsId);
        };

        // Check initially
        initGA();

        // Listen for consent updates
        const handleConsentUpdate = () => initGA();
        window.addEventListener('cookie_consent_updated', handleConsentUpdate);

        return () => window.removeEventListener('cookie_consent_updated', handleConsentUpdate);
    }, [settings.googleAnalyticsId]);

    // Track Page Views
    useEffect(() => {
        if (!settings.googleAnalyticsId?.startsWith('G-')) return;

        // Only track if consent is given (though usually GA handles this if script isn't loaded, 
        // checking here avoids errors if gtag isn't defined yet)
        const consent = localStorage.getItem('cookie_consent');
        if (consent !== 'true') return;

        if (typeof window.gtag === 'function') {
            window.gtag('config', settings.googleAnalyticsId, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location, settings.googleAnalyticsId]);

    return null;
};

export default AnalyticsTracker;
