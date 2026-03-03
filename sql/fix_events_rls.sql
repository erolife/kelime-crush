-- Events Tablosu RLS (Row Level Security) Yetki Düzeltmesi
-- Bu script, admin panelinden etkinlik eklenememesi (RLS hatası) sorununu çözer.

-- 1. Ekleme Yetkisi (INSERT)
-- Sadece giriş yapmış (authenticated) kullanıcıların etkinlik eklemesine izin ver.
-- Not: Daha güvenli bir yapı için auth.email() = 'admin@email.com' gibi bir kontrol de eklenebilir.
DROP POLICY IF EXISTS "Adminler etkinlik ekleyebilir" ON public.events;
CREATE POLICY "Adminler etkinlik ekleyebilir" 
ON public.events 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 2. Güncelleme Yetkisi (UPDATE)
DROP POLICY IF EXISTS "Adminler etkinlik güncelleyebilir" ON public.events;
CREATE POLICY "Adminler etkinlik güncelleyebilir" 
ON public.events 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 3. Silme Yetkisi (DELETE)
DROP POLICY IF EXISTS "Adminler etkinlik silebilir" ON public.events;
CREATE POLICY "Adminler etkinlik silebilir" 
ON public.events 
FOR DELETE 
TO authenticated 
USING (true);

-- 4. Okuma Yetkisi (SELECT) - Zaten proje_schema.sql içinde vardı ama emin olmak için:
DROP POLICY IF EXISTS "Etkinlikler herkes tarafından okunabilir" ON public.events;
CREATE POLICY "Etkinlikler herkes tarafından okunabilir" 
ON public.events 
FOR SELECT 
USING (true);

-- Bilgi: event_participants tablosu için gerekli izinler proje_schema.sql içinde zaten tanımlanmıştı.
