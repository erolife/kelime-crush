import { supabase } from './supabaseClient';

/**
 * PaymentService — Stripe Checkout oturum yönetimi
 * Supabase Edge Function üzerinden Stripe Checkout Session oluşturur
 */
export const PaymentService = {

    /**
     * Stripe Checkout Session oluştur (Altın Paketi veya Enerji)
     * @param {string} userId      - Supabase Auth user ID
     * @param {string} productId   - Ürün ID (gold_starter, gold_popular vb.)
     * @param {string} productType - 'coins' | 'energy' | 'bundle'
     * @returns {Promise<{url: string|null, error: string|null}>}
     */
    async createCheckoutSession(userId, productId, productType = 'coins') {
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    userId,
                    productId,
                    productType,
                    mode: 'payment', // one-time payment
                }
            });

            if (error) throw error;
            return { url: data?.url, error: null };
        } catch (err) {
            console.error('Checkout session error:', err);
            return { url: null, error: err.message || 'Payment error' };
        }
    },

    /**
     * Stripe Subscription Checkout Session oluştur (PRO Abonelik)
     * @param {string} userId - Supabase Auth user ID
     * @param {string} planId - Plan ID (pro_monthly, pro_yearly)
     * @returns {Promise<{url: string|null, error: string|null}>}
     */
    async createSubscriptionSession(userId, planId) {
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    userId,
                    productId: planId,
                    productType: 'pro',
                    mode: 'subscription',
                }
            });

            if (error) throw error;
            return { url: data?.url, error: null };
        } catch (err) {
            console.error('Subscription session error:', err);
            return { url: null, error: err.message || 'Subscription error' };
        }
    },

    /**
     * Kullanıcının PRO abonelik durumunu kontrol et
     * @param {string} userId - Supabase Auth user ID
     * @returns {Promise<{isPro: boolean, plan: string, expiresAt: string|null}>}
     */
    async getSubscriptionStatus(userId) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('plan, status, current_period_end')
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

            if (error || !data) {
                return { isPro: false, plan: 'free', expiresAt: null };
            }

            return {
                isPro: data.plan !== 'free' && data.status === 'active',
                plan: data.plan,
                expiresAt: data.current_period_end,
            };
        } catch (err) {
            console.error('Subscription status error:', err);
            return { isPro: false, plan: 'free', expiresAt: null };
        }
    },

    /**
     * Satın alma geçmişini getir
     * @param {string} userId - Supabase Auth user ID
     * @returns {Promise<Array>}
     */
    async getPurchaseHistory(userId) {
        try {
            const { data, error } = await supabase
                .from('purchases')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'completed')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Purchase history error:', err);
            return [];
        }
    },

    /**
     * Ödeme URL'sini aç (Capacitor/Browser)
     * @param {string} url - Stripe Checkout URL
     */
    openCheckoutUrl(url) {
        if (!url) return;
        // Capacitor ortamında InAppBrowser kullanılabilir
        // Şimdilik standart window.open
        window.open(url, '_blank');
    }
};
