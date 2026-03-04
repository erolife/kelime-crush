-- Profiles tablosuna sınırsız enerji süresini tutacak sütun ekle
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unlimited_energy_until TIMESTAMPTZ;

-- RLS politikalarını güncellemeye gerek yok, profiles zaten mevcut izinlere sahip.
