# 🎮 WORDLENGE — Oyun Dinamikleri Analizi

## 1. Bomba / Özel Hücre Oluşumu

Özel hücreler **yalnızca kelime bulunduğunda** ve kelimenin ilk hücresinde oluşur:

| Kelime Uzunluğu | Oluşan Hücre Tipi | Detay |
|-----------------|-------------------|-------|
| 3 harf | ❌ Hiçbir şey | Normal silme |
| 4 harf | 💥 `row_blast` veya `col_blast` | **%50-%50 rastgele** seçilir |
| 5 harf | 💣 `bomb` | 3×3 alan patlatma |
| 6 harf | 🧨 `dynamite` | Çapraz X — 4 köşegen yönünde tüm hücreler |
| 7+ harf | ☢️ `nuclear` | **Tüm grid** temizlenir |

> **Konum:** Kelimenin **ilk harfinin** olduğu hücrede oluşur. O hücre silinmez, tipi değişir.

### Özel Hücre Patlatma Mekanizması

| Hücre Tipi | Patlatma Alanı | Renk |
|-----------|----------------|------|
| `row_blast` | Bulunduğu satırın **tamamını** temizler | 🟡 Amber |
| `col_blast` | Bulunduğu sütunun **tamamını** temizler | 🟡 Amber |
| `bomb` | 3×3 alan (merkez ± 1 hücre) | 🟣 Mor |
| `dynamite` | Çapraz X (4 köşegen, grid sınırına kadar) | 🔴 Kırmızı |
| `nuclear` | **Tüm grid** (her hücre temizlenir) | 🟢 Yeşil |

> **Zincir Reaksiyonu:** ✅ Var. Patlatılan alan içinde başka bir özel hücre varsa, o da kendi kuralına göre tetiklenir (recursive).

---

## 2. Puan Hesaplama

### Kelime Puanı

```
Puan = kelime_uzunluğu × 15
```

| Kelime | Puan |
|--------|------|
| 3 harf | 45 |
| 4 harf | 60 |
| 5 harf | 75 |
| 6 harf | 90 |
| 7 harf | 105 |
| 8 harf | 120 |

> [!WARNING]
> **Harf puanları (`LETTER_POINTS`) hiç kullanılmıyor!** `Constants.js`'de her harf için detaylı puan tablosu var (J=10, Ğ=10, F=8 vb.) ama `calculateScore()` fonksiyonu bunları çağırmıyor — sadece `path.length × 15` hesaplıyor.

### Altın (Coins) Kazanımı

```
Altın = max(0, kelime_uzunluğu - 2) × 2
```

| Kelime | Kazanılan Altın |
|--------|----------------|
| 3 harf | 2 🪙 |
| 4 harf | 4 🪙 |
| 5 harf | 6 🪙 |
| 6 harf | 8 🪙 |
| 7 harf | 10 🪙 |
| 8 harf | 12 🪙 |

> Zen modunda altın kazanılmaz.

---

## 3. Araç (Tool) Kazanma

### Oyun Sırasında Araç Kazanılıyor mu?

**❌ HAYIR.** Oyun sırasında yapılan hiçbir hamle oyuncuya araç kazandırmıyor. Araçlar yalnızca şu yollarla elde edilir:

| Yol | Detay |
|-----|-------|
| **Market (Mağaza)** | Altınla satın alma (bomb:100, row/col:150, swap:200, cell:50) |
| **Günlük Ödül** | Seri günlerine göre belirlenen ödüller (bomb, swap vb.) |
| **Seviye Ödülleri** | Seviye tamamlanınca tanımlı ödüller (levels tablosunda `rewards.tools`) |
| **Başlangıç Seti** | Yeni hesap: bomb:1, swap:2, row:1, col:1, cell:3 |

---

## 4. Tetikleyici → Eylem Haritası

| Tetikleyici | Eylem |
|-------------|-------|
| 3+ harfli geçerli kelime | Hücreler silinir, puan verilir, altın kazanılır |
| 4 harfli kelime | ↑ + kelimenin ilk hücresinde row/col_blast oluşur |
| 5+ harfli kelime | ↑ + kelimenin ilk hücresinde bomb oluşur |
| 5+ harfli kelime (UI) | Tebrik animasyonu gösterilir + ses çalar |
| Özel hücreye tek tıklama | Özel hücre patlatılır (1 hamle harcanır) |
| Araç kullanma | İlgili alan temizlenir, araç stoku 1 azalır |
| Shuffle (karıştır) | Tüm grid karışır, 5 hamle harcanır |
| Hamleler bitince (arcade/mission) | Game Over |
| Süre bitince (arcade time) | Game Over |
| Tüm görevler tamamlanınca (mission) | Victory + ödüller verilir + seviye ilerler |

---

## 5. Eksik/Kullanılmayan Mekanikler

> [!IMPORTANT]
> Aşağıdakiler potansiyel iyileştirme fırsatlarıdır:

| Alan | Durum | Öneri |
|------|-------|-------|
| **Harf puanları** | Tanımlı ama kullanılmıyor | Kelime puanına harf değerini katmak (nadir harfler = daha fazla puan) |
Uygulayalım

| **Oyun içi araç kazanma** | Yok | Uzun kelimeler veya zincir reaksiyonlarında araç ödülü |
Ödül animated şekilde araçların bulunduğu alana uçabilir.

| **Combo/Streak sistemi** | Yok | Arka arkaya kelime bulunca çarpan artışı |
Uygulayalım

| **Zorluk etkisi puana** | Yok | Zor modda daha yüksek puan çarpanı |
Uygulayalım

| **Vowel bonus kullanımı** | Sadece harf dağılımında | Puan hesabına da yansıtılabilir |
Uygulayalım

**Boşa giden hamle yok** Eğer oyuncu kelime oluşurmayan bir hamle yaptıysa hamle sayısı eksilmiyor. eksiltilmeli mi?


## 6. Monetisation 
Şuan oyunun bir monetisation yapısı yok. Bunun hakkında beyin fırtınası yapalım ve uygulamaya geçelim.

