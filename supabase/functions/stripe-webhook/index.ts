// Supabase Edge Function: stripe-webhook
// Stripe Checkout/Subscription webhook olaylarını dinler ve DB'yi günceller
//
// Gerekli Supabase Secrets:
//   STRIPE_SECRET_KEY       - Stripe secret key
//   STRIPE_WEBHOOK_SECRET   - Stripe webhook signing secret (whsec_xxx)
//
// Stripe Dashboard > Developers > Webhooks > Add endpoint:
//   URL: https://<project-ref>.supabase.co/functions/v1/stripe-webhook
//   Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2023-10-16' })
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
        return new Response('Missing stripe-signature header', { status: 400 })
    }

    const body = await req.text()
    let event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message)
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log(`Stripe event received: ${event.type}`)

    try {
        switch (event.type) {
            // ==============================
            // TEK SEFERLİK ÖDEME TAMAMLANDI
            // ==============================
            case 'checkout.session.completed': {
                const session = event.data.object
                const metadata = session.metadata || {}
                const userId = metadata.supabase_user_id
                const productId = metadata.product_id
                const productType = metadata.product_type
                const coinsAmount = parseInt(metadata.coins || '0')
                const isFirstPurchase = metadata.is_first_purchase === 'true'

                if (!userId) {
                    console.error('No supabase_user_id in metadata')
                    break
                }

                // Satın almayı kaydet
                await supabaseAdmin.from('purchases').insert({
                    user_id: userId,
                    stripe_session_id: session.id,
                    stripe_payment_intent_id: session.payment_intent,
                    product_type: productType,
                    product_id: productId,
                    amount_coins: coinsAmount,
                    amount_paid: session.amount_total / 100,
                    currency: session.currency?.toUpperCase() || 'USD',
                    status: 'completed',
                })

                // Altın paketi ise → kullanıcıya altın ekle
                if (productType === 'coins' && coinsAmount > 0) {
                    const finalCoins = isFirstPurchase ? coinsAmount * 2 : coinsAmount

                    const { data: profile } = await supabaseAdmin
                        .from('profiles')
                        .select('coins, first_purchase_used')
                        .eq('id', userId)
                        .single()

                    const updateData = {
                        coins: (profile?.coins || 0) + finalCoins,
                    }

                    // İlk alım bonusunu işaretle
                    if (isFirstPurchase && !profile?.first_purchase_used) {
                        updateData.first_purchase_used = true
                    }

                    await supabaseAdmin
                        .from('profiles')
                        .update(updateData)
                        .eq('id', userId)

                    console.log(`Added ${finalCoins} coins to user ${userId} (first purchase: ${isFirstPurchase})`)
                }

                // PRO abonelik checkout tamamlandıysa → subscription event'inde handle edilecek
                if (productType === 'pro' && session.subscription) {
                    // Subscription oluştur veya güncelle
                    await supabaseAdmin.from('subscriptions').upsert({
                        user_id: userId,
                        stripe_subscription_id: session.subscription,
                        stripe_customer_id: session.customer,
                        plan: productId, // 'pro_monthly' veya 'pro_yearly'
                        status: 'active',
                        current_period_end: null, // subscription.updated event'inde güncellenecek
                    }, { onConflict: 'user_id' })

                    // Profilde is_pro'yu aktifle
                    await supabaseAdmin
                        .from('profiles')
                        .update({ is_pro: true })
                        .eq('id', userId)

                    console.log(`PRO subscription activated for user ${userId}`)
                }

                break
            }

            // ==============================
            // ABONELİK GÜNCELLENDİ
            // ==============================
            case 'customer.subscription.updated': {
                const subscription = event.data.object
                const customerId = subscription.customer

                // Customer'dan user_id bul
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', customerId)
                    .single()

                if (!profile) {
                    console.error('No profile found for customer:', customerId)
                    break
                }

                const isActive = ['active', 'trialing'].includes(subscription.status)
                const plan = subscription.items?.data?.[0]?.price?.recurring?.interval === 'year'
                    ? 'pro_yearly' : 'pro_monthly'

                await supabaseAdmin.from('subscriptions').upsert({
                    user_id: profile.id,
                    stripe_subscription_id: subscription.id,
                    stripe_customer_id: customerId,
                    plan: plan,
                    status: isActive ? 'active' : subscription.status,
                    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id' })

                // Profilde is_pro'yu güncelle
                await supabaseAdmin
                    .from('profiles')
                    .update({ is_pro: isActive })
                    .eq('id', profile.id)

                console.log(`Subscription ${subscription.status} for user ${profile.id}`)
                break
            }

            // ==============================
            // ABONELİK İPTAL EDİLDİ
            // ==============================
            case 'customer.subscription.deleted': {
                const subscription = event.data.object
                const customerId = subscription.customer

                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', customerId)
                    .single()

                if (!profile) {
                    console.error('No profile found for customer:', customerId)
                    break
                }

                // Aboneliği iptal et
                await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        status: 'canceled',
                        plan: 'free',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', profile.id)

                // PRO'yu kapat
                await supabaseAdmin
                    .from('profiles')
                    .update({ is_pro: false })
                    .eq('id', profile.id)

                console.log(`Subscription canceled for user ${profile.id}`)
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }
    } catch (err) {
        console.error('Webhook processing error:', err)
        return new Response(`Processing error: ${err.message}`, { status: 500 })
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    })
})
