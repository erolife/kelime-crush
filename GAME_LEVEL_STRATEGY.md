# Wordlenge Rank & Mastery Strategy

Bu döküman, Wordlenge ekosistemindeki "Sonsuz İlerleme" (Infinite Progression) mantığını, XP (Tecrübe Puanı) ve Seviye (Level) sistemini detaylandırır.

## 1. Temel Prensipler
- **Hız:** İlk seviyeler çok hızlı (1-3 oyun), ilerleyen seviyeler üstsel olarak daha zor.
- **Anlam:** Her seviye oyuncuya somut bir avantaj veya prestij sağlamalı.
- **Dinamizm:** Sabit leveller yerine oyuncunun oyun modlarındaki başarısına dayalı bir gelişim.

## 2. XP (Tecrübe Puanı) Kaynakları
Oyuncular her oyun sonunda aşağıdaki kriterlere göre XP kazanır:

| Aksiyon | XP Miktarı | Detay |
| :--- | :--- | :--- |
| **3 Harfli Kelime** | 10 XP | Temel bulma puanı |
| **4 Harfli Kelime** | 25 XP | Orta seviye beceri |
| **5+ Harfli Kelime** | 50 XP + (10 * Ekstra Harf) | Ustalık gerektiren kelimeler |
| **Arcade Galibiyeti** | 100 - 500 XP | Alt moda ve zorluğa göre değişir |
| **Time Battle Saniye** | 2 XP / Saniye | Hayatta kalınan her saniye için |
| **Günlük Giriş (Daily)** | 200 XP | Sadakat bonusu |
| **Daily Spin (XP)** | 100 - 1000 XP | Şans faktörü |

## 3. Matematiksel Seviye Modeli
Seviye atlamak için gereken toplam XP formülü:
`XP_Required = 1000 * (1.15 ^ (Level - 1))`

*Örnek İlerleme:*
- Seviye 1: 1,000 XP
- Seviye 5: ~1,750 XP
- Seviye 10: ~4,000 XP
- Seviye 20: ~16,000 XP
- Seviye 50: ~1,000,000+ XP

## 4. Unvanlar ve Rozetler (The Titles)
| Seviye Aralığı | Unvan (TR) | Unvan (EN) | Görsel Tema |
| :--- | :--- | :--- | :--- |
| **1 - 10** | Kelime Çaylağı | Word Rookie | Bronz / Mat |
| **11 - 25** | Hece Ustası | Syllable Master | Gümüş / Metalik |
| **26 - 50** | Sözlük Gurusu | Dictionary Guru | Altın / Parlak |
| **51 - 75** | Efsanevi Yazar | Legendary Author | Safir / Işıltılı |
| **76 - 100** | Kelime Tanrısı | Word Deity | Kozmik / Animasyonlu |

## 5. Mastery Perks (Yetenek Puanları)
Her seviye atlamada oyuncu **1 Mastery Point** kazanır. Bu puanlar aşağıdaki ağaçlarda harcanabilir:

### A. Ekonomi (Economy)
- **Gold Digger:** "Her kelimeden kazanılan altın %2 artar." (Max 5 Seviye)
- **Daily Bonus:** "Günlük girişte +50 extra altın."
- **Merchant:** "Mağaza fiyatlarında %10 indirim."

### B. Enerji (Flow)
- **Fast Charge:** "Enerji yenilenme süresi 15sn kısalır." (Max 10 Seviye)
- **Deep Reserves:** "Maksimum enerji sınırı +1 artar." (Max 3 Seviye)

### C. Oynanış (Tactics)
- **Time Bender:** "Time Battle süresi %1 daha yavaş azalır." (Max 10 Seviye)
- **Bomb Technician:** "Bomba patlamalarından kazanılan skor %10 artar."
- **Lucky Start:** "Oyun başında rastgele 1 harfin puanı 2x olur."

## 6. Veritabanı Şeması Gereksinimleri
`public.profiles` tablosuna eklenecek sütunlar:
- `xp`: bigint (default 0)
- `level`: int (default 1)
- `mastery_points`: int (default 0)
- `perks_json`: jsonb (default '{}') - Seçilen yeteneklerin saklanacağı yer.

---
*Hazırlayan: Antigravity & Webnolojik Collaborate*
