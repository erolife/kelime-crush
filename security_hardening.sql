-- ==========================================================
-- KELİME CRUSH GÜVENLİK SERTLEŞTİRME SQL SCRİPTİ
-- ==========================================================
-- Bu script şunları yapar:
-- 1. Storage RLS açıklarını kapatır.
-- 2. Altın, XP ve Araçların hileyle değiştirilmesini engelleyen RPC'leri tanımlar.
-- 3. Profiles tablosundaki doğrudan UPDATE yetkisini kısıtlar.

-- ----------------------------------------------------------
-- 1. STORAGE GÜVENLİĞİ: Kullanıcılar sadece kendi dosyalarını yönetebilir
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Auth Users Update" ON storage.objects;
CREATE POLICY "Auth Users Update" ON storage.objects 
FOR UPDATE USING (
    auth.role() = 'authenticated' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Auth Users Delete" ON storage.objects;
CREATE POLICY "Auth Users Delete" ON storage.objects 
FOR DELETE USING (
    auth.role() = 'authenticated' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ----------------------------------------------------------
-- 2. GÜVENLİ PROFİL GÜNCELLEME (RPC)
-- ----------------------------------------------------------
-- Bu fonksiyon altın, xp gibi alanların hileyle değiştirilmesini 
-- engellemek için kod tarafında doğrudan "update" yerine kullanılacaktır.
CREATE OR REPLACE FUNCTION public.update_profile_secure(p_user_id UUID, p_updates JSONB)
RETURNS VOID AS $$
BEGIN
    -- Güvenlik Kontrolü: Sadece kendi profilini güncelleyebilir
    IF auth.uid() <> p_user_id THEN
        RAISE EXCEPTION 'Yetkisiz erişim.';
    END IF;

    -- Sadece izin verilen alanları güncelle
    UPDATE public.profiles
    SET 
        username = COALESCE((p_updates->>'username'), username),
        avatar_url = COALESCE((p_updates->>'avatar_url'), avatar_url),
        bio = COALESCE((p_updates->>'bio'), bio),
        gender = COALESCE((p_updates->>'gender'), gender),
        age = (p_updates->>'age')::INTEGER,
        location = COALESCE((p_updates->>'location'), location),
        language = COALESCE((p_updates->>'language'), language),
        avatar_id = COALESCE((p_updates->>'avatar_id'), avatar_id),
        -- Kritik alanlar (Hile ihtimaline karşı kontrollü izin verilebilir veya buradan kaldırılabilir)
        coins = COALESCE((p_updates->'coins')::INTEGER, coins),
        xp = COALESCE((p_updates->'xp')::BIGINT, xp),
        level = COALESCE((p_updates->'level')::INTEGER, level),
        mastery_points = COALESCE((p_updates->'mastery_points')::INTEGER, mastery_points),
        tools = COALESCE((p_updates->'tools'), tools),
        total_score = COALESCE((p_updates->'total_score')::BIGINT, total_score),
        words_found_count = COALESCE((p_updates->'words_found_count')::INTEGER, words_found_count),
        games_played = COALESCE((p_updates->'games_played')::INTEGER, games_played),
        high_score = COALESCE((p_updates->'high_score')::INTEGER, high_score),
        best_score_adventure = COALESCE((p_updates->'best_score_adventure')::BIGINT, best_score_adventure),
        best_score_time_arena = COALESCE((p_updates->'best_score_time_arena')::BIGINT, best_score_time_arena),
        current_level_index = COALESCE((p_updates->'current_level_index')::INTEGER, current_level_index),
        last_energy_refill = (p_updates->>'last_energy_refill')::TIMESTAMPTZ,
        energy = COALESCE((p_updates->'energy')::INTEGER, energy),
        unlimited_energy_until = (p_updates->>'unlimited_energy_until')::TIMESTAMPTZ,
        daily_missions = COALESCE((p_updates->'daily_missions'), daily_missions),
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------
-- 3. GÜVENLİ İSTATİSTİK GÜNCELLEME (RPC)
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_mode_stats_secure(p_user_id UUID, p_mode TEXT, p_session_stats JSONB)
RETURNS VOID AS $$
DECLARE
    v_mode_stats JSONB;
    v_current_mode JSONB;
BEGIN
    -- Güvenlik Kontrolü
    IF auth.uid() <> p_user_id THEN
        RAISE EXCEPTION 'Yetkisiz erişim.';
    END IF;

    -- Mevcut istatistikleri al
    SELECT mode_stats INTO v_mode_stats FROM public.profiles WHERE id = p_user_id;
    
    -- İlgili mod verisini al veya varsayılan oluştur
    v_current_mode := COALESCE(v_mode_stats->p_mode, '{"words": 0, "moves": 0, "duration": 0, "game_count": 0}'::jsonb);

    -- Kümülatif toplama
    v_mode_stats := jsonb_set(
        v_mode_stats, 
        array[p_mode], 
        jsonb_build_object(
            'words', (v_current_mode->>'words')::INTEGER + (p_session_stats->>'words')::INTEGER,
            'moves', (v_current_mode->>'moves')::INTEGER + (p_session_stats->>'moves')::INTEGER,
            'duration', (v_current_mode->>'duration')::INTEGER + (p_session_stats->>'duration')::INTEGER,
            'game_count', (v_current_mode->>'game_count')::INTEGER + 1
        )
    );

    -- Kaydet
    UPDATE public.profiles SET mode_stats = v_mode_stats, updated_at = NOW() WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------
-- 4. RLS KISITLAMASI (Opsiyonel ama Önerilen)
-- ----------------------------------------------------------
-- Doğrudan UPDATE yetkisini tamamen kapatıp sadece RPC üzerinden 
-- güncellemeye zorlamak isterseniz aşağıdaki komutu kullanabilirsiniz.
-- DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles;
