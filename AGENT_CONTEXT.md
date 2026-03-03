# WORDLENGE - Proje Bağlamı (AGENT_CONTEXT.md)

**Son Güncelleme:** 2026-03-02
## Proje Durumu: v6.0.0 (Zaman Savaşı Modu & Yeni İsimler)
- **Feature (v6.0.0)**: Oyun modları için YENİ isimler belirlendi:
- **Feature (v7.0.0)**: **Ultra Esnek Etkinlik Sistemi (v7.0.0):**
    - Periyodik (Haftalık vb.) ve Manuel (2 saatlik vb.) etkinlik desteği.
    - Mod kısıtlaması (Sadece Arcade veya TimeBattle puanları geçerli olabilir).
    - Dereceye göre (Rank-based) esnek ödül sistemi (Altın, Bomba, vb.).
    - Admin Panel (`wordlengenext`) üzerinden tam yönetim (CRUD).
    - Mobil Uygulama (`kelime-crush`) Dashboard entegrasyonu (Aktif Etkinlik Banner & Detay).
    - Otomatik puan senkronizasyonu (Oyun sonu servis tetikleme).

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
- **Android APK (Capacitor)**: Projeye CapacitorJS eklendi ve Android platform kurulumu yapıldı. ProGuard optımızasyon hatası çözüldü.
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

## 🚀 Önemli Gelişmeler & Kararlar

### 1. Ayarlar & Ses Kontrolü (Phase 6.5 - v3.1)
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
- [Admin] Seviye yönetimi sidebar'dan yoruma alınarak kaldırıldı.
- **Günlük Görevler (Daily Missions):** Sidebar üzerindeki kilitli buton aktif edilecek ve ödüllü dinamik görevler eklenecek.
- **Seviye Editörü:** Kullanıcıların kendi seviyelerini tasarlayabileceği bir modül.
- **Topluluk:** Arkadaş ekleme, düello modu ve klan sistemleri.
- **Günlük Çark (Daily Spin):** Kullanıcıların günde 1 kez çevirerek sürpriz ödüller kazanabileceği şans çarkı mekanizması (Not: Mevcut basit günlük ödül mantığının yerine entegre edilebilir; ikili ödül enflasyonu yaratmaması hedefleniyor).
- **Hedef Puan ve Kısıtlamalar (v7.0.1):** Etkinlik şemasına (`target_score`, `duration_limit`, `moves_limit`) parametreleri eklendi. Kelime-crush App.jsx içerisindeki sabit (hardcoded) 60sn/30 hamle sınırları dinamik hale getirildi. İlgili kısıtlamalar "0" olarak girildiğinde o sınır kaldırılacak şekilde esnek (hibrit sayaç) mimarisine kavuşturuldu.
- **Katılım Anında Liderlik Listelenmesi:** Etkinlik başlatılırken (join_event) `updateEventScore` ile asenkron olarak "0" puan gönderilerek kullanıcıların etkinlik tablosunda anında görünmesi sağlandı.

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
