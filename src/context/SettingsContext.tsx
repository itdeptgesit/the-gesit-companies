import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SettingsContextType {
    maintenanceMode: boolean;
    loading: boolean;
    toggleMaintenanceMode: (value: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            // Try to fetch from Supabase. If table doesn't exist, we'll catch and fallback to localStorage
            const { data } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'maintenance_mode')
                .single();

            if (data) {
                setMaintenanceMode(data.value === 'true');
            } else {
                // Fallback to localStorage for MVP/Safety
                const localValue = localStorage.getItem('maintenance_mode');
                setMaintenanceMode(localValue === 'true');
            }
        } catch (err) {
            console.warn('Settings fetch error (possibly table missing):', err);
            const localValue = localStorage.getItem('maintenance_mode');
            setMaintenanceMode(localValue === 'true');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const toggleMaintenanceMode = async (value: boolean) => {
        try {
            setMaintenanceMode(value);
            localStorage.setItem('maintenance_mode', String(value));

            // Try to sync with Supabase
            const { error } = await supabase
                .from('site_settings')
                .upsert({ key: 'maintenance_mode', value: String(value) }, { onConflict: 'key' });

            if (error) throw error;
        } catch (err) {
            console.error('Error updating maintenance mode:', err);
        }
    };

    return (
        <SettingsContext.Provider value={{ maintenanceMode, loading, toggleMaintenanceMode }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within a SettingsProvider');
    return context;
};
