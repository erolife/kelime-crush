# WORDLENGE - Proje Bağlamı (AGENT_CONTEXT.md)

**Son Güncelleme:** 2026-03-01
## Proje Durumu: v5.0.1 (English Dictionary Upgrade)
- **Feature (v5.0.1)**: İngilizce kelime listesi (~5MB) 274 kelimeden on binlerce kelimeye çıkarıldı.
- **Feature (v5.0.0)**: Çok dilli (TR/EN) Seviye Yönetimi (CRUD) ve JSONB veritabanı altyapısı kuruldu.
- **Feature (v5.0.0)**: Oyun içi seviye numaralandırma "ID" yerine "Sıra No" (İndeks bazlı) mantığına geçirildi.
- **Visual (v5.0.0)**: MISSION modu için özel kırmızı temalı "GÖREV BAŞARISIZ" ekranı eklendi.
- **UX (v5.0.0)**: Tamamlanmış seviyelerin (Mission) tekrar oynanması kısıtlandı.
- **Fix (v5.0.0)**: Supabase `levels` tablosu RLS politikaları (Admin INSERT/UPDATE) onarıldı.
- **Fix (v5.0.0)**: App.jsx / Dashboard ReferenceError ve i18n render hataları giderildi.
- **Fix (v5.0.0)**: `USE_TOOL` görevlerinde `bomb` ve `blast` takibi veri tipi bazında düzeltildi.
- **Feature (v4.10.0)**: Zen Modu görsel geliştirmeleri: "Zen Bahçesi" ve "Uçuşan Ruhlar".
- **Feature (v4.9.0)**: Zen moduna özel "YETERLİ" butonu ve seans sonu analiz (süre, hamle, kelime) ekranı eklendi.
- **Feature (v4.8.1)**: Dashboard header alanına ses açma/kapama (mute) butonu eklendi.
- **Feature (v4.8.0)**: Arcade moduna "Zamana Karşı" ve "Hamle Sınırlı" seçenekleri eklendi.
- **Feature (v4.8.0)**: Misafir kullanıcılar için arcade kısıtlamaları (30sn / 15 hamle) ve üyelik teşvik uyarısı eklendi.
- **Visual (v4.8.0)**: Zamana karşı modunda hamlelerin azalmaması, ancak takibinin yapılması sağlandı. Kalan süre için görsel uyarılar eklendi.
- **Hotfix (v4.7.0)**: Dashboard `renderView` switch-case yapısındaki JSX `div` hiyerarşisi (eksik/fazla kapanış etiketleri) onarıldı. Dashboard'un boş görünmesi ve Header'ın kaybolması/çiftleşmesi sorunları giderildi.
- **Visual (v4.7.0)**: Uygulamaya premium animated "falling letters" (düşen harfler) arka plan katmanı eklendi. z-index hiyerarşisi (z-0 background, z-10 main content) stabilize edildi.
- **Feature (v4.6.0)**: Mobil cihazlarda (md breakpoint altı) Header padding, logo ve font boyutları daraltıldı. Dashboard ikincil sayfaları (envanter, günlük ödül vb.) dikey kaydırılabilir (overflow-y-auto) hale getirildi.
- **Feature (v4.5.0)**: Dashboard ana ekranı tamamen yeniden tasarlandı. Mobil-first layout, gradient kartlar, noise texture, XP bar, CTA pill'ler, responsive profil şeridi eklendi.
- **Hotfix (v4.4.3)**: highScore oyun sonu mantığı düzeltildi, score closure sorunu giderildi.
- **Feature (v4.4.2)**: Misafirler için Header'daki Altın/Enerji gizlendi; Leaderboard erişimi açıldı.
- **Hotfix (v4.0.3)**: Bomba oluşumu sırasında yaşanan 'result is not defined' hatası giderildi ve 'Pulse' animasyonu eklendi.
- **Hotfix (v4.0.2)**: Seviye seçiminde ve MissionTracker'da yaşanan 't is not a function' (Translation) hatası giderildi.
- **Hotfix (v4.0.1)**: Canlı yayım sonrası tespit edilen 'Seviye Modunda Boş Ekran' ve 'Mobil Görünümde Izgara Kaybolması' hataları giderildi.
- **Ana Hedef (v4.0.0)**: Kullanıcı deneyimini modernleştirmek için modal tabanlı yapıdan tam ekran görünümlere geçiş yapıldı.
- **Navigasyon**: Dashboard artık 'modes', 'levels', 'inventory', 'leaderboard', 'daily' ve 'settings' görünümlerini tam ekran olarak yönetiyor.
- **Modal Stratejisi**: Modallar sadece oyun sonuçları (Victory/GameOver), kritik bildirimler ve onay diyalogları için ayrıldı.
- **UI/UX**: Dashboard tasarımı sidebar yapısı ile zenginleştirildi, Rank ve Envanter bilgileri doğrudan Dashboard üzerinden erişilebilir hale getirildi.

## 🎯 Proje Özeti
"Kelime Crush" olan projenin ismi **WORDLENGE** olarak değiştirilmiş ve görsel kimliği yeni logoya (Turuncu, Kırmızı, Mavi) uyarlanmıştır. Oyun, modern ve premium bir "Gaming Dashboard" üzerinden yönetilen, bulut destekli ve çok dilli bir puzzle-kelime avı oyunudur.

## 🚀 Önemli Gelişmeler & Kararlar

### 1. Ayarlar & Ses Kontrolü (Phase 6.5 - v3.1)
- **Settings Restore:** Dashboard Header'ına "Ayarlar" butonu geri eklendi. Ses aç/kapat ve zorluk seviyesi ayarlarına erişim sağlandı.
- [x] v4.4.1: Guest data isolation (Inventory/Profile/Leaderboard lock)
- [x] v4.4.0: Misafir kullanıcı Seviye modu kısıtlaması & Üyelik teşviki
- [x] v4.2.1: totalScore ReferenceError (missing destructuring) düzeltmesi
- **UI Consolidation (v3.0):** Envanter modal yapısına çekildi, Sidebar konsolide edildi ve mod kartları gapless hale getirildi.
- **Görsel İyileştirme:** Google Fonts (Outfit, Inter) entegrasyonu ve Tailwind 4 @theme geçişi ile tipografi mükemmelleştirildi.

## 🛠️ Teknik Altyapı
- **Frontend:** React + Tailwind CSS 4
- **Backend:** Supabase (Auth, PostgreSQL DB, Realtime)
- **Tipografi:** Outfit (Başlıklar) & Inter (Bilgi Metinleri)
- **Motor:** Custom Canvas (Circular Hit Detection, Particle Systems)

## 🚧 Gelecek Planlar (Phase 7 ve Ötesi)
- **Günlük Görevler (Daily Missions):** Sidebar üzerindeki kilitli buton aktif edilecek ve ödüllü dinamik görevler eklenecek.
- **Seviye Editörü:** Kullanıcıların kendi seviyelerini tasarlayabileceği bir modül.
- **Topluluk:** Arkadaş ekleme, düello modu ve klan sistemleri.

## ⚖️ Oyun Ekonomisi ve Denge (Rebalancing)
- **Dinamik Zorluk:** 
    - Kolay: Moves: 40, Vowel Bonus: 1.8x
    - Normal: Moves: 30, Vowel Bonus: 1.0x
    - Profesör: Moves: 20, Vowel Bonus: 0.6x
- **Bomba Mekaniği:** 4 harf (Line Blast), 5+ harf (Bomba) üretimi. Tek tıkla patlatma özelliği aktif.

## Teknik Notlar (Premium Canvas):
- **Sizing:** `ResizeObserver` ile %100 responsive dikdörtgen oyun alanı.
- **Performans:** Canvas API ile 60 FPS akıcılık. Hücre hit detection radius: 38%.
- **Sizing Correction (v4.0.1):** Mobil cihazlarda ızgara görünürlüğü için `aspect-[11/9]` zorunlu kılındı ve kök div `h-screen w-screen` ile sabitlendi.
- **Prop Logic Correction (v4.0.2):** Alt bileşenlere `t = (s) => s` ve `levels = []` gibi fallback propları eklenerek JS çökmeleri (TypeError) kalıcı olarak engellendi.
