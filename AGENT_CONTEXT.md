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

## Gelecek Planlar (Roadmap)
- **Turnuva Sistemi**: Belirli zaman aralıklarında rekabetçi liderlik tabloları.
- **Veritabanı Entegrasyonu**: Kullanıcı profili, enerji sistemi ve kalıcı skor yönetimi.
- **Zamana Karşı Yarış**: Hız gerektiren yeni oyun modu (Challenge Mode).
- **Mobil Market**: Android/iOS için paketleme ve mağaza hazırlığı.
