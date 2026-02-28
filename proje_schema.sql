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
    mode_stats JSONB DEFAULT '{"zen": {"words": 0, "moves": 0, "duration": 0, "game_count": 0}, "arcade": {"words": 0, "moves": 0, "duration": 0, "game_count": 0}, "mission": {"words": 0, "moves": 0, "duration": 0, "game_count": 0}}'::jsonb,
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
-- Not: View'lar varsayılan olarak owner (postgres) yetkisiyle çalışır ve RLS'i baypas eder.
-- Bu sayede profiles tablosu gizli kalsa bile bu view üzerinden sıralama görünebilir.
DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard AS
SELECT 
    id,
    username,
    coins,
    current_level_index,
    total_score,
    high_score,
    updated_at
FROM 
    public.profiles
ORDER BY 
    current_level_index DESC, 
    high_score DESC,
    coins DESC
LIMIT 100;

-- Sadece SELECT yetkisi veriyoruz (anon ve authenticated rolleri için)
GRANT SELECT ON public.leaderboard TO anon, authenticated;
