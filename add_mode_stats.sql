-- profiles tablosuna mod bazlı istatistiklerin tutulacağı sütunu ekle
-- Yapısı: {"zen": {"words": 0, "moves": 0, "duration": 0, "games": 0}, "arcade": {...}, "mission": {...}}
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mode_stats JSONB DEFAULT '{}'::jsonb;

-- Mevcut leaderboard view'ını güncelleyelim (İsteğe bağlı, istatistikler eklenebilir)
-- Ancak şimdilik sadece sütunu eklemek yeterli.

-- Eğer trigger fonksiyonunu da güncellemek isterseniz (yeni kullanıcılar için varsayılan değer):
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, coins, tools, mode_stats)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1)), 
    500, 
    '{"bomb": 1, "swap": 2, "row": 1, "col": 1, "cell": 3}'::jsonb,
    '{"zen": {"words": 0, "moves": 0, "duration": 0, "games": 0}, "arcade": {"words": 0, "moves": 0, "duration": 0, "games": 0}, "mission": {"words": 0, "moves": 0, "duration": 0, "games": 0}}'::jsonb
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
