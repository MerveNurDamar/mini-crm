# Gereksinim Analizi Dokumani

## 1) Amac
MiniCRM, musteri, urun/stok ve siparis sureclerini merkezi bir API uzerinden yonetir.

## 2) Kapsam
- Musteri yonetimi (CRUD, tekillestirme)
- Urun ve stok yonetimi
- Siparis yonetimi
- ETL ile eski musteri verisi aktarimi
- Loglama, test, dokumantasyon ve migration duzeni

## 3) Rollerin Tanimi
- Admin: tum moduller, konfigurasyon ve raporlar
- Operator: musteri/urun/siparis islemleri
- Read-only (opsiyonel): raporlama

## 4) Is Kurallari
- Musteri kaydi icin zorunlu alanlar: ad + (telefon veya email). Soyad opsiyonel.
- Duplicate kontrolu: telefon/email eslesmesi varsa duplicate sayilir.
- Adres opsiyonel; kargo gerektiren sipariste zorunlu olur.
- Stok takibi olmayan urunlerde `stock_tracking=false` ve stok dusumu yapilmaz.
- Stok yetersiz ise siparis `pending` durumuna alinir.
- Siparis durumlari: `draft`, `pending`, `preparing`, `shipped`, `delivered`, `cancelled`.
- Kayitsiz musteriyle siparis: misafir musteri otomatik olusturulur.

## 5) Fonksiyonel Gereksinimler
- Musteri CRUD, arama, tekillestirme
- Urun CRUD, stok takibi ve fiyat turleri
- Siparis olusturma, durum degistirme, stok kontrolu
- ETL: CSV/Excel import, temizleme, hatali kayit raporu
- Loglama: request/response, hata, trace ID
- Testler: birim + temel entegrasyon

## 6) Fonksiyonel Olmayan Gereksinimler
- Performans: listeleme endpointlerinde pagination (limit/offset)
- Guvenlik: sifreler `.env` ile yonetilir
- Izlenebilirlik: log seviyeleri ve trace ID

## 7) Veri Gereksinimleri
- Musteri: ad, soyad, telefon, email, adres, not
- Urun: ad, sku, stok, stok takibi, fiyat turleri
- Siparis: musteri, urun(ler), durum, tutar
