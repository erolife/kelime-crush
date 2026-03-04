// Supabase Edge Function: create-checkout-session
// Stripe Checkout Session oluşturur ve URL döner
//
// Gerekli Supabase Secrets:
//   STRIPE_SECRET_KEY - Stripe secret key (sk_test_xxx veya sk_live_xxx)
//
// Kullanıcı metadata'daki productID ile Stripe ürünlerini eşleştiriyoruz.
// Her ürünün hem USD hem TRY fiyatı var — dil parametresine göre uygun price seçilir.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================================
// ÜRÜN HARİTASI — Stripe Price ID'leri buraya yazılacak
// Her ürün için USD ve TRY price_id'si gerekli
// Stripe Dashboard > Products > Price ID (price_xxx...)
// ============================================================
const PRICE_MAP: Record<string, { usd: string; 'try': string; coins?: number; type: string }> = {
    // Altın Paketleri
    gold_starter: { usd: 'price_1T7AOT9oagd8LiyhjWFrP8q4', 'try': 'price_1T7AOT9oagd8LiyhKiDh9Bm7', coins: 500, type: 'coins' },
    gold_popular: { usd: 'price_1T7ARD9oagd8LiyhkqCkCfoh', 'try': 'price_1T7ARD9oagd8Liyh3Ah6LRUS', coins: 1200, type: 'coins' },
    gold_super: { usd: 'price_1T7AS09oagd8Liyh96OzKnD3', 'try': 'price_1T7ASb9oagd8Liyha3hGoThe', coins: 3000, type: 'coins' },
    gold_mega: { usd: 'price_1T7AVf9oagd8LiyhdIz11ZmL', 'try': 'price_1T7AVf9oagd8Liyh8L0Ak6Jg', coins: 7500, type: 'coins' },
    gold_legendary: { usd: 'price_1T7AXk9oagd8LiyhjzEKe3My', 'try': 'price_1T7AYH9oagd8LiyhbaXI4mt5', coins: 20000, type: 'coins' },

    // Enerji
    energy_24h: { usd: 'price_1T7C1X9oagd8LiyhnkDyLnco', 'try': 'price_1T7C219oagd8LiyhyykWLGle', type: 'energy' },

    // PRO Abonelik
    pro_monthly: { usd: 'price_1T7AaY9oagd8LiyhyBF51kPT', 'try': 'price_1T7Aay9oagd8Liyh7rUAUGea', type: 'pro' },
    pro_yearly: { usd: 'price_1T7AbX9oagd8LiyhuatkJIPR', 'try': 'price_1T7Ac89oagd8LiyhGIM0EhJn', type: 'pro' },
}

serve(async (req) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
        if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured')

        const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })

        // Auth kontrolü
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const { productId, productType, mode, language = 'tr', mobile_redirect = false } = await req.json()

        // Ürün doğrulama
        const product = PRICE_MAP[productId]
        if (!product) {
            return new Response(JSON.stringify({ error: `Unknown product: ${productId}` }), {
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // Dil -> para birimi -> Price ID
        const currency = language === 'tr' ? 'try' : 'usd'
        const priceId = product[currency] || product.usd

        // Stripe Customer kontrolü (varsa kullan, yoksa oluştur)
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('stripe_customer_id, first_purchase_used')
            .eq('id', user.id)
            .single()

        let customerId = profile?.stripe_customer_id

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { supabase_user_id: user.id }
            })
            customerId = customer.id

            // Profilde Stripe customer ID'yi kaydet
            await supabaseAdmin
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id)
        }

        // success/cancel URL — mobil ise Deep Link kullan
        const webBase = req.headers.get('origin') || 'https://play.wordlenge.com'
        const successUrl = mobile_redirect
            ? `wordlenge://payment?status=success&product=${productId}`
            : `${webBase}/?payment=success&product=${productId}`
        const cancelUrl = mobile_redirect
            ? `wordlenge://payment?status=cancelled`
            : `${webBase}/?payment=cancelled`

        // Checkout Session ayarları
        const sessionConfig = {
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: mode === 'subscription' ? 'subscription' : 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                supabase_user_id: user.id,
                product_id: productId,
                product_type: productType || product.type,
                coins: product.coins?.toString() || '0',
                is_first_purchase: (!profile?.first_purchase_used).toString(),
            },
        }

        const session = await stripe.checkout.sessions.create(sessionConfig)

        return new Response(
            JSON.stringify({ url: session.url, sessionId: session.id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (err) {
        console.error('Checkout error:', err)
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
