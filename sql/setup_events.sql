-- 1. Etkinlikler Tablosu
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'manual' CHECK (type IN ('periodic', 'manual')),
    allowed_modes JSONB DEFAULT '["arcade", "timeBattle"]'::jsonb, -- Hangi modlarda puan toplanabilir?
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    rewards JSONB DEFAULT '[]'::jsonb, -- [{"rank": 1, "coins": 500, "tools": {"bomb": 1}}, ...]
    is_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_at > start_at)
);

-- 2. Etkinlik Katılımcıları Tablosu
CREATE TABLE IF NOT EXISTS public.event_participants (
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (event_id, user_id)
);

-- 3. RLS Ayarları
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
-- 4. Fonksiyon: Skoru Üzerine Ekleme (Upsert Mantığı)
-- Bu fonksiyonu Supabase RPC üzerinden çağıracağız.
