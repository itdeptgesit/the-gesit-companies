import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface NewsItem {
    id: number;
    type: 'news' | 'csr';
    category: string;
    title: string;
    date: string;
    author: string;
    excerpt: string;
    content?: string;
    image: string;
    featured?: boolean;
    tags?: string;
    quote?: string;
    quote_author?: string;
    video_url?: string;
    media_type?: 'image' | 'video';
}

interface NewsContextType {
    newsItems: NewsItem[];
    loading: boolean;
    error: string | null;
    addNews: (news: Omit<NewsItem, 'id'>) => Promise<void>;
    updateNews: (id: number, news: Omit<NewsItem, 'id'>) => Promise<void>;
    deleteNews: (id: number) => Promise<void>;
    getNewsById: (id: number) => NewsItem | undefined;
    refreshNews: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setNewsItems(data || []);
        } catch (err: any) {
            console.error('Error fetching news:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const addNews = async (news: Omit<NewsItem, 'id'>) => {
        try {
            const { data, error } = await supabase
                .from('news')
                .insert([news])
                .select();

            if (error) throw error;
            if (data) {
                setNewsItems([data[0], ...newsItems]);
            }
        } catch (err: any) {
            console.error('Error adding news:', err);
            throw err;
        }
    };

    const updateNews = async (id: number, news: Omit<NewsItem, 'id'>) => {
        try {
            const { error } = await supabase
                .from('news')
                .update(news)
                .eq('id', id);

            if (error) throw error;
            setNewsItems(newsItems.map(item => item.id === id ? { ...news, id } : item));
        } catch (err: any) {
            console.error('Error updating news:', err);
            throw err;
        }
    };

    const deleteNews = async (id: number) => {
        try {
            const { error } = await supabase
                .from('news')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setNewsItems(newsItems.filter(item => item.id !== id));
        } catch (err: any) {
            console.error('Error deleting news:', err);
            throw err;
        }
    };

    const getNewsById = (id: number) => {
        return newsItems.find(item => item.id === id);
    };

    return (
        <NewsContext.Provider value={{
            newsItems,
            loading,
            error,
            addNews,
            updateNews,
            deleteNews,
            getNewsById,
            refreshNews: fetchNews
        }}>
            {children}
        </NewsContext.Provider>
    );
};

export const useNews = () => {
    const context = useContext(NewsContext);
    if (!context) throw new Error('useNews must be used within a NewsProvider');
    return context;
};
