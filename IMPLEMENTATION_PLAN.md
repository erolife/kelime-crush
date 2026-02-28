# Globalleşme ve Sosyal Özellikler (Phase 5)

Bu plan, WORDLENGE oyununun global pazara açılması için gereken dil desteği ve oyuncular arası rekabeti artıracak liderlik tablosu özelliklerini tanımlar.

## Kullanıcı İncelemesi Gerekenler
> [!IMPORTANT]
> - İngilizce sözlük için başlangıçta en sık kullanılan 10.000 kelimelik bir liste kullanılacaktır.
> - Liderlik tablosu "Toplam Altın" ve "En Yüksek Seviye" olmak üzere iki kategoride olacaktır.

## Önerilen Mimari

### 1. Çoklu Dil Desteği (Localization)
- Arayüzdeki tüm metinler (Menu, Dashboard, Modals) bir `Translations.js` dosyasından yönetilecek.
- Dil seçimi (`language` state) hem yerelde hem de kullanıcı profilinde saklanacak.
- Sözlük dosyaları dile göre dinamik yüklenecek (`sozluk.json` vs `sozluk_en.json`).

### 2. Global Liderlik Tablosu (Leaderboard)
- Supabase üzerinde `profiles` tablosuna dayalı bir `leaderboard` view oluşturulacak.
- İlk 100 oyuncu anlık olarak listelenecek.
- Oyuncunun kendi sıralaması vurgulanacak.

## Uygulama Adımları

1.  **UI Localization:** Tüm statik metinlerin `translations` objesine taşınması ve dile duyarlı hale getirilmesi. [TAMAMLANDI]
2.  **English Dictionary:** `public/sozluk_en.json` dosyasının oluşturulması. [TAMAMLANDI]
3.  **Language Toggle:** Dashboard'a dil seçici ikonunun eklenmesi. [TAMAMLANDI]
4.  **SQL Migrations:** 
    - `profiles` tablosuna `language` (TEXT) sütunu eklenecek.
    - `leaderboard_view` oluşturulacak (En yüksek altın ve seviyeye göre sıralama).
### [Phase 8] Social Boost & Realtime Interaction (v4.1)
Bu aşama, oyuna canlı bir topluluk hissi katmak için Supabase Realtime altyapısını kullanır.

#### [MODIFY] [App.jsx](file:///Users/webnolojik/antigravity/kelime-crush/mobile-app/src/App.jsx)
- `SocialToast` bileşeni eklenecek (sağ alt köşe bildirimi).
- Supabase Realtime "Broadcast" kanalı aboneliği kurulacak.
- Uzun kelime (6+ harf) algılandığında mesaj yayınlama mantığı eklenecek.

#### [MODIFY] [useGame.js](file:///Users/webnolojik/antigravity/kelime-crush/mobile-app/src/hooks/useGame.js)
- Kelime onay mekanizmasına `onLongWordFound` callback desteği eklenecek.

5.  **Service Layer:** `SupabaseService.js` içine `getLeaderboard` fonksiyonu eklenecek.
6.  **Leaderboard UI:** Dashboard üzerinde "Dünya Sıralaması" (Trophy ikonlu) butonunun ve modalının eklenmesi.

## Verification Plan

### Automated Tests
- `npm run dev` ile yerel sunucunun ayağa kalktığının doğrulanması.
- Konsol üzerinden "isSettingsOpen is not defined" hatasının çözüldüğünün teyidi.
- Gerçek zamanlı mesaj akışının (Broadcast) iki farklı pencere üzerinden manuel testi.
- Dil değiştirildiğinde tüm UI'ın anında güncellendiği görülecek.
- Farklı bir hesapla girildiğinde liderlik tablosundaki sıralamanın doğru yansıdığı test edilecek.

---

# Dashboard Sidebar & Layout (Phase 6)

Bu plan, ana menünün (Dashboard) daha kompakt bir hale getirilmesi ve sağ tarafa oyuncunun durumunu anlık görebileceği bir yan panel eklenmesini kapsar.

## Önerilen Değişiklikler

### 1. Dashboard Layout Reformu
- **Grid Sistemi:** Mevcut 2 sütunlu yapı `lg:grid-cols-3` (2 birim modlar, 1 birim sidebar) veya yan yana esnek bir yapıya dönüştürülecek.
- **Mod Kartları:** ARCADE ve MISSION kartlarının genişliği optimize edilerek Sidebar için yer açılacak. Mobilde buton yükseklikleri `h-64`'ten `h-44`'e düşürülerek ekran alanı verimli kullanılacak.
- **Kaydırma (Scrolling):** Dashboard ana içeriği mobilde taşmaları önlemek için dikey kaydırılabilir (`overflow-y-auto`) hale getirilecek.

### 2. Sidebar Bileşenleri
- **Global Rank Butonu:** Mevcut liderlik tablosunu açan kompakt bir rank göstergesi ve buton.
- **Daily Reward Status:** Güncel seri (streak) durumunu gösteren ve hediye modalını açan buton.
- **Inventory (Envanter):** Altın miktarı ve sahip olunan yardımcı araçların (Bomba, Değişim vb.) sayısal dökümü.
- **Daily Missions Butonu:** Yakında eklenecek olan ödüllü günlük görevler için erişim noktası.

## Uygulama Adımları
1.  **Layout Update:** Dashboard ana konteynerinin düzenlenmesi.
2.  **Sidebar Core:** Yan panelin görsel tasarımı ve premium stillerinin uygulanması.
3.  **Inventory Component:** useGame verilerinin Sidebar'a bağlanması.
4.  **Action Buttons:** Sıralama ve günlük ödül tetikleyicilerinin sidebar'a entegrasyonu.
5.  **Mobile Polish:** Mobildeki taşma, scrolling ve boyutlandırma sorunlarının giderilmesi. [TAMAMLANDI]
6.  **Ultra-Compact Revision (v2.8):** Redundant butonların kaldırılması ve her şeyin tek ekrana sığdırılması.

---

# Dashboard Ultra-Compact Revizyonu (Phase 6.2 - v2.8)

Bu plan, Dashboard'un her cihazda kaydırma gerektirmeden tek ekrana sığmasını ve daha odaklı bir deneyim sunmasını hedefler.

## Önerilen Değişiklikler
- **Header Cleanup:** Header kısmındaki redundant Trophy butonu kaldırılacak (Sidebar'da mevcut).
- **Minimal Mod Kartları:** ARCADE ve MISSION kartları, mobilde `h-28` gibi ultra-kompakt bir yüksekliğe indirilecek. Gereksiz metinler kaldırılacak.
- **Dikey Yerleşim:** Modlar üst üste, Sidebar ise onların altına veya yanına kaydırma gerektirmeyecek şekilde yerleştirilecek.
- **Visuals:** Kartlardaki icon boyutları ve padding değerleri mobil için optimize edilecek. [TAMAMLANDI]

---

# Dashboard Sidebar Konumlandırma (Phase 6.3 - v2.9)

Bu plan, Sidebar'ın her zaman sağ tarafta kalmasını ve mod kartlarının genişliklerinin azaltılmasını hedefler.

## Önerilen Değişiklikler
- **Side-by-Side Layout:** Mobilde `flex-col` yerine `flex-row` düzenine geçilerek Sidebar sağ tarafa çekilecek.
- **Narrow Mod Cards:** ARCADE ve MISSION kartlarının genişliği (`w-full` yerine `w-[32%]` veya grid bazlı) azaltılacak.
- **Right Column Focus:** Sağ taraf tamamen yeni eklenecek bölümler ve Sidebar için ayrılacak.
- **UI Scaling:** Metin ve ikon boyutları daralan alanlara göre ölçeklenecek. [TAMAMLANDI]

---

# Dashboard Konsolidasyonu (Phase 6.4 - v3.0)

Bu plan, Dashboard'u en üst düzey kompaktlığa ve işlevselliğe ulaştırır.

## Önerilen Değişiklikler
- **Inventory Modal:** Envanter artık sidebar'da yer kaplamayacak, bir buton ile modal olarak açılacak (Altınlar dahil).
- **Sidebar Consolidation:** Stats başlığı Rank bilgisi ile değiştirilecek. Rank ve Envanter butonu tek satıra çekilecek.
- **Daily Buttons:** Günlük Hediye ve Görevler yan yana (`grid-cols-2`) yerleştirilecek. [TAMAMLANDI]
- **Gapless Grid:** Mod kartları (Arcade/Levels) arasındaki boşluk (`gap`) kaldırılacak. [TAMAMLANDI]

---

# Ayarlar Butonu Restorasyonu (Phase 6.5 - v3.1)

Dashboard Header'ında kaybolan Ayarlar (ses/zorluk) butonunun geri getirilmesi. [TAMAMLANDI]

## Önerilen Değişiklikler
- **Header Settings Button:** Dil seçicinin yanına Settings2 ikonu ile modalı açan butonun eklenmesi.
- **Prop Injection:** `onOpenSettings` prop'unun `Dashboard` bileşenine aktarılması.

---

# Görünüm Tabanlı Navigasyon Dönüşümü (Phase 7 - v4.0)

Modalları tamamen kaldırıp (bildirimler hariç), Dashboard içeriğini tam ekran görünümleri (views) ile yönetmek.

## Önerilen Değişiklikler
- **Navigation State:** `Dashboard` içindeki `view` state'inin genişletilmesi (`modes`, `levels`, `inventory`, `leaderboard`, `daily`, `settings`).
- **Full-Screen Refactor:** 
    - `InventoryModal` -> `InventoryView`
    - `LeaderboardModal` -> `LeaderboardView`
    - `Settings Modal` -> `SettingsView`
    - `Daily Reward Overlay` -> `DailyView`
- **Dashboard UI Update:** Sidebar butonlarının modal açmak yerine `setView()` fonksiyonunu tetiklemesi.
- **Visual Polish:** Ekran geçişleri için modern animasyonlar ve sayfa arası "Back" butonlarının eklenmesi.

## Modalların Yeni Rolü
Bu aşamadan itibaren modallar sadece şu durumlarda kullanılacaktır:
- Oyun Sonu Metriği (Kazanma/Kaybetme)
- Kritik Hata/Uyarı Bildirimleri
- Onay gerektiren işlemler (Silme vb.)
