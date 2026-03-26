import { supabase } from "./supabase";

/**
 * Visitor Tracking System
 * Records total visits and daily trends for analytics.
 */
export const trackVisitor = async (force: boolean = false) => {
    // Check if we already tracked this session
    const sessionKey = 'v3_visited_v4';
    const hasVisited = sessionStorage.getItem(sessionKey);
    if (hasVisited && !force) {
        return { success: true, message: 'Already tracked' };
    }

    try {
        try {
            const { error: rpcError } = await supabase.rpc('increment_visitor_count');
            if (rpcError) throw rpcError;
        } catch (err) {
            console.log("RPC increment_visitor_count failed, using legacy fallback", err);
        }

        /* Optional: Log daily visit for trend analysis (requires daily_stats table)
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const { data: existingDay, error: fetchError } = await supabase
            .from('daily_stats')
            .select('count')
            .eq('date', today)
            .maybeSingle();

        if (!fetchError && existingDay) {
            await supabase
                .from('daily_stats')
                .update({ count: (existingDay.count || 0) + 1 })
                .eq('date', today);
        } else if (!fetchError) {
            await supabase
                .from('daily_stats')
                .insert([{ date: today, count: 1 }]);
        }
        */

        sessionStorage.setItem(sessionKey, 'true');
        return { success: true };
    } catch (err: any) {
        console.error('Visitor tracking error:', err);
        // Silently fail for users to not break UX, but log to console
        return { success: false, error: err.message || 'Unknown error' };
    }
};

/**
 * System Audit Logging Utility
 */
export const logActivity = async (action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'SYNC', section: string, details: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('audit_logs').insert({
            action,
            section,
            details,
            performed_by: user?.email || 'System/Guest',
            created_at: new Date().toISOString()
        });

        if (error) console.error("Audit log failed:", error);
    } catch (error) {
        console.error("Audit log error:", error);
    }
};
