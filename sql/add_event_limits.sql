-- public.events tablosuna yeni sütunlar ekleme işlemi
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS target_score INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS duration_limit INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS moves_limit INTEGER;

-- RPC Fonksiyonunda Güncelleme:
-- Eğer bir kullanıcı ilk defa etkileşime girerse ve score 0 ise tabloya yine de eklenmesini sağlayalım.
CREATE OR REPLACE FUNCTION public.update_event_score(p_event_id UUID, p_user_id UUID, p_score_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.event_participants (event_id, user_id, score)
    VALUES (p_event_id, p_user_id, p_score_to_add)
    ON CONFLICT (event_id, user_id)
    DO UPDATE SET 
        score = GREATEST(public.event_participants.score, public.event_participants.score + p_score_to_add),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
