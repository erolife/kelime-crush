# WORDLENGE - Proje Bağlamı (AGENT_CONTEXT.md)

**Son Güncelleme:** 2026-03-08
## Proje Durumu (Son Güncelleme: 08.03.2026)

- **Sürüm:** v1.4.0 (Yazar Modu & UI Harmonizasyonu)
- **Aşama:** Yazar Modu yayına alındı, Dashboard görsel harmonizasyonu tamamlandı.
- **Yapılan İyileştirmeler:**
    1. **Yazar Modu (AI):** Gemini Pro destekli hikaye üretim sistemi (Edge Function) yayına alındı. Seviye 5+ kısıtlaması ve hibrit tetikleme (oyun sonu + dashboard) eklendi.
    2. **Dashboard Harmonizasyonu:** Tüm oyun modlarının font boyutları (Desktop: 3xl, Mobile: lg) ve kart yapıları Zen moduyla eşitlendi.
    3. **Görsel Birleştirme:** Zen Serüveni ve Yazar Modu kartları dikey düzlemde birleştirildi (Rounding & Gapless design).
    4. **Güvenlik & Ekonomi:** `update_profile_secure` RPC fonksiyonu ile hile korumalı altın düşümü ve profil güncelleme altyapısı kuruldu.
    5. **Hata Düzeltme:** `App.jsx` üzerindeki state tanım hataları ve SQL idempotency sorunları giderildi.

## Güncel Görevler & Sorunlar
- [x] Günlük çark hilesinin engellenmesi.
- [x] Satın alınan özel bombaların oyun tahtasına eklenmesi.
- [x] Eski cihazlardaki kasma/donma sorunları için optimizasyon.
- [x] Yazar Modu API entegrasyonu ve UI tasarımı.
- [x] Dashboard kartlarının görsel uyumunun sağlanması.
- [x] Seviye 5 kilit mekanizması ve kilit ikonları.
- [ ] Koleksiyon Kartları sistemi (Planlama aşamasında).
- [ ] Haftalık Lig Sistemi (Planlama aşamasında).

## Proje Durumu: v1.0.0 (Google Play Yayını & Güvenlik) (06.03.2026)
- **Feature (v9.0.0)**: Monetizasyon altyapısı oluşturuldu — Stripe-only (USD bazlı):
    - Mevcut araç marketi korunarak sekmeli mağaza yapısı kuruldu (Araçlar / Altın Paketleri / PRO).
    - **Altın Paketleri:** 5 kademe ($0.99-$19.99, ₺39.99-₺749.99). İlk alım 2x bonus.
    - **WORDLENGE PRO AVANTAJLARI (v9.1.0):**
        - **Sınırsız Enerji:** PRO kullanıcıları için enerji tüketimi devre dışı bırakıldı. Enerji göstergesinde "∞" simgesi aktif edildi.
        - **2x Günlük Ödül:** Şans çarkından kazanılan tüm ödüller (Altın ve Araçlar) PRO kullanıcıları için otomatik olarak 2 katı verilir. Ödül ekranında "PRO 2x BONUS" ibaresi eklendi.
        - **PRO Rozeti:** Liderlik tablosunda ve Profil sayfasında PRO üyeleri için özel "Mavi Yıldız" rozeti eklendi.
    - [x] Veritabanı şeması güncellendi (`unlimited_energy_until` sütunu eklendi).
    - [x] Deep Link Entegrasyonu: Ödeme sonrası `wordlenge://` şeması ile uygulamaya otomatik dönüş. `@capacitor/browser` In-App Browser ve `@capacitor/app` Deep Link dinleyicisi eklendi. (04.03.2026)
    - [x] Footer linkleri (Kullanım Şartları / Gizlilik Politikası) landing page'e yönlendiriliyor.
- **Günlük Görev Sistemi (v11.0.0)** (05.03.2026):
    - [x] **Kumülatif Takip:** Araç kullanımı, kelime bulma ve oyun oynama aksiyonları gün boyunca takip ediliyor.
    - [x] **Ödül Sistemi:** Görevler tamamlandığında Altın ve XP ödülleri toplanabiliyor.
    - [x] **Supabase Sync:** Görev ilerlemeleri `profiles` tablosundaki `daily_missions` JSONB sütunu ile senkronize edildi.
    - [x] **Fix:** `App.jsx` içerisindeki `ReferenceError: dailyMissions is not defined` hatası giderildi (Prop passing & deconstruction).
    - [x] **UI:** Mobil alt navigasyondaki (footer) işlevsiz "OYNA" butonu kullanıcı talebiyle kaldırıldı.
- **Eğitici Modu (Onboarding) (v11.3.0)** (05.03.2026):
    - [x] **Sabit Tahta:** Yeni oyuncular için "KELİME" (TR) veya "WORDS" (EN) harflerini içeren sabit bir başlangıç tahtası oluşturuldu. Ekran yönü değişiminde (resize) tahtanın bozulmaması sağlandı.
    - [x] **Görsel Rehber (👇):** Kullanıcıyı ilk hamlesine yönlendiren, harfler üzerinde gezinen hareketli bir el simgesi animasyonu `PremiumCanvas`'a eklendi.
    - [x] **Otomatik Tamamlama:** İlk kelime bulunduğunda eğitici mod otomatik olarak sona erer ve `localStorage` üzerinden kalıcı olarak kaydedilir.
    - [x] **Fix:** `useGame.js` içerisindeki hook sıralaması ve eksik return değerleri düzeltilerek eğitici modun stabil çalışması sağlandı.
- **Sistem Kararlılık & Seçici Geri Yükleme (05.03.2026):**
    - [x] **Revert:** Layout ve grid sorunları (ezilme, hitbox kayması) nedeniyle sistem `2bd2773` (Tutorial Modu Tamamlanması) commit'ine geri döndürüldü.
    - [x] **Seçici Geri Yükleme:** Sorunlu seanstaki kıymetli özellikler (Google Deep Link, Profil Fix, Enerji Kontrolü, Market Yeni Ürün) manuel olarak kararlı sürüm üzerine entegre edildi.
    - [x] **Google OAuth Fix:** Native cihazlarda `wordlenge://auth-callback` yönlendirmesi ve Deep Link dinleyicisi başarıyla geri yüklendi.
    - [x] **Enerji & Market:** Enerji bittiğinde markete yönlendirme ve 500 altına enerji alma özelliği eklendi.
- **Şans Çarkı Güvenliği** (05.03.2026):
    - [x] **Race Condition Fix:** Çark çevrildiği anda kilitlenerek üst üste çevrilmesi engellendi.
    - [x] **UX:** Ödül talep edildikten sonra modalın otomatik kapanması sağlandı.
- **Zorluk ve Kullanıcı Deneyimi** (04.03.2026):
    - [x] **Kolay Mod İyileştirmesi:** Hamle sayısı 40 -> 50, Sesli Harf Bonusu 1.8 -> 2.5 yapıldı.
    - [x] **Kalıcı Zorluk Seçimi:** Seçilen zorluk `localStorage`'a kaydedilerek kalıcı hale getirildi.
    - [x] **Mantık Düzeltmesi:** `App.jsx` içerisindeki hardcoded `'normal'` zorluklar temizlendi, kullanıcı seçimi tüm modlarda aktif edildi.
- **UI & Balancing** (04.03.2026):
    - [x] Header'daki profil badge'inden "Lvl" ön eki kaldırıldı.
    - [x] **XP/Level Re-balancing:** Seviye atlama barajı 1000'den 2500 XP'ye çıkarıldı, artış katsayısı %20 yapıldı. Kelime ödülleri %50 azaltıldı.
- **SafeArea & Header Düzeltmesi (v10.2.2)** (06.03.2026):
    - [x] Android APK build'indeki mükerrer SafeArea/boşluk sorunu çözüldü.
    - [x] `index.css` body padding'leri ve `App.jsx` ana hiyerarşisindeki mükerrer `env(safe-area-inset-top)` kuralları kaldırıldı.
    - [x] SafeArea yönetimi Capacitor StatusBar plugin ve kontrollü hiyerarşi ile stabilize edildi.
- **Visual (v10.0.0)**: **Game Juice & Görsel İyileştirmeler (04.03.2026):**
    - **Electric Selection Trail:** Harf birleştirme hattı artık statik değil, titreşimli ve parlayan bir elektrik akımı şeklinde.
    - **Spring Physics & Snap:** Harfler yere düştüğünde "Yaylı Fizik" ile organik bir şekilde yaylanıyor. Düşüş hızı (gravity) %80 artırıldı (2.5 -> 4.5), daha "snappy" ve akıcı bir his sağlandı.
    - **Squash & Stretch:** Hızlı düşüşlerde harfler uzuyor, yere çarptıklarında ise hafifçe ezilip eski hallerine dönüyor.
    - **Bomba Görünürlüğü:** Satır/Sütun bombaları üzerine animasyonlu "Lazer Tarama" çizgileri ve breathing glow efekti eklendi (Mobil görünürlük artırıldı).
    - **Hiper-Gerçekçi Jelibon (Candy) Efekti:** Harflere kavisli üst ışıklar (highlights) ve alt kenar yansımaları (rim light) eklenerek 3D şeker görünümü kazandırıldı.
    - **Performans Optimizasyonu:** `shadowBlur` ve `clip()` gibi ağır operasyonlar optimize edildi. Standart karolar için gölgeler devre dışı bırakılarak 60 FPS akıcılık sağlandı.
    - **Performans Kontrolü:** `PremiumCanvas.jsx` içerisine `VISUAL_CONFIG` eklendi; istenen özellikler buradan kapatılabilir.
- **Feature (v6.0.0)**: Oyun modları için YENİ isimler belirlendi:
- **Feature (v7.0.0)**: **Ultra Esnek Etkinlik Sistemi (v7.0.0):**
    - Periyodik (Haftalık vb.) ve Manuel (2 saatlik vb.) etkinlik desteği.
    - Mod kısıtlaması (Sadece Arcade veya TimeBattle puanları geçerli olabilir).
    - Dereceye göre (Rank-based) esnek ödül sistemi (Altın, Bomba, vb.).
    - Admin Panel (`wordlengenext`) üzerinden tam yönetim (CRUD).
    - Mobil Uygulama (`kelime-crush`) Dashboard entegrasyonu (Aktif Etkinlik Banner & Detay).
    - Otomatik puan senkronizasyonu (Oyun sonu servis tetikleme).
- **Rank & Mastery Sistemi (v8.0.0):**
    - **Faz 1 (Mantık):** XP hesaplama, Seviye formülü ve Mastery Points altyapısı kuruldu.
    - **Faz 2 (UI):** 
        - Dashboard Header: Minimalist seviye rozeti ve XP barı.
        - Profil Sayfası: Detaylı gelişim kartı ve Kariyer Kademesi (Unvanlar).
        - Oyun Sonu (Victory/GameOver): Kazanılan XP animasyonları ve göstergeleri.
    - **Unvanlar:** Rookie'den Word Deity'ye kadar 5 kademeli kariyer sistemi.
    - **Teknik:** `useGame.js` ve `App.jsx` arasında tam senkronizasyon.

- **Admin Panel Düzenlemeleri:**
    - `Seviye Yönetimi` geçici olarak devre dışı bırakıldı (Sidebar'dan kaldırıldı).
    - `Etkinlikler` menüsü stratejik öncelik olarak eklendi.
- **Feature (v6.0.0)**: "Seviye" (Mission) modu kaldırıldı, yerine "Zaman Arenası" (Time Battle) modu eklendi:
  - Süre seçimi: 1dk / 3dk / 5dk
  - Kelime üretildiğinde harf sayısının yarısı kadar saniye eklenir (yukarı yuvarlama)
  - İlk araç ödülü 60sn'de, sonrakiler her 120sn'de → rastgele araç kazanımı
  - Kademeli altın ödülü: <60sn=5, <180sn=15, <300sn=30, 300sn+=50 altın
  - Rütbe sistemi: Bronz (0-5dk), Gümüş (5-15dk), Altın (15dk+)
  - Game over ekranında: hayatta kalma süresi, kazanılan altın, rütbe, puan, bulunan kelime
  - `Constants.js`, `useGame.js`, `Translations.js`, `App.jsx` güncellendi
- **Android APK (Capacitor)**: Projeye CapacitorJS eklendi ve Android platform kurulumu yapıldı. ProGuard optimizasyon hatası çözüldü. (Build notu: APK almadan önce `npm run build` ve `npx cap sync` gereklidir.)
- **Known Issue**: Android cihazlarda uygulama SafeArea'ya (çentik / durum çubuğu altına) taşıyor. Sonraki adımda CSS `env(safe-area-inset-top)` veya Capacitor StatusBar plugin ile çözülecek.
- **Feature (v5.3.2)**: 4+ harfli kelimelerde tebrik animasyonu:
  - 4 harf: GÜZELDİ! | 5: HARİKA! | 6: MÜKEMMEL! | 7: SÜPER! | 8+: YOK ARTIK! NE YAPTIN SEN!
  - Pop-in + shake + fade-out animasyonları, kelime uzunluğuna göre artan yoğunluk
  - Kelime uzunluğuna göre farklı renk paletleri, sparkle partikülleri
  - Ses desteği: `cheer_small` (4-5 harf) ve `cheer_big` (6+ harf) — ses dosyaları değiştirilebilir
  - `useGame.js`, `App.jsx`, `SoundManager.js`, `Translations.js` güncellendi
- **Fix (v5.3.1)**: Seviye tamamlanınca "Devam Et" butonu artık aynı seviyeyi tekrar açmak yerine sonraki seviyeye geçiyor. Son seviyedeyse ana sayfaya dönüyor.
- **Feature (v5.3.1)**: Victory ekranında kazanılan ödüller (altın, araçlar) animasyonlu kartlarla gösteriliyor:
  - Her ödül tipi için özel renk paleti ve ikon
  - Pop-in animasyonu (staggered delay ile sıralı giriş)
  - İkon pulse efekti ve sparkle animasyonu
  - `App.jsx`: Victory overlay yeniden yazıldı, CSS keyframes eklendi
- **Feature (v5.3.0)**: Mobil cihazlarda ekran yönüne göre dinamik grid boyutlandırma:
  - Dikey (Portrait): 11 satır × 8 kolon → Harfler daha büyük
  - Yatay (Landscape): 7 satır × 13 kolon → Yatay alanı verimli kullanır
  - Masaüstü (768px+): 9 satır × 11 kolon (mevcut, değişmedi)
  - Oyun sırasında yön değişiminde grid otomatik yeniden oluşturulur
  - `Constants.js`: `GRID_OVERRIDES` ve `getGridSize` helper eklendi
  - `useGame.js`: orientation/isMobile state'leri ve resize listener eklendi
  - `App.jsx`: Sabit `aspect-[11/9]` yerine grid boyutuna göre dinamik aspect-ratio
- **Feature (v5.2.0)**: Tüm ekranlar yatay mod (landscape) için optimize edildi:
  - Market: Badge sistemi, bakiye başlığa taşındı, subtitle kaldırıldı
  - Günlük Ödül: Tüm elemanlar küçültüldü, buton görünür hale getirildi
  - Dashboard Kartları: Kart yüksekliği sınırlandı, iç elemanlar kompakt
  - Profil: Avatar yatay layout, 4 sütun istatistik grid
  - Ayarlar: Toggle/butonlar küçültüldü, hardcoded TR metinler i18n'e bağlandı
  - Seviye Listesi: 12 kolon grid, küçük başlık ve butonlar
  - Pregame: Açıklama başlığa taşındı, tüm butonlar kompakt
  - Oyun Ekranı: Header/stats/tools küçültüldü, grid 78vh'ye genişletildi
  - Araç Badge'leri: w-5 h-5 text-[10px] ile okunabilir hale getirildi
  - Victory/Game Over: Tüm modallar landscape-uyumlu
- **i18n (v5.2.0)**: `sound_music`, `difficulty_level` ve diğer hardcoded TR metinler çeviri sistemiyle desteklendi
- **Fix (v5.0.3)**: Mobil cihazlar için Dashboard, Daily Reward ve Gameplay UI (Stats/Goals) optimize edildi.
- **Fix (v5.0.2)**: Seviye sonu (Victory/GameOver), Sidebar ve Zen sonuç ekranlarındaki sert kodlanmış Türkçe metinler i18n sistemine (TR/EN) bağlandı.
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

## Son Yapılan Güncellemeler (08.03.2026)

- **Bomba Puanı:** Araç kullanımı (`bomb`, `nuclear` vb.) sırasında patlayan harflerin değerleri hesaplanarak oyuncu skoruna eklenmesi sağlandı (`useGame.js`).
- **Oyun Sonu Mantığı:** Game Over ekranında sürekli "SÜRE DOLDU" yazması düzeltildi. Oyun hamle bitiminden biterse artık "HAMLELER TÜKENDİ" ibaresi çıkıyor (`App.jsx`).
- **Hamle / Süre Uyarısı:** Süre modlarında son 4 saniyede, Hamle modlarında son 4 hamlede oyun alanının çerçevesine kırmızı bir uyarı (`pulse`) eklendi (`App.jsx`).
- **Teselli Ödülü (Consolation Prize):** Oyun kaybedildiğinde bile (skor > 100 ise) %50 ihtimalle kullanıcılara 10-30 altın arası veya rastgele bir araç "Teselli Ödülü" olarak hediye edilecek şekilde kurgulandı ve eklendi (`Translations.js` ve `App.jsx` entegrasyonu).

## Bilinmesi Gereken Önemli Kurallar

### 1. Dosya ve Klasör Yapısı Kontrolü (Phase 6.5 - v3.1)
- **Settings Restore:** Dashboard Header'ına "Ayarlar" butonu geri eklendi. Ses aç/kapat ve zorluk seviyesi ayarlarına erişim sağlandı.
- [x] v4.4.1: Guest data isolation (Inventory/Profile/Leaderboard lock)
- [x] v4.4.0: Misafir kullanıcı Seviye modu kısıtlaması & Üyelik teşviki
- [x] v4.2.1: totalScore ReferenceError (missing destructuring) düzeltmesi
- **UI Consolidation (v3.0):** Envanter modal yapısına çekildi, Sidebar konsolide edildi ve mod kartları gapless hale getirildi.
- **Görsel İyileştirme:** Google Fonts (Outfit, Inter) entegrasyonu ve Tailwind 4 @theme geçişi ile tipografi mükemmelleştirildi.

## 🛠️ Teknik Altyapı
-   **Framework:** React 18
-   **Build Tool:** Vite
-   **Mobile Platform:** CapacitorJS (Android build, AppID: `com.hyperrealme.wordlenge`)
-   **Styling:** TailwindCSS
-   **State Management:** React Context / Hooks
-   **Icons:** Lucide React
-   **Audio:** Howler.js (managed via `SoundManager.js`)
-   **Database:** Supabase (Auth ve Data) (Circular Hit Detection, Particle Systems)

## 🚧 Gelecek Planlar (Phase 7 ve Ötesi)
### Yapılan İşlemler (03.03.2026)
- [SQL] `events` ve `event_participants` tabloları oluşturuldu. RLS politikaları ve `update_event_score` fonksiyonu eklendi.
- [Admin] `EventsAdmin` sayfası (`/admin/events`) oluşturuldu. Etkinlik ekleme/düzenleme formu (zamanlayıcı, mod seçimi, JSON ödül yapısı) tamamlandı.
- [Mobile] `SupabaseService.js` içerisine `getActiveEvents`, `getEventLeaderboard` ve `updateEventScore` metodları eklendi.
- [Mobile] `useGame.js` kancasına aktif etkinlikleri takip eden ve oyun sonunda puanları kaydeden mantık entegre edildi.
- [Mobile] `App.jsx` üzerinde `EventView` ve `EventLeaderboard` bileşenleri ile Dashboard banner yapısı kuruldu.
- [Mobile] `App.jsx` üzerinde `EventView` ve `EventLeaderboard` bileşenleri ile Dashboard banner yapısı kuruldu.
- [Fix] `App.jsx` içerisindeki `Identifier 'activeEvent' has already been declared` hatası düzeltildi. Dashboard bileşenine aynı isimli prop gönderildiği için içerideki mükerrer tanım kaldırıldı. (03.03.2026)
- [Fix] `App.jsx` içerisinde Arcade ve Zaman Savaşı modu butonlarındaki yanlış View yönlendirmesi düzeltildi (`setView` -> `setDashboardView`). Oyun modlarının açılmama sorunu giderildi. (03.03.2026)
- [Fix] `SupabaseService.js` içerisinde mükerrer olan `updateProfile` fonksiyonu temizlendi. 
- [Feature] `App.jsx` içerisindeki Profil Düzenleme formuna Cinsiyet seçeneği eklendi. Ayrıca profil düzenleme işlemi başarılı olduğunda arayüzün anında güncellenmesi için `useGame.js` teki `fetchProfile` fonksiyonu prop olarak geçirilerek çağrıldı. (03.03.2026)
- [Fix] Supabase profil resmi yükleme işleminde (avatarFile) File nesnesi iletişiminin kopması ihtimaline karşın; önizleme formatındaki Base64 görsel verisinin decode edilip gönderilmesi sağlandı (`SupabaseService.js` içerisinde `uploadAvatar` fonksiyonu güncellendi). (03.03.2026)
- [DB Config] Kullanıcının Supabase tarafında `game-assets` isimli bir Storage/Bucket klasörüne sahip olmadığı tespit edildi. İlerisi için `proje_schema.sql` dosyasına Bucket ve Policy izin (RLS) scriptleri eklendi. `App.jsx` üzerindeki fotoğraf kaydetme fonksiyonu tekrar `File` objesi gönderecek hâle getirildi. (03.03.2026)
- [Fix] `App.jsx` içerisindeki Profil Resim Yükleme input'una (`accept`) MIME kısıtlaması getirildi ve hata uyarı bloğu oluşturuldu (Sadece jpg, png, webp formatlarına izin verilecek). (03.03.2026)
- [Feature] Uygulamanın Dashboard Header bölümündeki profil gösterge alanı güncellendi; kullanıcının yüklemiş olduğu profil resmi (avatar_url) varsa UI üzerinde gösterilmesi sağlandı. (03.03.2026)
- [Fix] Header alanında görüntülenen profil isimlerine ve mail adreslerine JavaScript ile maksimum 12 karakter sınırı getirildi. Uzun isimlerin tasarımı bozması engellendi ve ekrana sığmayan isimler "..." ile kısaltılarak üzerine gelindiğinde tam halinin (title attribute) görünmesi sağlandı. (03.03.2026)
### Etkinlik Sistemi ve Admin Panel Geliştirmeleri (Mart 2026)
- **Çok Dilli Destek:** Etkinlik isimleri ve açıklamaları `JSONB` formatında (tr/en) saklanacak şekilde güncellendi.
- **Periyodik Etkinlikler:** Haftalık otomatik tekrarlanan etkinlikler için admin paneline gün/saat seçici eklendi.
- **Esnek Ödül Tablosu:** Admin panelinden her sıralama aralığı için birden fazla ödül tanımlanabilen dinamik bir yapı kuruldu.
- **RLS Düzeltmesi:** `events` tablosunda admin girişi için eksik olan politikalar `fix_events_rls.sql` ile giderildi.
- **Periyodiklik & Nullable Fix:** Periyodik etkinliklerin kaydedilebilmesi için `start_at`/`end_at` alanları nullable yapıldı (`fix_events_nullable.sql`) ve mobil uygulamada (SupabaseService) periyodik vakitleri kontrol eden akıllı filtreleme mantığına geçildi.
- **Dashboard Entegrasyonu:** Mobil uygulamada çok dilli başlık/açıklama render desteği eklendi.
- [Fix] `App.jsx` boş ekran hatası giderildi: JSX syntax hataları temizlendi ve `Dashboard` yerel state'i `dashboardView` olarak izole edildi.
- **Kalıcı Mobil UI Çözümü (Flexbox):** Uygulama ana hiyerarşisi `App.jsx` içinde `flex flex-col h-[100dvh]` olarak güncellendi. Navigasyon barı `shrink-0` yapılarak içeriğin üzerine binmesi engellendi. (06.03.2026)
- **Market (ShopView) Sekmeleri:** SIRA sayfasındaki gibi kaydırılabilir tab yapısı (`overflow-x-auto no-scrollbar`) uygulandı.
- **Çeviri Fixleri:** `Translations.js` dosyasına `start_game` anahtarı eklendi, Arcade/Macera modundaki buton metni düzeltildi.
- **Layout Temizliği:** Pregame ekranlarındaki `pb-28` gibi manuel paddingler kaldırıldı, yerine Flexbox dinamik hiyerarşisi getirildi.
- [Admin] Seviye yönetimi sidebar'dan yoruma alınarak kaldırıldı.
- **Günlük Görevler (Daily Missions):** Sidebar üzerindeki kilitli buton aktif edilecek ve ödüllü dinamik görevler eklenecek.
- **Seviye Editörü:** Kullanıcıların kendi seviyelerini tasarlayabileceği bir modül.
- **Topluluk:** Arkadaş ekleme, düello modu ve klan sistemleri.
- **Günlük Çark (Daily Spin):** Kullanıcıların günde 1 kez çevirerek sürpriz ödüller kazanabileceği, "sadece üyelere özel" 8 dilimli ağırlıklı çark mekanizması mevcut `Seri Ödül` yapısının iptali üzerine başarıyla entegre edildi. Eski `streak` mantığı temizlendi ve yerine daha etkileşimli olan bu çark sistemi konuldu.
- **Rank & Mastery Sistemi (v8.0.0):**
    - **Faz 1 & 2:** XP mantığı, Seviye formülü ve UI entegrasyonu (Mobil + Landing Page) başarıyla tamamlandı. (03.03.2026)
- **Monetizasyon & Stripe Entegrasyonu (Gelecek - v9.0.0):**
    - Stripe üzerinden PRO abonelik ve Altın paketi satışlarının altyapısı kurulacak.
    - Webhook yönetimi ve veritabanı senkronizasyonu planlandı.
- **Hedef Puan ve Kısıtlamalar (v7.0.1):** Etkinlik şemasına (`target_score`, `duration_limit`, `moves_limit`) parametreleri eklendi. Kelime-crush App.jsx içerisindeki sabit (hardcoded) 60sn/30 hamle sınırları dinamik hale getirildi. İlgili kısıtlamalar "0" olarak girildiğinde o sınır kaldırılacak şekilde esnek (hibrit sayaç) mimarisine kavuşturuldu.
- **Katılım Anında Liderlik Listelenmesi:** Etkinlik başlatılırken (join_event) `updateEventScore` ile asenkron olarak "0" puan gönderilerek kullanıcıların etkinlik tablosunda anında görünmesi sağlandı.
- **Günlük Çark Güvenlik Entegrasyonu (v7.0.2):**
    - `localStorage` tabanlı takipten Supabase tabanlı takibe geçildi.
    - `profiles` tablosuna `crush_last_spin` (TEXT) sütunu eklendi.
    - `App.jsx` üzerinden `DailySpin` bileşenine profil verileri ve güncelleme fonksiyonu aktarıldı.
    - Hileli spin kullanımı önlendi ve veriler veritabanı ile senkronize edildi. (03.03.2026)
- **Etkinlik Liderlik Tablosu Düzeltmesi (v7.0.3):**
    - `event_participants` ve `profiles` arasındaki ilişki (JOIN) hatası giderildi.
    - `user_id` referansı `auth.users` yerine `public.profiles` olarak güncellendi. (03.03.2026)
- **Etkinlik Enerji ve Skor Senkronizasyonu (v7.0.4):**
    - Etkinliğe her girişte 1 enerji tüketilmesi sağlandı.
    - Oyun bittiğinde (Victory/GameOver) skorun otomatik olarak etkinliğe senkronize edilmesi eklendi.
    - Sözdizimi (syntax) hataları giderildi ve sistem stabilize edildi. (03.03.2026)
- **Enerji Tüketim ve Yenileme Mantığı Düzeltmesi (v7.0.5):**
    - Enerji 5 iken (full) tüketildiğinde yenileme süresinin anında sıfırlanması sorunu giderildi (`lastEnergyRefill` güncellemesi).
    - Etkinlik giriş ekranında enerji yetersizse buton pasifleştirildi ve uyarı eklendi. (03.03.2026)
- **Splash Screen Takılma ve Performans Düzeltmesi (v7.0.6):**
    - Saniyelik enerji güncellemelerinin re-render döngüsü nedeniyle Splash Screen'in takılı kalması sorunu giderildi (`useCallback` memoization).
    - Uygulama başlangıç ve çalışma kararlılığı artırıldı. (03.03.2026)
- **Hata Düzeltme ve Markalama (v7.0.7):**
    - `App.jsx` üzerindeki `useCallback` eksik import hatası giderildi.
    - `kelime-crush` ve `wordlengenext` projelerindeki varsayılan faviconlar Wordlenge logosu ile güncellendi. (03.03.2026)
- **Kelime Takip Sistemi (v7.0.8):**
    - Masaüstü yan paneline toplam bulunan kelime sayısı (`foundWords.length`) eklendi.
    - Mobil görünüm için bulunan kelimeleri yatayda listeleyen şık bir şerit ve giriş alanına toplam kelime rozeti eklendi. (03.03.2026)
- **Mobil Kelime Takip İyileştirmesi (v7.0.9):**
    - Bulunan kelimeler şeridinin ekrandan taşma sorunu giderildi.
    - Dokunmatik kaydırma (touch scroll) özellikleri eklenerek kullanıcı deneyimi iyileştirildi. (03.03.2026)
- **Build Süreci Notu (04.03.2026):**
    - Yapılan web güncellemelerinin Android APK'ya yansıması için `npm run build` ve `npx cap sync` adımlarının Android Studio'dan önce çalıştırılması gerektiği netleştirildi.

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
- [x] **Yerel Bildirim Entegrasyonu (v15.0.0)** (06.03.2026):
    - [x] `@capacitor/local-notifications` kuruldu ve `NotificationService.js` oluşturuldu. Enerji 5/5 olduğunda kullanıcıya bildirim gönderme mantığı eklendi.
    - [x] Android 13+ için `POST_NOTIFICATIONS` izni eklendi.
- [ ] **Push Bildirimler (Firebase FCM):** Etkinlik duyuruları ve global bildirimler için Firebase entegrasyonu (Android/iOS) maaza girişi sonrası için planlandı.
    - [x] **Footer Navigasyon İyileştirmesi (v13.0.0):** Alt menü dashboard genelinde kalıcı hale getirildi. "Ana Sayfa" öğesi eklenerek toplam 6 öğeli, optimize edilmiş mobil düzen (px-4) uygulandı. İçeriklerin menü altında kalmaması için tüm görünümlere `pb-28/32` padding eklendi. (06.03.2026)
- [x] **UI Mikro Düzenlemeler:** Hediye ekranındaki ikon kaldırılarak yer kazanıldı, Günlük Görevler başlığı mobil için küçültüldü (`text-xl`). Market sekmeleri sabitlendi ve içerik kaydırma özelliği eklendi. (06.03.2026)
- [x] **Hesap Silme Özelliği (v14.0.0)** (06.03.2026): Google Play Store veri gizliliği politikalarına uyum için geliştirildi.
    - [x] **Mobil Uygulama:** Profil ekranına "Hesabı Sil" butonu ve geri dönüşü olmayan işlem uyarısı içeren onay modalı eklendi. `handleDeleteAccount` fonksiyonu `Dashboard` seviyesine taşınarak kapsam sorunu giderildi.
    - [x] **Supabase Entegrasyonu:** `SupabaseService.js` içerisinde profile verilerini silen ve oturumu kapatan `deleteUserAccount` fonksiyonu uygulandı.
    - [x] **Web (Landing Page):** `wordlengenext` projesinde `https://wordlenge.com/delete-account` URL'si ile hesap silme talep ve bilgilendirme sayfası oluşturuldu.
- [x] **Market & Genel Scroll Fix (v14.2.0)** (06.03.2026):
    - [x] **ShopView:** "SIRA" (Leaderboard) sayfasıyla teknik hiyerarşi eşitlendi. `h-full` ve `flex-1 min-h-0` zinciri kurularak mobil tarayıcıların height kısıtlamasını doğru algılaması sağlandı.
    - [x] **Scroll Reset:** Sekme değişimlerinde scroll pozisyonunun sıfırlanması için `ref` tabanlı `useEffect` eklendi.
    - [x] **Touch Scroll Support:** `touch-none` engelini aşmak için tüm ana dikey kaydırma alanlarına (`ShopView`, `LeaderboardView`, `DailyMissions`, `Settings`, `Profile`, `Pregame`) `touch-pan-y` sınıfı eklendi. Mobil cihazlardaki dikey kaydırma blokajı tamamen kaldırıldı.
- [x] **Güvenlik Sertleştirmesi (Anti-Cheat) (v1.0.0)** (06.03.2026):
    - [x] Altın, XP ve Araç manipülasyonunu engelleyen RPC'ler (`update_profile_secure`, `update_mode_stats_secure`) oluşturuldu ve `SupabaseService.js` entegre edildi.
    - [x] `security_hardening.sql` ile veritabanı RLS ve Storage politikaları sertleştirildi.
    - [x] Uygulama sürümü Google Play Store yayını için `1.0.0` olarak güncellendi.

- **Yazar Modu (Writer Mode) (v14.0.0)** (08.03.2026):
    - **Hibrit Tetikleme:** Seviye 5+ oyuncular için oyun sonunda (5 adet 4+ harfli kelime bulunması şartıyla) tetiklenen hikaye yazma sistemi.
    - **Kelime Seçimi:** Kullanıcının hikayede geçmesini istediği kelimeleri listeden seçebileceği veya seçimi yapay zekaya (AI) bırakabileceği interaktif UI.
    - **Ekonomi:** Kısa hikayeler ücretsiz, uzun hikayeler 50 Altın (PRO üyeler için ücretsiz).
    - **Teknik:** `useGame.js` üzerinde kelime takibi, `App.jsx` üzerinde modal yönetimi ve `stories` veritabanı şeması tamamlandı.
