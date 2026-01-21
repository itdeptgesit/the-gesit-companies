import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Property {
    id: number;
    title: string;
    subtitle: string;
    location: string;
    property_type: string;
    description: string;
    points: string[];
    images: string[];
    reverse: boolean;
    order_index: number;
}

interface PropertyContextType {
    properties: Property[];
    loading: boolean;
    error: string | null;
    addProperty: (property: Omit<Property, 'id'>) => Promise<void>;
    updateProperty: (id: number, property: Omit<Property, 'id'>) => Promise<void>;
    deleteProperty: (id: number) => Promise<void>;
    getPropertyById: (id: number) => Property | undefined;
    refreshProperties: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('properties') // Assuming table name is 'properties'
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setProperties(data || []);
        } catch (err: any) {
            console.error('Error fetching properties:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const addProperty = async (property: Omit<Property, 'id'>) => {
        try {
            const { data, error } = await supabase
                .from('properties')
                .insert([property])
                .select();

            if (error) throw error;
            if (data) {
                setProperties([...properties, data[0]]);
            }
        } catch (err: any) {
            console.error('Error adding property:', err);
            throw err;
        }
    };

    const updateProperty = async (id: number, property: Omit<Property, 'id'>) => {
        try {
            const { error } = await supabase
                .from('properties')
                .update(property)
                .eq('id', id);

            if (error) throw error;
            setProperties(properties.map(item => item.id === id ? { ...property, id } : item));
        } catch (err: any) {
            console.error('Error updating property:', err);
            throw err;
        }
    };

    const deleteProperty = async (id: number) => {
        try {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProperties(properties.filter(item => item.id !== id));
        } catch (err: any) {
            console.error('Error deleting property:', err);
            throw err;
        }
    };

    const getPropertyById = (id: number) => {
        return properties.find(item => item.id === id);
    };

    return (
        <PropertyContext.Provider value={{
            properties,
            loading,
            error,
            addProperty,
            updateProperty,
            deleteProperty,
            getPropertyById,
            refreshProperties: fetchProperties
        }}>
            {children}
        </PropertyContext.Provider>
    );
};

export const useProperty = () => {
    const context = useContext(PropertyContext);
    if (!context) throw new Error('useProperty must be used within a PropertyProvider');
    return context;
};
