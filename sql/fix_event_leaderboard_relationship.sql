-- event_participants tablosundaki user_id referansını profiles tablosuna yönlendiriyoruz.
-- Bu işlem PostgREST join işlemlerinin (liderlik tablosu çekimi) sorunsuz çalışmasını sağlar.

-- Önce varsa mevcut kısıtlamayı kaldırıyoruz (Kısıtlama ismi değişkenlik gösterebilir, user_id kolonunu direkt güncelleyelim)
ALTER TABLE public.event_participants 
DROP CONSTRAINT IF EXISTS event_participants_user_id_fkey;

ALTER TABLE public.event_participants
ADD CONSTRAINT event_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
