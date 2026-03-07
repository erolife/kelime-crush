-- WORDLENGE Veritabanı Şeması (PostgreSQL / Supabase Uyumluluğu)
-- Son Güncelleme: 2026-02-27

-- 1. PROFILES Tablosu (Kullanıcı verileri ve ilerleme)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    coins INTEGER DEFAULT 500,
    current_level_index INTEGER DEFAULT 0,
    streak_count INTEGER DEFAULT 0,
    last_gift_time TIMESTAMPTZ,
    tools JSONB DEFAULT '{"bomb": 1, "swap": 2, "row": 1, "col": 1, "cell": 3}'::jsonb,
    total_score BIGINT DEFAULT 0,
    words_found_count INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    high_score INTEGER DEFAULT 0,
    avatar_id TEXT DEFAULT 'default',
    avatar_url TEXT,
    gender TEXT,
    age INTEGER,
    location TEXT,
    bio TEXT,
    best_score_adventure BIGINT DEFAULT 0,
    best_score_time_arena BIGINT DEFAULT 0,
    best_score_zen BIGINT DEFAULT 0,
    mode_stats JSONB DEFAULT '{"zen": {"words": 0, "moves": 0, "duration": 0, "game_count": 0}, "arcade": {"words": 0, "moves": 0, "duration": 0, "game_count": 0}, "mission": {"words": 0, "moves": 0, "duration": 0, "game_count": 0}}'::jsonb,
    crush_last_spin TEXT,
    xp BIGINT DEFAULT 0,
    level INTEGER DEFAULT 1,
    mastery_points INTEGER DEFAULT 0,
    perks_json JSONB DEFAULT '{}'::jsonb,
    unlimited_energy_until TIMESTAMPTZ, -- v9.1.5 (24s Sınırsız Enerji Desteği)
    daily_missions JSONB DEFAULT '{"date": "", "tasks": []}'::jsonb, -- v11.0.0 (Günlük Görev Sistemi)
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles tablosu için RLS (Row Level Security) ayarları
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi profillerini görebilir" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. LEVELS Tablosu (Dinamik seviye ve görev yönetimi)
CREATE TABLE IF NOT EXISTS public.levels (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT DEFAULT 'normal' CHECK (difficulty IN ('easy', 'normal', 'hard')),
    moves INTEGER NOT NULL,
    time_limit INTEGER, -- Opsiyonel zaman sınırı (saniye)
    goals JSONB NOT NULL, -- Görev listesi: [{"type": "wordCount", "count": 5}, ...]
    rewards JSONB NOT NULL, -- Ödüller: {"coins": 100, "tools": {"bomb": 1}}
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Levels tablosu herkes tarafından okunabilir (SELECT) ancak sadece admin tarafından değiştirilebilir
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seviyeler herkes tarafından okunabilir" 
ON public.levels FOR SELECT USING (TRUE);

-- 3. Örnek Veri Girişi (İlk 3 Seviye)
INSERT INTO public.levels (title, description, difficulty, moves, goals, rewards)
VALUES 
('Acemi Avcı', 'Kelime avcılığına küçük adımlarla başla.', 'easy', 12, 
 '[{"type": "wordLength", "value": 4, "count": 2, "text": "4 Harfli 2 Kelime"}]'::jsonb, 
 '{"coins": 100, "tools": {"bomb": 1}}'::jsonb),

('Hızlı Düşünür', 'Biraz daha uzun kelimelere odaklanalım.', 'easy', 15, 
 '[{"type": "wordLength", "value": 5, "count": 1, "text": "5 Harfli 1 Kelime"}, {"type": "score", "value": 200, "text": "200 Puan Topla"}]'::jsonb, 
 '{"coins": 100, "tools": {"swap": 1}}'::jsonb),

('Bomba Uzmanı', 'Patlayıcıları kullanma vakti.', 'normal', 20, 
 '[{"type": "useTool", "value": "bomb", "count": 1, "text": "1 Bomba Patlat"}, {"type": "wordCount", "count": 5, "text": "Toplam 5 Kelime Bul"}]'::jsonb, 
 '{"coins": 250, "tools": {"bomb": 1, "cell": 1}}'::jsonb);

-- 4. OTMOTİK PROFİL OLUŞTURMA (DATABASE TRIGGER)
-- Bu fonksiyon her yeni auth.users kaydında otomatik çalışır.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, coins, tools, mode_stats)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1)), 
    500, 
    '{"bomb": 1, "swap": 2, "row": 1, "col": 1, "cell": 3}'::jsonb,
    '{"zen": {"words": 0, "moves": 0, "duration": 0, "game_count": 0}, "arcade": {"words": 0, "moves": 0, "duration": 0, "game_count": 0}, "mission": {"words": 0, "moves": 0, "duration": 0, "game_count": 0}}'::jsonb
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı bağla
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. LİDERLİK TABLOSU VE DİL DESTEĞİ GÜNCELLEMELERİ
-- Profillere dil tercihi sütunu ekle (Eğer yoksa)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'tr';

-- Liderlik Tablosu View'ı (Seviye ve Altın puanına göre sıralı)
DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard AS
SELECT id, username, avatar_url, coins, level, xp, total_score, high_score, updated_at
FROM public.profiles
ORDER BY level DESC, xp DESC, coins DESC
LIMIT 100;

-- Mod Bazlı Liderlik Tabloları
CREATE OR REPLACE VIEW public.leaderboard_adventure AS
SELECT id, username, avatar_url, best_score_adventure as score, updated_at
FROM public.profiles
WHERE best_score_adventure > 0
ORDER BY best_score_adventure DESC
LIMIT 100;

CREATE OR REPLACE VIEW public.leaderboard_time_arena AS
SELECT id, username, avatar_url, best_score_time_arena as score, updated_at
FROM public.profiles
WHERE best_score_time_arena > 0
ORDER BY best_score_time_arena DESC
LIMIT 100;

-- Sadece SELECT yetkisi veriyoruz (anon ve authenticated rolleri için)
-- 6. ETKİNLİK SİSTEMİ (Phase 7 - v7.0.0)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'manual' CHECK (type IN ('periodic', 'manual')),
    allowed_modes JSONB DEFAULT '["arcade", "timeBattle"]'::jsonb,
    target_score INTEGER,
    duration_limit INTEGER,
    moves_limit INTEGER,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    rewards JSONB DEFAULT '[]'::jsonb,
    is_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_at > start_at)
);

CREATE TABLE IF NOT EXISTS public.event_participants (
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (event_id, user_id)
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Etkinlikler herkes tarafından okunabilir" ON public.events FOR SELECT USING (TRUE);
CREATE POLICY "Katılımcılar kendi skorlarını görebilir" ON public.event_participants FOR SELECT USING (TRUE);
CREATE POLICY "Kullanıcılar kendi skorlarını güncelleyebilir" ON public.event_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Kullanıcılar kendi skorlarını yükseltebilir" ON public.event_participants FOR UPDATE USING (auth.uid() = user_id);

-- 7. FONKSİYONLAR (Etkinlik Skoru Güncelleme)
CREATE OR REPLACE FUNCTION public.update_event_score(p_event_id UUID, p_user_id UUID, p_score_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.event_participants (event_id, user_id, score)
    VALUES (p_event_id, p_user_id, p_score_to_add)
    ON CONFLICT (event_id, user_id)
    DO UPDATE SET 
        score = public.event_participants.score + p_score_to_add,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. STORAGE (Dosya Yükleme) AYARLARI
-- 'game-assets' adında bir bucket oluştur (Bunu Supabase dasboard üzerinden de yapabilirsiniz, SQL ile karşılığı)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('game-assets', 'game-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage için okuma (SELECT) izni (Herkes görebilir)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'game-assets' );

-- Storage için yazma/yükleme (INSERT) izni (Sadece giriş yapmış kullanıcılar)
CREATE POLICY "Auth Users Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( auth.role() = 'authenticated' AND bucket_id = 'game-assets' );

-- Storage güncellemeleri (UPDATE) 
CREATE POLICY "Auth Users Update"
ON storage.objects FOR UPDATE
USING ( auth.role() = 'authenticated' AND bucket_id = 'game-assets' );

-- Storage silme işlemleri (DELETE)
CREATE POLICY "Auth Users Delete"
ON storage.objects FOR DELETE
USING ( auth.role() = 'authenticated' AND bucket_id = 'game-assets' );

-- 9. MONETİZASYON TABLOLARI (Phase 9 - v9.0.0)

-- Profiles tablosuna monetizasyon sütunları
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_purchase_used BOOLEAN DEFAULT FALSE;

-- Satın Alma Geçmişi
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    product_type TEXT CHECK (product_type IN ('coins', 'energy', 'pro', 'bundle')),
    product_id TEXT,
    amount_coins INTEGER DEFAULT 0,
    amount_tools JSONB DEFAULT '{}'::jsonb,
    amount_paid DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Abonelik Durumu
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

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchases_select_own" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 10. GÜVENLİK VE ANTI-CHEAT (v1.0.2 - 07.03.2026)
-- İstemci tarafındaki saat hilesini engellemek için rpc('update_profile_secure') 
-- fonksiyonuna crush_last_spin tarih kontrolü eklenmesi önerilir.
-- Bu mantık, yeni gelen spin tarihinin mevcut tarihten veya son spin + 24 saatten 
-- küçük olmamasını sağlar.


