# AGENT_CONTEXT

## Proje: Kelime Crush (Mobile App)

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
