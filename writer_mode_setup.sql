-- 13. YAZAR MODU (STORY) SİSTEMİ (v14.0.0)
-- Bu scripti Supabase SQL Editor üzerinden çalıştırın.

-- Stories Tablosu
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT, -- Hikaye anındaki kullanıcı adı
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    theme TEXT NOT NULL,
    words TEXT[] NOT NULL,
    length TEXT CHECK (length IN ('short', 'long')),
    emoji TEXT,
    hashtag TEXT,
    likes_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Likes Tablosu
CREATE TABLE IF NOT EXISTS public.story_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(story_id, user_id)
);

-- RLS Aktif Etme
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;

-- RLS Politikaları
DROP POLICY IF EXISTS "Hikayeler herkes tarafından okunabilir" ON public.stories;
CREATE POLICY "Hikayeler herkes tarafından okunabilir" ON public.stories FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Kullanıcılar kendi hikayelerini görebilir" ON public.stories;
CREATE POLICY "Kullanıcılar kendi hikayelerini görebilir" ON public.stories FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Herkes beğenileri görebilir" ON public.story_likes;
CREATE POLICY "Herkes beğenileri görebilir" ON public.story_likes FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Kullanıcılar beğeni ekleyebilir" ON public.story_likes;
CREATE POLICY "Kullanıcılar beğeni ekleyebilir" ON public.story_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Kullanıcılar beğenilerini geri çekebilir" ON public.story_likes;
CREATE POLICY "Kullanıcılar beğenilerini geri çekebilir" ON public.story_likes FOR DELETE USING (auth.uid() = user_id);

-- Beğeni Sayısı Güncelleme Fonksiyonu ve Tetikleyicisi
CREATE OR REPLACE FUNCTION public.handle_story_like() 
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.stories SET likes_count = likes_count + 1 WHERE id = NEW.story_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.stories SET likes_count = likes_count - 1 WHERE id = OLD.story_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_story_like ON public.story_likes;
CREATE TRIGGER on_story_like
AFTER INSERT OR DELETE ON public.story_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_story_like();

-- 14. GÜVENLİ PROFİL GÜNCELLEME (RPC)
-- Hikaye üretimi sırasında altın düşümü ve diğer profil güncellemeleri için gereklidir.
CREATE OR REPLACE FUNCTION public.update_profile_secure(p_user_id UUID, p_updates JSONB)
RETURNS VOID AS $$
BEGIN
    -- Güvenlik Kontrolü: Sadece kendi profilini veya Edge Function (Service Role) yetkisiyle güncellenebilir
    -- Not: SQL Editor'den çalıştırdığınızda auth.uid() boş olabilir, bu normaldir.
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
        RAISE EXCEPTION 'Yetkisiz erişim.';
    END IF;

    UPDATE public.profiles
    SET 
        username = COALESCE((p_updates->>'username'), username),
        avatar_url = COALESCE((p_updates->>'avatar_url'), avatar_url),
        coins = COALESCE((p_updates->'coins')::INTEGER, coins),
        xp = COALESCE((p_updates->'xp')::BIGINT, xp),
        level = COALESCE((p_updates->'level')::INTEGER, level),
        tools = COALESCE((p_updates->'tools'), tools),
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bilgi Notu: Stories INSERT işlemi Edge Function üzerinden (Service Role ile) yapılacaktır.
-- Bu yüzden public INSERT yetkisi verilmemiştir.
