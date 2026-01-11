# Migration Raporu

## Degisiklik Ozeti
1) `customers` tablosuna `is_active` alani eklendi ve zorunlu yapildi.
2) `orders` tablosunda `customer_id` icin foreign key eklendi; `status` NOT NULL ve varsayilan `pending` yapildi.
3) `customers.phone` ve `customers.email` icin unique indeksler eklendi (NULL degerler haric).
4) `products` tablosu eklendi (stok takibi destekli).
5) `product_prices` tablosu eklendi (birden fazla fiyat turu).
6) `order_items` tablosu eklendi (siparis kalemleri).
7) `orders.customer_id` alani nullable yapildi (misafir siparis).

## Migration Dosyalari
- `migrations/20240101000000-create-customer.js`
  - `is_active` eklendi, `created_at`/`updated_at` zorunlu yapildi.
- `migrations/20240102000000-create-order.js`
  - `customer_id` foreign key, `status` default ve NOT NULL.
- `migrations/20260111000000-add-customer-unique-indexes.js`
  - Telefon ve email icin unique indeksler.
- `migrations/20240103000000-create-products.js`
  - Urun ve stok alanlari.
- `migrations/20240104000000-create-product-prices.js`
  - Urun fiyat tipleri.
- `migrations/20240105000000-create-order-items.js`
  - Siparis kalemleri.

## Notlar
- Var olan verilerde duplicate telefon/email varsa migration oncesi temizlenmelidir.
- Foreign key eklenmeden once orders tablosundaki yetim kayitlar kontrol edilmelidir.

## Musteri Talepleri ve Kararlar
- Mevcut veritabanini bozmadan ilerleme: Yikici degisikliklerden kacinildi, sadece ekleme odakli guncellemeler yapildi.
- Tablo adlari: Ingilizce ve mevcut standartla uyumlu olarak belirlendi (`customers`, `orders`, `products`, `order_items`).
- Siparis tablosu karisikliklari: `order_items` ayrildi, FK kontrolleri eklendi; migration oncesi veri dogrulamasi onerildi.
