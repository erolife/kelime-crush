## Proje: Kelime Crush (Mobile App)

### 06.03.2026 - Stabilite ve Layout İyileştirmeleri
- **App.jsx Stabilizasyonu:** `renderView` fonksiyonu içindeki `case` blokları `{}` ile sarmalanarak JSX parantez hataları ve çökme sorunları giderildi.
- **Layout Optimizasyonu:** `DailyMissions.jsx` ve `App.jsx` içerisindeki ana görünümler (Market, Ayarlar, Profil) `flex-1` ve `min-h-0` yapısına geçirilerek dikey alan kullanımı ve kaydırma performansı artırıldı.
- **Hata Giderme:** `DailyMissions.jsx` üzerindeki `isMobile` referans hatası ve `App.jsx` üzerindeki yazım hataları düzeltildi.
- **Hesap Silme:** Google Play politikaları gereği profil ekranına "Hesabı Sil" özelliği ve Supabase entegrasyonu eklendi.

### 04.03.2026 - UI ve Güvenlik İyileştirmeleri
- **UI & Balancing:** Header'daki profil badge'inden "Lvl" ön eki kaldırıldı. XP kazanımı ve seviye atlama hızı (getNextLevelXp) makul seviyelere çekilerek oyun dengelendi.
- **Güvenlik:** Sistem analizi raporu doğrultusunda "Try Again" enerji sızıntısı giderildi ve misafir kullanıcı enerji tüketimi düzeltildi.

### 03.03.2026 - Etkinlik Sistemi ve Oyun Döngüsü İyileştirmeleri
- **Yapılan İşlem:** Etkinlik sistemindeki kritik hatalar giderildi ve yeni özellikler eklendi.
- **Değiştirilen Dosyalar:**
    - `src/App.jsx`: UI iyileştirmeleri, ödül filtreleme mantığı (`flattenItems`), katılımcı sayısı gösterimi ve kalan süre hesaplama.
    - `src/hooks/useGame.js`: Etkinlik oyun döngüsü (hamle/süre limiti), `currentEventId` takibi ve skor kaydı senkronizasyonu.
- **Geliştirme:** Alt navigasyon yenilendi, merkezi buton "Sıralama/Etkinlikler" olarak güncellendi.
- **Geliştirme:** Sıralama (Leaderboard) sistemi "Global", "Macera" ve "Zaman Arenası" olarak modlara ayrıldı.
- **Geliştirme:** Profil ekranına "Düzenle" modu gelerek yaş, konum, cinsiyet, biyo ve avatar URL alanları eklendi.
- **Hotfix:** Market ekranında `language` değişkeninin tanımlanmaması nedeniyle oluşan "blank screen" hatası düzeltildi.
- **Neden Yapıldı:** 
    - Etkinlik ödülleri `[object Object]` şeklinde görünüyordu.
    - Etkinlik oyunları bitmiyor ve skorlar bazen kaydedilmiyordu.
    - Periyodik etkinlikler (haftalık) veritabanında sabit tarih olmadığı için "BİTTİ" görünüyordu.
- **Önemli Notlar:** 
    - Periyodik etkinlikler haftalık döngüye göre (start_day, end_day) dinamik olarak hesaplanır.
    - Etkinliklerde hamle sınırı standart olarak 30 olarak belirlendi.
### 08.03.2026 - Alt Navigasyon Refaktörü ve Yazar Modu Geliştirmeleri (v15.0.0)
- **Alt Navigasyon (Footer) Refaktörü:** Mobil navigasyon barı `App.jsx` seviyesinde kalıcı (persistent) hale getirildi. `z-[1000]` ve `fixed` pozisyonu ile modal görünümlerin üzerinde kalması sağlandı.
- **Redundant Buton Temizliği:** Mobil cihazlarda Footer kalıcı olduğu için Market, Profil, Sıralama, Envanter ve Ayarlar ekranındaki gereksiz "X" kapatma butonları gizlendi.
- **Yazar Modu & Enerji (v14.x):** 
    - Merkezi enerji tüketim sistemi (`consumeEnergy`) kuruldu.
    - AI Hikaye oluşturma süreci Gemini 1.5 Flash ile güncellendi ve hata yakalama mekanizmaları güçlendirildi.
    - Yazar modu oyun seansı hedefleri (4, 5, 6+ harfli kelime sayıları) ve bitiş animasyonları eklendi.
- **Neden Yapıldı:** Navigasyonun dashboard genelinde tutarsız olması ve kullanıcıların alt görünümlerden çıkmakta zorlanması nedeniyle refaktör yapıldı. Yazar modu ve enerji hataları ise oyun ekonomisi ve stabilite için giderildi.
