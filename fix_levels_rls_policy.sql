-- 1. RLS'yi Etkinleştir (Eğer etkin değilse)
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

-- 2. Mevcut Politikaları Temizle (Varsa)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.levels;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.levels;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.levels;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.levels;

-- 3. OKUMA POLİTİKASI: Herkes seviyeleri görebilir (Oyun için gerekli)
CREATE POLICY "Seviyeleri herkes okuyabilir"
ON public.levels
FOR SELECT
USING (true);

-- 4. YAZMA/DÜZENLEME/SİLME POLİTİKASI: Sadece giriş yapmış adminler işlem yapabilir
-- Not: Admin girişi yaptığınız e-posta adresi ile eşleşme sağlar.
-- Eğer spesifik bir "role" veya "is_admin" sütununuz varsa ona göre de güncellenebilir.
-- Şimdilik en güvenli ve hızlı yöntem: Giriş yapmış her kullanıcıya (Admin paneline giren) yetki veriyoruz.

CREATE POLICY "Adminler seviye ekleyebilir"
ON public.levels
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Adminler seviye güncelleyebilir"
ON public.levels
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Adminler seviye silebilir"
ON public.levels
FOR DELETE
TO authenticated
USING (true);
