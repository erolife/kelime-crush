-- WORDLENGE Monetizasyon Tabloları (Stripe-Only)
-- Son Güncelleme: 2026-03-04

-- 1. Satın Alma Geçmişi (Purchases)
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    product_type TEXT CHECK (product_type IN ('coins', 'energy', 'pro', 'bundle')),
    product_id TEXT, -- Paket ID (örn: 'gold_starter', 'gold_popular', 'pro_monthly')
    amount_coins INTEGER DEFAULT 0,
    amount_tools JSONB DEFAULT '{}'::jsonb, -- Paket araç ödülleri: {"bomb": 5, "swap": 3}
    amount_paid DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Abonelik Durumu (Subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro_monthly', 'pro_yearly')),
    status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'past_due', 'canceled')),
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Stripe Müşteri Eşleştirmesi
-- profiles tablosuna stripe_customer_id eklenmesi
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_purchase_used BOOLEAN DEFAULT FALSE;

-- RLS Ayarları
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi satın alma geçmişlerini görebilir
CREATE POLICY "purchases_select_own" 
ON public.purchases FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar kendi abonelik bilgilerini görebilir
CREATE POLICY "subscriptions_select_own" 
ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Service Role (Webhook) ile INSERT/UPDATE yapılacağı için
-- kullanıcıların doğrudan yazma yetkisi verilmiyor.
-- Supabase Edge Function, service_role key ile çalışacak.
