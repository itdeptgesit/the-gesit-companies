import { supabase } from "./supabase";

export const trackVisitor = async () => {
    const hasVisited = sessionStorage.getItem('v3_visited');
    if (!hasVisited) {
        try {
            const { data: stats } = await supabase
                .from('site_stats')
                .select('value')
                .eq('key', 'total_visitors')
                .single();

            const currentCount = stats ? parseInt(stats.value) : 0;
            await supabase
                .from('site_stats')
                .upsert({ key: 'total_visitors', value: (currentCount + 1).toString() }, { onConflict: 'key' });

            sessionStorage.setItem('v3_visited', 'true');
        } catch (err) {
            console.error('Visitor tracking error:', err);
        }
    }
};
