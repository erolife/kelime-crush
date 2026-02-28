-- profiles tablosuna istatistik sütunlarının eklenmesi (v4.2.0)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_score BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS words_found_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS games_played INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS high_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar_id TEXT DEFAULT 'default';

-- İstatistiklerin negatif olmamasını garanti altına al (Opsiyonel)
ALTER TABLE public.profiles
ADD CONSTRAINT stats_positive_check 
CHECK (total_score >= 0 AND words_found_count >= 0 AND games_played >= 0 AND high_score >= 0);

-- Liderlik tablosu view'ını yüksek skorlu kullanıcıları da içerecek şekilde güncelle
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
