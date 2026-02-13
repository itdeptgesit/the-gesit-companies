import { supabase } from "./supabase";

export const trackVisitor = async (force: boolean = false) => {
    // Check if we already tracked this session
    const sessionKey = 'v3_visited_v4';
    const hasVisited = sessionStorage.getItem(sessionKey);
    if (hasVisited && !force) {
        return { success: true, message: 'Already tracked' };
    }

    try {
        const { error } = await supabase.rpc('increment_visitor_count');

        if (!error) {
            sessionStorage.setItem(sessionKey, 'true');
            return { success: true };
        } else {
            // Fallback: If RPC fails, try manual update
            const { data: stats, error: fetchError } = await supabase.from('site_stats').select('value').eq('key', 'total_visitors').single();
            if (fetchError) throw fetchError;

            const val = parseInt(stats?.value || '0');
            const currentCount = isNaN(val) ? 0 : val;

            const { error: upsertError } = await supabase.from('site_stats').upsert({
                key: 'total_visitors',
                value: (currentCount + 1).toString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' });

            if (upsertError) throw upsertError;

            sessionStorage.setItem(sessionKey, 'true');
            return { success: true };
        }
    } catch (err: any) {
        console.error('Visitor tracking error:', err);
        return { success: false, error: err.message || 'Unknown error' };
    }
};
