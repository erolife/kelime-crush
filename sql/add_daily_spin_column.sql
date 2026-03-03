-- Profiles tablosuna günlük çark takibi için sütun ekleme
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS crush_last_spin TEXT;

-- RLS politikalarının güncelliğinden emin olalım (Genelde zaten açıktır ama garanti olsun)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
