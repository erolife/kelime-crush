-- Mevcut etkinlikleri temizle (Test için temiz bir sayfa)
DELETE FROM events;

-- Yeni şemaya uygun test etkinliği ekle
-- Başlık ve Açıklama artık JSONB (tr/en) yapısındadır.
INSERT INTO events (
    title, 
    description, 
    type, 
    allowed_modes, 
    start_at, 
    end_at, 
    rewards
)
VALUES (
    '{"tr": "Hafta Sonu Maratonu 🏆", "en": "Weekend Marathon 🏆"}',
    '{"tr": "Seçili modlarda en yüksek puanı topla, efsanevi ödülleri kap!", "en": "Collect top scores in selected modes and grab legendary rewards!"}',
    'manual',
    '["arcade", "timeBattle"]',
    now(),
    now() + interval '3 days',
    '[
        {"rank": "1", "prizes": [{"type": "coins", "amount": 5000}, {"type": "bomb", "amount": 5}]},
        {"rank": "2-5", "prizes": [{"type": "coins", "amount": 2500}, {"type": "energy", "amount": 10}]},
        {"rank": "6-20", "prizes": [{"type": "coins", "amount": 1000}]}
    ]'
);
