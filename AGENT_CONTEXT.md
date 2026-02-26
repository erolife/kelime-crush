# Agent Context
- **Proje:** Kelime Crush (Vanilla JS tek dosyalık HTML5 Canvas oyunu)
- **Tarih:** 26 Şubat 2026
- **Son Durum:** Oyunun ilk sürümü index.html dosyasına yazıldı. Proje kuralları (8x8 grid, Türkçe harfler, harf ağırlıkları, skor/level gibi özellikler) gereği Canvas içerisinde interaktif logic oluşturuldu.
- **Kullanılan Teknolojiler:** HTML, CSS, Vanilla JS, Canvas API

## Yapılan Geliştirmeler:
- `AGENT_CONTEXT.md` dosyasının, kullanıcı kuralları (user_rules 1 ve 3) gereği oturum başında kontrol edilip oluşturulması sağlandı.
- Ağırlıklı (sesli harflerin daha sık çıktığı) rastgele harf seçme algoritması uygulandı.
- Canvas üzerinde grid ve seçim işlemi (mouse drag/drop ile) gerçekleştirildi.
- Alt kısımda belirtilen `Shuffle` butonu tasarlandı ve eklendi.
- **26 Şubat 2026**: Harf oranları (A, E, İ vb.) artırıldı, kolaylık sağlandı, kelimelerin sözlük zorunluluğu esnetilerek geçersiz ama kurala uyan kelimelere 'Teselli Puanı' verildi. Başlangıç hamlesi 20'den 40'a çıkarıldı.
- **26 Şubat 2026**: JS LowerCase dönüşümündeki `tr-TR` uyumsuzluğu nedeniyle doğru yazılan Türkçe kelimelerin bulunamama sorunu giderildi, test için Console'a log eklendi.
- **26 Şubat 2026**: Izgara (Grid) boyutu 8x8'den 10x10'a çıkarıldı. Bu sayede ekrandaki harf sayısı artırılarak oyuncunun kelime bulma ihtimali yükseltildi ve oyun daha zevkli/kolay hale getirildi.
- **26 Şubat 2026**: Sözlükteki 'abluka altında tutmak' veya kesme işaretli karakter barındırıp grid içerisindeki sadece harflerin eşleşmesinin mümkün olmadığı 8000 adetlik kelime listesi, boşluk, sayı gibi harf olmayan tüm içeriklerden arındırıldı. Kelimeler yeniden oluşturuldu.
- **26 Şubat 2026**: Sözlükteki birleşik kelime ve TDK uyuşmazlığından ötürü, kullanıcının ilettiği https://gist.githubusercontent.com/f/31ce39df408bebd30774458ff09d3d56/raw/c1c3c32a5a9a9965108998a7c7466088ba741813/kelimeler.json URL'sine sahip sözlük jsonu indirilerek sadece harften oluşan 8000 kelimelik bir liste ile değiştirildi.
- **26 Şubat 2026**: Türkçe karakterlerin (i, İ, ı, I, Ç, ş vs.) tarayıcılar arasındaki farklı yorumlanma riskini (riya, mazi, çam sorunları) sıfıra indirmek için tüm sistem **Büyük Harf (Uppercase)** eşleşmesine geçirildi. Sözlük () artık 60.000+ kelimeyi Büyük Harf olarak barındırıyor ve ızgaradaki büyük harflerle doğrudan, hatasız eşleşiyor.
- **26 Şubat 2026**: Satır/Sütun ve Bomba patlatma (özel yetenekler) sırasında oluşan sonsuz döngü ve tarayıcı çökme sorunu giderildi. `triggerSpecialCell` fonksiyonunda senkron işaretleme mantığına geçildi ve partikül efektleri performans için optimize edildi.
- **26 Şubat 2026**: DB Altyapısı ve Mobil Yol Haritası belirlendi. `proje_schema.sql` oluşturuldu. `users`, `scores`, `tournaments` ve `tournament_entries` tabloları tanımlandı.
- **26 Şubat 2026**: Oyun **Responsive** hale getirildi. Mobil ve tablet cihazlar için Media Query'ler eklendi, yan panel dikey düzene (column layout) uyumlu hale getirildi ve dokunmatik kontroller optimize edildi.
- **26 Şubat 2026**: Yardımcı araçlar (swap, blast) yan panelden alınarak oyun alanının altına (**footer**) dairesel butonlar olarak taşındı. Bu sayede mobil cihazlarda ve dar ekranlarda kullanım kolaylığı sağlandı, oyuncunun oyundan kopmadan araç seçebilmesi sağlandı.
- **26 Şubat 2026**: Mobil cihazlarda sayfa yenilendiğinde sesin çıkmama sorunu (Autoplay Policy) giderildi. Sayfadaki ilk etkileşimde ses motoru otomatik olarak uyandırılıyor.
- **26 Şubat 2026**: Yardımcı araçların konumu ekran boyutuna göre ayrıştırıldı. Masaüstünde oyun alanı içinde doğal akışta, mobilde ise ekranın altında sabit (`fixed`) olarak kalması sağlandı. `backdrop-filter` kaynaklı `fixed` sorunu `::before` pseudo-elementi ile çözüldü.
- **26 Şubat 2026**: Yeni yardımcı araç **"Yılan" (Snake)** eklendi. Yeşil temalı bu araç, grid kolon sayısı kadar birbirine komşu (her yöne) harfi serbestçe seçip patlatma imkanı sunuyor.
- **26 Şubat 2026**: 5 aracın dar mobil ekranlarda sağa taşma sorunu giderildi. Kademeli `gap` azaltma ve 400px altı ekranlar için ultra-küçük buton ayarları yapıldı.
- **26 Şubat 2026**: Oyunun yüklenememesi hatası (`TypeError: addEventListener on null`) giderildi. HTML elemanlarının script'ten önce tanımlanması sağlandı ve araç butonları için null-safe kontroller eklendi. CSS media query sözdizimi hataları temizlendi.
- **26 Şubat 2026**: 403 Forbidden hatası veren Mixkit ses dosyaları yerine kullanıcı tarafından sağlanan yerel ses dosyaları (`sesler/`) entegre edildi. Yılan Seçimi (`snake.mp3`), Yılan Patlama (`snake-patlama.mp3`), Bomba Patlama (`kucuk-patlama.mp3`), Tek Harf Patlama (`tek-patlama.mp3`), Harf Değiştirme (`switch.mp3`) ve Satır/Sütun Patlama (`row-colun.mp3`) sesleri ilgili aksiyonlara özelleştirildi.
- **26 Şubat 2026**: Arka plan müziği (`background.mp3`) sisteme dahil edildi ve ilk etkileşimle başlaması sağlandı. Sürükleme sesi kullanıcıyı yormayacak şekilde optimize edildi.
- **26 Şubat 2026**: Yılan aracı kullanıldıktan sonra harflerin düşmeme sorunu `finishSnake` içinde `applyGravity` çağrılarak giderildi.
- **26 Şubat 2026**: Yer değiştirme (Swap) aracının iki aşamalı seçim mantığı (ilk seçim vurgulama, ikinci seçim takas) uygulanarak işlevselliği onarıldı.
- **26 Şubat 2026**: Oyuna çapraz (diagonal) harf seçme desteği tam olarak entegre edildi/doğrulandı.
- **26 Şubat 2026**: İngilizce oyun sürümü hazırlığı kapsamında `dwyl/english-words` kaynağından 3 harf ve üzeri 369.647 kelime filtrelenerek `english_words.json` dosyasına yedeklendi.
- **26 Şubat 2026**: Ses motoru (`SoundManager`) sınıfı ve araç çubuğu (`updateToolsUI`) mantığı baştan yazılarak kararlı hale getirildi.

## Gelecek Planlar (Roadmap)
- **Turnuva Sistemi**: Belirli zaman aralıklarında rekabetçi liderlik tabloları.
- **Veritabanı Entegrasyonu**: Kullanıcı profili, enerji sistemi ve kalıcı skor yönetimi.
- **Zamana Karşı Yarış**: Hız gerektiren yeni oyun modu (Challenge Mode).
- **Mobil Market**: Android/iOS için paketleme ve mağaza hazırlığı.
