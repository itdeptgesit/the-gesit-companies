import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SettingsState {
    maintenanceMode: boolean;
    siteTitle: string;
    siteDescription: string;
    keywords: string;
    officeAddress: string;
    phoneNumber: string;
    socialFacebook: string;
    socialInstagram: string;
    socialLinkedin: string;
    logoUrl: string;
    faviconUrl: string;
    email: string;
    googleMapsUrl: string;
    googleAnalyticsId: string;
}

interface SettingsContextType {
    settings: SettingsState;
    loading: boolean;
    updateSetting: (key: keyof SettingsState, value: string | boolean) => Promise<void>;
    updateSettings: (newSettings: Partial<SettingsState>) => Promise<void>;
}

const defaultSettings: SettingsState = {
    maintenanceMode: false,
    siteTitle: 'The Gesit Companies',
    siteDescription: 'A diversified conglomerate in Indonesia.',
    keywords: 'business, property, trading, mining',
    officeAddress: 'The City Tower, 27th Floor\nJl. M.H. Thamrin No 81, Jakarta Pusat, 10310',
    phoneNumber: '+62 21 3101601',
    socialFacebook: '',
    socialInstagram: '',
    socialLinkedin: '',
    logoUrl: '',
    faviconUrl: '',
    email: 'contact@gesit.co.id',
    googleMapsUrl: 'https://maps.app.goo.gl/tpHm5Hvy8LnV3ayu8',
    googleAnalyticsId: ''
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SettingsState>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await supabase
                .from('site_settings')
                .select('key, value');

            if (data) {
                const newSettings = { ...defaultSettings };
                data.forEach(item => {
                    const key = item.key as keyof SettingsState;
                    if (key in newSettings) {
                        if (key === 'maintenanceMode') {
                            // @ts-ignore
                            newSettings[key] = item.value === 'true';
                        } else {
                            // @ts-ignore
                            newSettings[key] = item.value;
                        }
                    }
                });
                setSettings(newSettings);
            }
        } catch (err) {
            console.warn('Settings fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateSetting = async (key: keyof SettingsState, value: string | boolean) => {
        try {
            setSettings(prev => ({ ...prev, [key]: value }));

            // Persist to Supabase
            await supabase
                .from('site_settings')
                .upsert({ key, value: String(value) }, { onConflict: 'key' });

        } catch (err) {
            console.error(`Error updating ${key}:`, err);
        }
    };

    const updateSettings = async (newSettings: Partial<SettingsState>) => {
        try {
            setSettings(prev => ({ ...prev, ...newSettings }));

            const updates = Object.entries(newSettings).map(([key, value]) => ({
                key,
                value: String(value)
            }));

            await supabase
                .from('site_settings')
                .upsert(updates, { onConflict: 'key' });

        } catch (err) {
            console.error('Error batch updating settings:', err);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSetting, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within a SettingsProvider');
    return context;
};
