# 💰 WORDLENGE — Monetizasyon Stratejisi

> **Hedef Pazar:** Türkiye (öncelikli), sonrasında global
> **Ödeme Altyapısı:** **Stripe** (USD bazlı — checkout'ta TL karşılığı otomatik gösterilir)
> **Reklam:** ❌ Uygulama içinde reklam gösterimi/ödüllü reklam **olmayacak**

---

## 1. Mevcut Ekonomi Analizi

| Kaynak | Kazanım Yolu | Harcama Yeri |
|--------|-------------|--------------|
| **Altın (Coins)** | Kelime bulma, günlük ödül, seviye tamamlama | Market'ten araç satın alma |
| **Araçlar (Tools)** | Market, günlük ödül, başlangıç seti | Oyun içi kullanım |
| **Enerji (Energy)** | Zamanla yenileme (5/5, 20dk aralık) | Oyun başlatma |

### Araç Fiyatları (Altınla)
| Araç | Fiyat |
|------|-------|
| Cell Remove | 100 🪙 |
| Bomb (3×3) | 250 🪙 |
| Row/Col Blast | 300 🪙 |
| Swap | 400 🪙 |
| Dynamite (çapraz X) | 500 🪙 *(PRO?)* |
| Nuclear (tüm grid) | 1000 🪙 *(PRO?)* |

### Altın Kazanım Formülü (Dengelenmiş)
```
max(0, kelime_uzunluğu - 3) × 2  →  3 harf=0, 4=2, 5=4
```
> Bir Bomba almak için ~10-12 oyun gerekiyor. Bu, ödeme motivasyonunu tetikler.

---

## 2. Monetizasyon Kanalları

### 📦 A) Altın Paketleri (Ana Gelir Kaynağı)

| Paket | Altın | USD Fiyat | ~TRY | Bonus | İlk Alım (2x) |
|-------|-------|-----------|------|-------|----------------|
| **Başlangıç** | 500 🪙 | $0.99 | ~₺38 | — | 1,000 🪙 |
| **Popüler** ⭐ | 1,200 🪙 | $2.99 | ~₺114 | +20% değer | 2,400 🪙 |
| **Süper** | 3,000 🪙 | $4.99 | ~₺190 | +50% değer | 6,000 🪙 |
| **Mega** | 7,500 🪙 | $9.99 | ~₺380 | +87% değer | 15,000 🪙 |
| **Efsanevi** | 20,000 🪙 | $19.99 | ~₺760 | +140% değer | 40,000 🪙 |

> **İlk Satın Alma Bonusu:** İlk altın paketi alımında **2x altın** (bir kerelik).

---

### ⚡ B) Enerji Sistemi

Mevcut: 5 enerji, 20 dakikada 1 yenileme (toplam ~1.5 saat bekleme).

| Seçenek | Fiyat | Detay |
|---------|-------|-------|
| **+1 Enerji** | 50 🪙 | Tek seferlik |
| **Tam Doldurma (5/5)** | 200 🪙 | Anlık |
| **Sınırsız Enerji (2 saat)** | 400 🪙 | Zamanlı boost |
| **Sınırsız Enerji (24 saat)** | $0.99 | Direkt USD (Stripe) |

---

### 👑 C) Premium Abonelik — "WORDLENGE PRO"

| Plan | Fiyat | ~TRY | İndirim |
|------|-------|------|---------|
| **Aylık** | $2.99/ay | ~₺114 | — |
| **Yıllık** | $19.99/yıl | ~₺760 | %44 ($1.67/ay) |

| Özellik | Ücretsiz | PRO |
|---------|----------|-----|
| Enerji | 5, 20dk yenileme | **Sınırsız** |
| Günlük Altın | — | **100 🪙/gün** |
| Özel Araçlar | — | **Dinamit & Nükleer** marketten alınabilir |
| Profil Rozeti | — | ✨ PRO rozeti |
| İstatistikler | Temel | **Detaylı istatistikler** |
| Günlük Ödül | Normal | **2x günlük ödül** |

---

### 🎁 D) Özel Paketler (Event/Kampanya Bazlı)

| Paket | İçerik | Fiyat | Ne Zaman |
|-------|--------|-------|----------|
| **Yeni Başlayan Paketi** | 1000🪙 + 5 Bomba + 3 Swap + Sınırsız Enerji (24s) | $1.99 | İlk 3 gün |
| **Hafta Sonu Paketi** | 2000🪙 + 10 Karışık Araç | $3.99 | Cuma-Pazar |
| **Zaman Savaşçısı** | 3 Nükleer + 5 Dinamit + 1500🪙 | $2.99 | Zaman Arenası etkinliği |
| **Sezon Paketi** | 5000🪙 + PRO (1 hafta) + 20 Araç | $7.99 | Sezon başı |

---

## 3. Stripe Maliyet Analizi

### Ödeme Altyapısı
- **Stripe hesabı:** ABD LLC üzerinden (mevcut, aktif)
- **Settlement:** USD → ABD banka hesabı (Wise/Mercury)
- **Komisyon:** 2.9% + $0.30 sabit ücret

### Paket Bazlı Maliyet Tablosu

| Paket | Fiyat | Stripe Kesinti | Net Gelir | Marj |
|---|---|---|---|---|
| Başlangıç | $0.99 | $0.30 + $0.03 = $0.33 | **$0.66** | %67 |
| Popüler | $2.99 | $0.30 + $0.09 = $0.39 | **$2.60** | %87 |
| Süper | $4.99 | $0.30 + $0.14 = $0.44 | **$4.55** | %91 |
| Mega | $9.99 | $0.30 + $0.29 = $0.59 | **$9.40** | %94 |
| Efsanevi | $19.99 | $0.30 + $0.58 = $0.88 | **$19.11** | %96 |
| PRO Aylık | $2.99 | $0.30 + $0.09 = $0.39 | **$2.60** | %87 |

> ⚠️ $0.99 pakette Stripe sabit ücreti ($0.30) marjı %67'ye düşürür ama giriş bariyerini kırmak açısından kabul edilebilir.

> **KDV:** ABD LLC olarak Türk müşteriye dijital hizmet satışında Türkiye KDV'si (%20) araştırılmalı. Stripe Tax otomatik çözüm sunuyor (ek %0.5 komisyon).

---

## 4. Stripe Entegrasyonu — Teknik Plan

### Akış
```
Oyuncu → "Satın Al" butonuna basar
        → Stripe Checkout Session açılır (hosted)
        → Ödeme tamamlanır
        → Stripe Webhook → Supabase Edge Function
        → Supabase DB'de altın/PRO durumu güncellenir
        → Oyuncuya altın/abonelik yansır
```

### Gerekli Bileşenler

| Bileşen | Teknoloji | Detay |
|---------|-----------|-------|
| **Ödeme Sayfası** | Stripe Checkout (hosted) | En hızlı ve güvenli yol |
| **Abonelik Yönetimi** | Stripe Billing | PRO için recurring |
| **Webhook Handler** | Supabase Edge Function | Ödeme onayını DB'ye yaz |
| **Ürün Kataloğu** | Stripe Dashboard | Altın paketleri ve abonelik planları |
| **Müşteri Portalı** | Stripe Customer Portal | Abonelik iptal/değiştirme |
| **Vergi Yönetimi** | Stripe Tax (opsiyonel) | KDV otomatik hesaplama |

### Supabase Tabloları
> Detaylı SQL: `sql/monetization_tables.sql`

- `purchases` — Satın alma geçmişi
- `subscriptions` — PRO abonelik durumu
- `profiles` tablosuna eklenen sütunlar: `stripe_customer_id`, `is_pro`, `first_purchase_used`

---

## 5. Fiyatlandırma Psikolojisi

- **$0.99** eşiği: En düşük psikolojik bariyer, ilk ödemeyi tetikler
- **"İlk Alım 2x" kampanyası**: Conversion rate'i en çok artıran yöntem
- **Altın gösterimi**: Araç fiyatlarını "uygun" göstermek için altın enflasyonu kontrol altında
- **Kıtlık hissi**: "Yeni Başlayan Paketi" sadece ilk 3 gün (FOMO)
- **Anchoring**: Paket listesinde "Popüler" ortada ⭐ işaretli
- **Günlük login ödülü**: Oyuncuyu her gün getirip mağazayı göstermek için önemli

---

## 6. Lansman Yol Haritası

| Faz | İçerik | Süre |
|-----|--------|------|
| **Faz 1 — Soft Launch** | Altın paketleri + İlk alım bonusu | 1-2 hafta |
| **Faz 2 — Abonelik** | PRO abonelik + Sınırsız enerji | 2-3 hafta |
| **Faz 3 — Kampanyalar** | Hafta sonu/sezon paketleri | Sürekli |

---

## 7. KPI Hedefleri

| Metrik | Hedef |
|--------|-------|
| **D1 Retention** | %40+ |
| **D7 Retention** | %20+ |
| **Conversion Rate** (ücretsiz → ödeme yapan) | %3-5 |
| **ARPPU** (Ödeme yapan kullanıcı başına gelir) | $1-3/ay |
| **LTV** (Kullanıcı ömür boyu değeri) | $5-15 |

---

## 8. Açık Sorular / Araştırılacaklar

- [ ] **KDV yükümlülüğü:** ABD LLC → TR müşteri dijital satışta TR KDV'si — Stripe Tax ile otomatik mi?
- [ ] **App Store/Play Store:** Mağazadan dağıtılırsa Apple %30 / Google %15-30 komisyon → Stripe yerine IAP zorunlu olabilir
- [ ] **Dinamit/Nükleer markete eklenmesi:** PRO-only mı, yoksa herkese pahalıya mı?
