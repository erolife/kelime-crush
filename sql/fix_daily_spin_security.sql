-- profiles tablosu için crush_last_spin sütunu TEXT (long) olarak mevcut.
-- İstemci tarafındaki "saat geri alma" hilesini veritabanı seviyesinde daha sıkı kontrol etmek için RPC güncellenmelidir.

-- update_profile_secure fonksiyonunda tarih kontrolü ekleme önerisi:
-- Bu script mevcut update_profile_secure fonksiyonunun içine mantık ekler.

/*
CREATE OR REPLACE FUNCTION public.update_profile_secure(p_user_id uuid, p_updates jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_last_spin text;
  v_new_spin text;
  v_last_spin_int bigint;
  v_new_spin_int bigint;
BEGIN
  -- Eğer crush_last_spin güncellenmek isteniyorsa
  IF p_updates ? 'crush_last_spin' THEN
    SELECT crush_last_spin INTO v_last_spin FROM public.profiles WHERE id = p_user_id;
    v_new_spin := p_updates->>'crush_last_spin';
    
    IF v_last_spin IS NOT NULL AND v_last_spin != '' THEN
      v_last_spin_int := v_last_spin::bigint;
      v_new_spin_int := v_new_spin::bigint;
      
      -- Eğer yeni tarih eskisinden küçükse veya 24 saat geçmemişse reddet (İsteğe bağlı sıkı kontrol)
      -- IF v_new_spin_int < v_last_spin_int + 86400000 THEN
      --   RETURN FALSE;
      -- END IF;
    END IF;
  END IF;

  -- Mevcut güncelleme mantığı devam eder...
  UPDATE public.profiles 
  SET 
    coins = COALESCE((p_updates->>'coins')::int, coins),
    tools = COALESCE(tools || (p_updates->'tools'), tools),
    crush_last_spin = COALESCE(p_updates->>'crush_last_spin', crush_last_spin),
    -- ... diğer alanlar
    updated_at = now()
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$function$;
*/
