import { supabase } from './supabaseClient';
import { Capacitor } from '@capacitor/core';

// Capacitor Browser — Lazy import (sadece native ortamda yüklenir)
let BrowserPlugin = null;
const getBrowser = async () => {
    if (!BrowserPlugin && Capacitor.isNativePlatform()) {
        const mod = await import('@capacitor/browser');
        BrowserPlugin = mod.Browser;
    }
    return BrowserPlugin;
};

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
    async createCheckoutSession(userId, productId, productType = 'coins', language = 'tr') {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            console.log('PaymentService: Creating session...', {
                userId,
                productId,
                hasSession: !!session,
                userEmail: session?.user?.email,
                expiresAt: session?.expires_at
            });

            const isMobile = Capacitor.isNativePlatform();
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`
                },
                body: {
                    userId,
                    productId,
                    productType,
                    language,
                    mode: 'payment',
                    mobile_redirect: isMobile,
                }
            });

            if (error) {
                // Edge Function hata döndürdüyse detayları yakala
                let errorMsg = error.message;
                try {
                    // FunctionsHttpError ise body'yi oku
                    if (error.context && typeof error.context.json === 'function') {
                        const body = await error.context.json();
                        if (body && body.error) errorMsg = body.error;
                        if (body && body.details) console.error('Edge Function Details:', body.details);
                    }
                } catch (e) {
                    console.error('Error parsing function error body:', e);
                }
                throw new Error(errorMsg);
            }

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
    async createSubscriptionSession(userId, planId, language = 'tr') {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const isMobile = Capacitor.isNativePlatform();
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`
                },
                body: {
                    userId,
                    productId: planId,
                    productType: 'pro',
                    language,
                    mode: 'subscription',
                    mobile_redirect: isMobile,
                }
            });

            if (error) {
                // Edge Function hata döndürdüyse detayları yakala
                let errorMsg = error.message;
                try {
                    if (error.context && typeof error.context.json === 'function') {
                        const body = await error.context.json();
                        if (body && body.error) errorMsg = body.error;
                        if (body && body.details) console.error('Edge Function Details:', body.details);
                    }
                } catch (e) {
                    console.error('Error parsing function error body:', e);
                }
                throw new Error(errorMsg);
            }

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
     * Ödeme URL'sini aç (Capacitor In-App Browser veya Web)
     * Mobilde: In-App Browser açılır, ödeme sonrası Deep Link ile uygulamaya dönülür
     * Web'de: Yeni sekmede açılır
     * @param {string} url - Stripe Checkout URL
     */
    async openCheckoutUrl(url) {
        if (!url) return;

        const browser = await getBrowser();
        if (browser) {
            // Mobil: In-App Browser aç
            await browser.open({ url, windowName: '_blank' });
        } else {
            // Web: Yeni sekmede aç
            window.open(url, '_blank');
        }
    },

    /**
     * In-App Browser'ı kapat (Ödeme sonrası)
     */
    async closeCheckout() {
        const browser = await getBrowser();
        if (browser) {
            await browser.close();
        }
    }
};
