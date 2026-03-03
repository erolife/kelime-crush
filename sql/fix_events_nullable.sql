-- Events Tablosu Kısıtlamalarını Esnetme
-- Periyodik etkinliklerde start_at ve end_at manuel olarak girilmediği için bu alanları nullable yapıyoruz.

ALTER TABLE public.events ALTER COLUMN start_at DROP NOT NULL;
ALTER TABLE public.events ALTER COLUMN end_at DROP NOT NULL;

-- Bilgi: Periyodik etkinliklerin tespiti periodic_config üzerinden yapılacaktır.
