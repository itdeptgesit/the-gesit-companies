import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `articles/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
};

/**
 * Transforms a standard Supabase storage URL into an optimized rendering URL.
 * Uses Supabase Image Transformation (requires Pro/Paid plan or specific configuration).
 * Falls back to original URL if transformation fails or is not supported.
 */
export const getOptimizedNewsImage = (url: string, _width = 600) => {
    // NOTE: Supabase Image Transformation requires a Pro plan.
    // To enable, uncomment the logic below and ensure your project supports it.

    /*
    if (!url || !url.includes('supabase.co') || !url.includes('/storage/v1/object/public/')) {
        return url;
    }
    const optimizedUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    return `${optimizedUrl}?width=${_width}&quality=80&format=webp`;
    */

    return url;
};
