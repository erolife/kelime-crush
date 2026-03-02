# 💰 WORDLENGE — Monetizasyon Stratejisi

> **Hedef Pazar:** Türkiye (öncelikli), sonrasında global
> **Ödeme Altyapısı:** Stripe (ABD LLC üzerinden)
> **Fiyatlandırma:** USD bazlı (Stripe checkout'ta TL karşılığı otomatik gösterilir)
> **Reklam:** ❌ Uygulama içinde reklam gösterimi/ödüllü reklam **olmayacak**

---

## 1. Mevcut Ekonomi Analizi

Oyunda halihazırda var olan para birimleri ve kaynaklar:

| Kaynak | Kazanım Yolu | Harcama Yeri |
|--------|-------------|--------------|
| **Altın (Coins)** | Kelime bulma, günlük ödül, seviye tamamlama | Market'ten araç satın alma |
| **Araçlar (Tools)** | Market, günlük ödül, başlangıç seti | Oyun içi kullanım |
| **Enerji (Energy)** | Zamanla yenileme (5/5, 20dk aralık) | Oyun başlatma |

### Araç Fiyatları (Altınla) — Güncellenmiş
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
Eski: max(0, kelime_uzunluğu - 2) × 2  →  3 harf=2, 4=4, 5=6
Yeni: max(0, kelime_uzunluğu - 3) × 2  →  3 harf=0, 4=2, 5=4
```
> Bir Bomba almak için ~10-12 oyun gerekiyor. Bu, ödeme motivasyonunu tetikler.

---

## 2. Monetizasyon Kanalları

### 📦 A) Altın Paketleri (Ana Gelir Kaynağı)

Oyuncular gerçek parayla altın satın alır. **USD bazlı fiyatlandırma** (Stripe checkout TL karşılığını gösterir):

| Paket | Altın | USD Fiyat | Bonus |
|-------|-------|-----------|-------|
| **Başlangıç** | 500 🪙 | $4.99 | — |
| **Popüler** ⭐ | 1,200 🪙 | $9.99 | +20% değer |
| **Süper** | 3,000 🪙 | $19.99 | +50% değer |
| **Mega** | 7,500 🪙 | $49.99 | +87% değer |
| **Efsanevi** | 20,000 🪙 | $99.99 | +140% değer |

> **İlk Satın Alma Bonusu:** İlk altın paketi alımında **2x altın** (bir kerelik).

---

### ⚡ B) Enerji Sistemi (Oyun Sürekliliği)

Mevcut: 5 enerji, 20 dakikada 1 yenileme (toplam ~1.5 saat bekleme).

| Seçenek | Fiyat | Detay |
|---------|-------|-------|
| **+1 Enerji** | 50 🪙 | Tek seferlik |
| **Tam Doldurma (5/5)** | 200 🪙 | Anlık |
| **Sınırsız Enerji (2 saat)** | 400 🪙 | Zamanlı boost |
| **Sınırsız Enerji (24 saat)** | $2.99 | Direkt USD (Stripe) |

---

### 👑 C) Premium Abonelik — "WORDLENGE PRO"

Aylık abonelik modeli (recurring revenue):

| Özellik | Ücretsiz | PRO ($9.99/ay) |
|---------|----------|-----------------|
| Enerji | 5, 20dk yenileme | **Sınırsız** |
| Günlük Altın | — | **100 🪙/gün** |
| Özel Araçlar | — | **Dinamit & Nükleer** marketten satın alınabilir |
| Profil Rozeti | — | ✨ PRO rozeti |
| İstatistikler | Temel | **Detaylı istatistikler** |
| Günlük Ödül | Normal | **2x günlük ödül** |

> **Yıllık Plan:** $79.99/yıl ($6.66/ay — %33 indirim)

---

### 🎁 D) Özel Paketler (Event/Kampanya Bazlı)

| Paket | İçerik | Fiyat | Ne Zaman |
|-------|--------|-------|----------|
| **Yeni Başlayan Paketi** | 1000🪙 + 5 Bomba + 3 Swap + Sınırsız Enerji (24s) | $4.99 | İlk 3 gün |
| **Hafta Sonu Paketi** | 2000🪙 + 10 Karışık Araç | $9.99 | Cuma-Pazar |
| **Zaman Savaşçısı** | 3 Nükleer + 5 Dinamit + 1500🪙 | $6.99 | Zaman Arenası etkinliği |
| **Sezon Paketi** | 5000🪙 + PRO (1 hafta) + 20 Araç | $19.99 | Sezon başı |

---

## 3. Stripe Maliyet Analizi

### Ödeme Altyapısı
- **Stripe hesabı:** ABD LLC üzerinden (mevcut, aktif)
- **Settlement:** USD → ABD banka hesabı (Wise/Mercury)
- **Komisyon:** 2.9% + $0.30 sabit ücret

> ⚠️ **Neden USD bazlı fiyatlandırma?**
> TL bazlı fiyat koysak bile Stripe USD'ye çevirecek ve +1% kur ücreti kesecek.
> Direkt USD fiyatlandırma ile bu ekstra %1'den kurtuluyoruz.
> Stripe checkout müşteriye otomatik TL karşılığını gösterir.

### Paket Bazlı Maliyet Tablosu

| Paket | Fiyat | Stripe Kesinti | Net Gelir | Marj |
|---|---|---|---|---|
| Başlangıç | $4.99 | $0.30 + $0.14 = $0.44 | **$4.55** | %91 |
| Popüler | $9.99 | $0.30 + $0.29 = $0.59 | **$9.40** | %94 |
| Süper | $19.99 | $0.30 + $0.58 = $0.88 | **$19.11** | %96 |
| Mega | $49.99 | $0.30 + $1.45 = $1.75 | **$48.24** | %97 |
| PRO Aylık | $9.99 | $0.30 + $0.29 = $0.59 | **$9.40** | %94 |

> **Not:** KDV konusu — ABD LLC olarak Türk müşteriye dijital hizmet satışında
> Türkiye KDV'si (%20) toplama yükümlülüğü araştırılmalı. Stripe Tax bu konuda
> otomatik çözüm sunuyor (ek %0.5 komisyon).

---

## 4. Stripe Entegrasyonu — Teknik Plan

### Akış
```
Oyuncu → "Satın Al" butonuna basar
        → Stripe Checkout Session açılır (embedded veya redirect)
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

### Supabase Tabloları (Yeni)

```sql
-- Satın alma geçmişi
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_session_id TEXT,
  product_type TEXT, -- 'coins', 'energy', 'pro', 'bundle'
  amount_coins INT DEFAULT 0,
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PRO abonelik durumu
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  plan TEXT DEFAULT 'free', -- 'free', 'pro_monthly', 'pro_yearly'
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Fiyatlandırma Psikolojisi

- **$4.99** eşiği: İlk ödeme bariyerini kırmak için düşük giriş noktası
- **"İlk Alım 2x" kampanyası**: Conversion rate'i en çok artıran yöntem
- **Altın gösterimi**: Araç fiyatlarını "uygun" göstermek için altın enflasyonu kontrol altında tutulmalı
- **Kıtlık hissi**: "Yeni Başlayan Paketi" sadece ilk 3 gün gösterilmeli (FOMO)
- **Anchoring**: Paket listesinde en büyük paket üstte, "en popüler" ortada işaretli
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
| **ARPPU** (Ödeme yapan kullanıcı başına gelir) | $3-5/ay |
| **LTV** (Kullanıcı ömür boyu değeri) | $15-30 |

---

## 8. Açık Sorular / Araştırılacaklar

- [ ] **KDV yükümlülüğü:** ABD LLC → TR müşteri dijital satışta TR KDV'si toplanmalı mı? Stripe Tax kullanılacak mı?
- [ ] **Wise/Mercury akışı:** Stripe → Banka hesabı aktarımı ne sıklıkla?
- [ ] **App Store/Play Store:** Mobil uygulama mağazalarından dağıtılırsa Apple %30 / Google %15-30 komisyon keser — bu durumda Stripe yerine IAP (In-App Purchase) zorunlu olabilir
- [ ] **Dinamit/Nükleer markete eklenmesi:** PRO-only mı, yoksa herkese pahalıya mı?
