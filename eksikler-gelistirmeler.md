**YAPILDI** Hamle sayısı bitince oyunun uyarı vermesi gerekiyor.
Oyunca hamle sayısının olmasının nasıl bir mantığı var?
    Hamle sayısı bittiğinde belli bir puan almış olması mı gerekiyor sonraki oyuna geçebilmesi için?
    Belli bir görevi tamamlaması mı gerekiyor?
Oyun başlarken bir yardımcı aracın da oyuna dahil olarak başlaması nasıl olur?
**YAPILDI** Bombalar çok belirgin değil nasıl daha belirgin yapılabilir? 
**YAPILDI** Oyun tamamlandığında genel bir analiz modal olarak görüntülenebilir. 
    **YAPILDI** oluşturduğu kelimeler (harf sayısına göre gruplanmış)
    Aynı seviyeyi kaç kişinin oynadığı ve ortalama kaç hamlede tamamladığı bilgisi verilebilir mi?


Oyuna nasıl görevler eklenebilir?
    Belirli sayıda belirli bir harfi kullanmak zorunluluğu olabilir?
    Belirli sayıda harften oluşan bir ya da belirtilmiş sayıda kelime oluşturulması olabilir mi?
    Belirlenen sayıda bomba patlatma görevi olabilir mi?
    
Görev tamamlandığında oyuncu ödül olarak ne alır?
    Puan?, oyun parası? (Oyunda araç satın almak için kullanılabilir), Bomba, oyun (enerji) hakkı?

GÜnlük olarak oyuna girmeye teşvik edecek bir yapı oluşturulmalı mı?
    Her gün girdiğinde günlük ödül (Bazen oyun parası, bazen bomba, bazen ek hamle hakkı)


Oyun için bir dashboard oluşturulmalı mı? 
    Görev listesi
    Inventory
    Geçmiş oyunları
    Oyuncu top list 
    Turnuva listesi
    Toplam oyuncu sayısı
    Anlık oyuncu sayısı
    vb...    

Oyun Paraları nasıl kullanılır
    Turnuvalara katılmak için
    bomba satın almak
    ekstra hamle hakkı satın almak

Farklı kelime bazlı oyunlar oluşturulabilir mi?




**İlerleyen zaman için etkileşim beyin fırtınası düşünceleri.**
1. Bir oyuncu belirlediğimiz sayıda harften fazla harf kullanarak geçerli bir kelime oluşturduğunda oyun oynayanların görebileceği bir toast mesaj ekranın sağ alt kısmında çıkabilir mi? Oyuncular tebriklerini (bir kalp gibi) göndermek için tıklayabilirler. Bu etkileşimi üst sınıra çıkarabilir ve oyuncuların oyunu oynama konusundaki iştahlarını kabartabilir mi acaba?

2. **Yapay Zeka Destekli "Mini Hikaye" Oluşturucu (Viral Paylaşım Mekaniği)**
   - Oyuncunun oyun içerisinde bulduğu en özel/uzun kelimeler kullanılarak oyun sonunda AI yardımıyla absürt, fantastik veya komik mikro hikayeler (2-3 cümlelik) oluşturulması.
   - Örn: "Bugün Karanlık **ORMAN**da yürürken aniden bir **KAPLAN** belirdi. Cebimdeki **AYNA**yı çıkarıp ona tuttuğumda..."
   - Bu hikayenin şık bir "Polaroid / Kitap Sayfası" kartında gösterilip sosyal medyada (Instagram, Twitter) direkt paylaşılabilmesinin sağlanması.
   - **Yeni Oyun Modu (Hibrit Sistem):** Bu özellik hem oyun içi organik bir ödül, hem de ayrı bir oyun modu olarak kurgulanacaktır.
     - **Dashboard Modu:** Ana menüde sürekli görünen ancak sadece 5. seviye ve üzeri oyuncuların erişebileceği (kilitli) özel bir "Yazar Modu" kartı eklenecektir.
     - **Oyun İçi Sürpriz:** Oyuncu 5. seviye ve üzerindeyse, normal oyunlardan (Arcade, Zen vb.) herhangi birinde **en az 5 tane, 4 veya daha fazla harften oluşan kelime** üretirse ekranda bir bildirim belirecek ("Yazar Modu tetiklendi!") ve oyun bitiminde hikaye seçim ekranı otomatik olarak açılacaktır. Öğrenci bu ekranda hikaye temasını (romantik, komik, gerilim vb.) seçecek ve yapay zeka bu kelimelerle ona özel bir hikaye oluşturacaktır.
     - **Hikaye Özellikleri ve Ekonomisi:** Oyuncu açılan ekranda hikayenin uzunluğunu (Kısa/Uzun) seçebilecek. Uzun hikayeler için altın harcanacak (Pro üyeler için ücretsiz/sınırsız). Hikayelerde oyuncunun adı/profili başrolde olacak şekilde özelleştirilmiş *prompt* kullanılacak. Çıktı formatı JSON olacak (başlık, içerik, emoji, hashtag).
     - **Sosyal Etkileşim:** Üretilen hikayeler landing page'de veya oyun içi topluluk sekmesinde yayınlandığında oyuncular tarafından **beğenilebilecek (Like mekanizması)**. Yapay zeka kalitesi için OpenAI (GPT-4o-Mini) veya Google Gemini (1.5 Flash) gibi hem kaliteli hem de yapılandırılmış (JSON) çıktı verebilen modeller kullanılacak.

3. **[YAPILDI] OYUN MODU TANITIMLARI**
   - [ENTEGRASYON BAŞLANDI] Dashboarddaki oyun mod kartlarının köşelerine birer info iconu eklenir. bu ikona basıldığında bir modal içerisinde oyunun nasıl oynandığı ve amacı oyuncuya sunulabilir.





   
**MOBIL DENEYIM SORUNLARI**
Mobil cihazda sayfalar ekrana sığmıyor. header çok yer kapladığı için açılan ekrandan dashboarda dönüş yapılamıyor. Bu konuda bir çözüm geliştirilmesi lazım. Mobil kullanıcı deneyimi çok önemli. Oyun oynama ekranlarında headeri gizleyip oyun bittiğinde tekrar görünür hale getirmek gibi bir çözüm düşünülebilir. Süreç içerisinde web uygulamasını mobil bir oyun uygulamasına dönüştüreceğiz bu sorunları çözmeden yapamayız. Ya mobil için ayrı bir aryüz ayarlayacağız ya da bu tasarımı mobil uyumlu hale getireceğiz.  






**---------------**

Gelelim ikon meselesine; Android Studio'da uygulama ikonunu (Launcher Icon) saniyeler içinde ve tüm cihaz ekranları için uyumlu şekilde, hiç zorlanmadan şöyle değiştirebilirsin:

Android Studio'yu aç ve projenin yüklendiğinden emin ol.
Sol taraftaki proje dosyaları ağacında (Project paneli) app klasörüne sağ tıkla.
Açılan menüden New > Image Asset seçeneğine tıkla.
Ekrana "Asset Studio" adında bir araç gelecektir:
Icon Type: Launcher Icons (Adaptive and Legacy) seçili kalmalı.
Name: ic_launcher aynen kalmalı.
Source Asset: kısmındaki minik Klasör/Path ikonuna tıklayıp, projedeki senin kendi public/logo.png dosyanın bilgisayardaki tam dizinini bulup seç.
Görselini seçtikten sonra alttaki "Resize" (Ölçek) kaydırıcısı ile logonu Android'in yeşil ızgaraları ve sınır çizgileri içerisinde taşmayacak şekilde boyutlandır.
(İsteğe Bağlı) Aynı sayfanın üst tarafında "Background Layer" sekmesine geçip logonun arkasındaki rengi (Siyah, Beyaz veya Hex koduyla) belirleyebilirsin.
Son olarak sağ alttan Next ve sonra gelen ekrandan Finish'e bas.
İşte bu kadar! Android Studio cihazın hem eski versiyonları (kare/yuvarlak) hem de yeni versiyonları (adaptive) için logoyu onlarca klasöre otomatik olarak çizip kesti bile. Tekrar build aldığında Wordlenge logon cihazında göz alıcı duracaktır. 🪄



### 🔔 Oyuncu Bildirim Sistemi (Push & Local)
- [ ] **Push Bildirimler (Firebase FCM):** Etkinlik başlangıç/bitiş duyuruları ve global mesajlar.
- [ ] **Firebase Entegrasyonu:** Android ve iOS için gerekli sertifikaların ve kütüphanelerin kurulumu.
- [ ] **Supabase Edge Functions:** Sunucu tarafında etkinlik takibi ve bildirim tetikleyici mekanizmaların kurulması.

- [ ] **Footer Navigasyon İyileştirmesi:**
    - Alt menünün oyun ekranı hariç (Market, Profil, Etkinlik vb.) tüm dashboard görünümlerinde kalıcı olması sağlanacak.
    - Menü kodları `Dashboard` bileşeninden `App.jsx` ana seviyesine taşınacak.

*Bu görevler bugünkü iş planına eklendi, işlemlere birkaç saat sonra başlanacak.*


