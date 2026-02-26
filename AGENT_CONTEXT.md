# Agent Context
- **Proje:** Kelime Crush (Vanilla JS tek dosyalık HTML5 Canvas oyunu)
- **Tarih:** 26 Şubat 2026
- **Son Durum:** Oyunun mobil dönüşümü React + Vite + Canvas tabanlı "Premium" motorla tamamlandı. Tüm orijinal isterler ve kullanıcı geri bildirimleri optimize edildi.

## Yapılan Geliştirmeler:
- **26 Şubat 2026**: Proje `mobile-app/` klasörüne taşındı. Eski dosyalar `yedek/v1/` içinde toplandı.
- **27 Şubat 2026 (Faz 1.5 - Geliştirmeler)**:
    - **Oyun Akışı (Game Over):** Hamle sayısı 0 olduğunda oyun duruyor ve bulunan kelimelerin özeti (skor, adet, uzunluk) şık bir modal ile gösteriliyor.
    - **Yeniden Başlatma:** Sonuç ekranında oyunu mevcut zorlukta sıfırlama seçeneği eklendi.
    - **Bomba Görselliği:** Özel hücreler (Bomb, Row/Col Blast) için Canvas üzerinde "Pulsing" (Nabız) animasyonu ve dinamik gölge efekti eklendi. Bombanın pulsing efekti kullanıcı isteği üzerine büyütüldü ve hızlandırıldı.
    - **Yer Çekimi & Zıplama:** Harfler artık boşluklara yer çekimi ivmesiyle düşüyor ve yere değdiklerinde hafif bir zıplama (bounce) efekti sergiliyor. Yeni harfler ekranın üstünden (off-screen) düşerek gride giriş yapıyor. Animasyon hızı artırıldı (~0.3s) ve düşüş sırasında "fade-in" efekti eklendi. Düşen hücrelerdeki hatalı küçülme efekti düzeltildi.
    - **Hücre Takibi:** Her hücreye benzersiz `id` eklendi, böylece yer değişseler dahi görsel olarak takip edilebiliyorlar.
    - **UI Optimizasyonu:** `useGame` hook'u `gameState` durumunu ('playing', 'gameover') yönetecek şekilde güncellendi.
    - **Hata Giderimi (Takas Aracı):** Takas aracının çalışmamasına sebep olan bağımlılık hilesi (stale closure) giderildi. Seçilen ilk hücrenin Canvas üzerinde vurgulanması (vurgu rengi: amber) sağlandı.
    - **Gerçek Karıştırma (Shuffle):** Karıştırma işlemi artık gridi sıfırlamak yerine mevcut harflerin ve özel hücrelerin yerlerini Fisher-Yates algoritması ile karıştırıyor.
- **Dinamik Grid & Zorluk:** 
    - Kolay: 12x12 grid (Vowel Bonus: 2.0x)
    - Normal: 10x10 grid (Vowel Bonus: 1.0x)
    - Profesör: 8x8 grid (Vowel Bonus: 0.5x)
- **Harf Puanları:** `Constants.js` içerisindeki `LETTER_POINTS` değerleri her harf karesinin sağ alt köşesine eklendi.
- **Bomba Mekaniği:** 
    - 4 harf -> Satır/Sütun patlatıcı.
    - 5+ harf -> Bomba.
    - Tek tıkla patlatma: Seçim 1 iken bomba/blast hücresine tıklanırsa 1 Move bedeliyle anında tetikleniyor.
- **Türkçe Karakter Fix (v2):** Manuel `safeTurkishUpper` (i->İ, ı->I) mapping ile %100 uyumlu sözlük eşleşmesi sağlandı.
- **Dokunmatik & Çapraz Geçiş Optimizasyonu:** `PremiumCanvas.jsx`'te "Circular Hit Detection" (Radius: 38%) uygulandı. Harfler arası dikey/çapraz geçiş koridoru genişletildi.
- **Animasyon Sistemi:** `animatingCells` ile harf eşleşmesi ve patlamalarda "Poof" parçacık efekti ve küçülme animasyonu eklendi.
- **Hata Onarımı:** Canvas parçacık sistemindeki negatif radius (`IndexSizeError`) hatası giderildi.
- **Ses & Görsel:** `SoundManager.js` ile orijinal sesler entegre edildi. 6+ harf kelimelerde konfeti efekti aktif.
- **Kelime Analizi Gruplandırma:** Bulunan kelimeler uzunluklarına göre ("3 Harfliler", "4 Harfliler" vb.) kategorize edildi. Kelime geçmişi limiti 50'ye çıkarıldı.

## Gelecek Planlar (Roadmap) - 2. Faz 🚀
- **İngilizce Dil Desteği:** Oyun içi dinamik dil seçeneği (TR/EN) ve global sözlük (`english_words.json`) entegrasyonu.
- **Veritabanı Entegrasyonu:** Supabase/Firebase bağlantısı ile kullanıcı profili ve kalıcı skor yönetimi.
- **Görev & Challenge Sistemi:** Günlük görevler, özel meydan okumalar (Level tabanlı) ve ödül mekanizması.
- **Turnuva Sistemi:** Global liderlik tabloları ve rekabetçi sezonlar.

## Teknik Notlar (Premium Canvas):
- **Sizing:** `aspect-square` CSS ve `ResizeObserver` kombinasyonu ile %100 responsive kare oyun alanı sağlandı.
- **Performans:** HTML5 Canvas API ile +60 FPS akıcılık.
- **Visuals:** Hücrelerde dairesel hit detection (Radius: 38%) ve "Poof" animasyonu ile yüksek dokunmatik konfor.
