-- 1. Mevcut verileri yedekle veya temizle (Geliştirme aşamasında olduğumuz için temizleyip yeniden ekleyebiliriz)
-- TR/EN Destekli Seviye Yapısına Geçiş

-- Önemli: title ve description sütunlarını JSONB yap. 
-- goals içindeki text alanlarını da JSONB nesnesine çevirmeyi unutma.

-- Mevcut tabloyu güncelle (Eğer üzerinde veri varsa tipi değiştirmek cast gerektirir)
ALTER TABLE public.levels 
  ALTER COLUMN title TYPE JSONB USING jsonb_build_object('tr', title, 'en', title),
  ALTER COLUMN description TYPE JSONB USING jsonb_build_object('tr', description, 'en', description);

-- Örnek Veri (Çok Dilli):
TRUNCATE public.levels RESTART IDENTITY;

INSERT INTO public.levels (title, description, difficulty, moves, goals, rewards)
VALUES 
(
  '{"tr": "Acemi Avcı", "en": "Novice Hunter"}'::jsonb, 
  '{"tr": "Kelime avcılığına küçük adımlarla başla.", "en": "Start word hunting with small steps."}'::jsonb, 
  'easy', 12, 
  '[{"type": "wordLength", "value": 4, "count": 2, "text": {"tr": "4 Harfli 2 Kelime", "en": "2 words with 4 letters"}}]'::jsonb, 
  '{"coins": 100, "tools": {"bomb": 1}}'::jsonb
),
(
  '{"tr": "Hızlı Düşünür", "en": "Fast Thinker"}'::jsonb, 
  '{"tr": "Biraz daha uzun kelimelere odaklanalım.", "en": "Let''s focus on longer words."}'::jsonb, 
  'easy', 15, 
  '[{"type": "wordLength", "value": 5, "count": 1, "text": {"tr": "5 Harfli 1 Kelime", "en": "1 word with 5 letters"}}, {"type": "score", "value": 200, "text": {"tr": "200 Puan Topla", "en": "Score 200 Points"}}]'::jsonb, 
  '{"coins": 100, "tools": {"swap": 1}}'::jsonb
),
(
  '{"tr": "Bomba Uzmanı", "en": "Bomb Expert"}'::jsonb, 
  '{"tr": "Patlayıcıları kullanma vakti.", "en": "Time to use explosives."}'::jsonb, 
  'normal', 20, 
  '[{"type": "useTool", "value": "bomb", "count": 1, "text": {"tr": "1 Bomba Patlat", "en": "Explode 1 Bomb"}}, {"type": "wordCount", "count": 5, "text": {"tr": "Toplam 5 Kelime Bul", "en": "Find 5 Words Total"}}]'::jsonb, 
  '{"coins": 250, "tools": {"bomb": 1, "cell": 1}}'::jsonb
);
