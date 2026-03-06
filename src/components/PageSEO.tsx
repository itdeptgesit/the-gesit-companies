import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useSettings } from "../context/SettingsContext";

/**
 * Dynamic Page SEO Component
 * Fetches and applies per-page SEO metadata from Supabase.
 * Falls back to global site settings if no specific page metadata exists.
 */
const PageSEO = () => {
    const location = useLocation();
    const { settings } = useSettings();

    useEffect(() => {
        const updateSEO = async () => {
            const currentPath = location.pathname;

            // 1. Attempt to fetch specific SEO for this path
            const { data } = await supabase
                .from('page_content')
                .select('value')
                .eq('page', 'seo')
                .eq('key', currentPath)
                .single();

            let title = settings.siteTitle || "The Gesit Companies";
            let description = settings.siteDescription || "";
            let keywords = settings.keywords || "";

            if (data && data.value) {
                try {
                    const seo = JSON.parse(data.value);
                    if (seo.title) title = `${seo.title} | ${settings.siteTitle}`;
                    if (seo.description) description = seo.description;
                    if (seo.keywords) keywords = seo.keywords;
                } catch (e) {
                    console.error("SEO Parse Error:", e);
                }
            } else if (currentPath !== '/') {
                // Secondary fallback: Format path for title (e.g. /about -> About)
                const pathName = currentPath.substring(1).charAt(0).toUpperCase() + currentPath.slice(2);
                title = `${pathName} | ${settings.siteTitle}`;
            }

            // 2. Apply to Document
            document.title = title;

            // Update Meta Tags
            const updateMeta = (name: string, content: string) => {
                let meta = document.querySelector(`meta[name="${name}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute('name', name);
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', content);
            };

            const updateOG = (property: string, content: string) => {
                let meta = document.querySelector(`meta[property="${property}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute('property', property);
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', content);
            };

            updateMeta('description', description);
            updateMeta('keywords', keywords);
            updateOG('og:title', title);
            updateOG('og:description', description);
            updateOG('og:url', window.location.href);
        };

        updateSEO();
    }, [location.pathname, settings.siteTitle, settings.siteDescription, settings.keywords]);

    return null; // This is a logic-only component
};

export default PageSEO;
