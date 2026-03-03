-- Etkinlik Tablosu Güncelleme (Migration)
-- Tarih: 2026-03-03

-- 1. Title ve Description alanlarını JSONB tipine dönüştürme (Çok dilli destek için)
-- Not: Eğer tabloda veri varsa, eski string veriler JSON formatına {"tr": "eski_ad", "en": "eski_ad"} olarak dönüştürülür.
ALTER TABLE public.events 
ALTER COLUMN title TYPE JSONB USING jsonb_build_object('tr', title, 'en', title);

ALTER TABLE public.events 
ALTER COLUMN description TYPE JSONB USING jsonb_build_object('tr', COALESCE(description, ''), 'en', COALESCE(description, ''));

-- 2. Periyodik etkinlik konfigürasyonu için yeni sütun
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS periodic_config JSONB DEFAULT '{}'::jsonb;

-- 3. Ödül yapısını daha esnek hale getirmek için (opsiyonel ama iyi olur)
-- Mevcut rewards JSONB olduğu için yapı değişikliği kod tarafında yönetilebilir.

COMMENT ON COLUMN public.events.periodic_config IS '{"start_day": 0-6, "end_day": 0-6, "start_time": "HH:mm", "end_time": "HH:mm"}';
