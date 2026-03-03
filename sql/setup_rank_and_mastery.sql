-- Rank & Mastery Sistemi Veritabanı Altyapısı
-- Bu betik, kullanıcı profillerine tecrübe puanı, seviye ve yetenek takibi için gerekli alanları ekler.

-- 1. Profiles tablosuna yeni sütunların eklenmesi
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS mastery_points INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS perks_json JSONB DEFAULT '{}'::jsonb;

-- 2. Mevcut verilerin (varsa) kontrolü ve indexleme (Performans için)
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level DESC);

-- Not: RLS politikaları mevcut olduğu için ekstra bir işlem gerekmemektedir. 
-- perks_json alanı oyuncunun seçtiği pasif yetenekleri (örn: {"gold_bonus_level": 2, "energy_cap_bonus": 1}) saklayacaktır.
