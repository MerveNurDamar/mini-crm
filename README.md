# MiniCRM (Yarım Kalmış Proje)

Bu proje, küçük bir e-ticaret firmasının müşteri ve sipariş yönetimi için başlanmış **ama tamamlanmamış** bir MiniCRM sistemidir.

## Durum

> Proje yaklaşık %40 civarında tamamlanmıştır.  
> API uçları, testler, loglama ve migration yapısı **tamamlanmamıştır**.

## Kurulum
Detaylar icin `docs/setup.md`.

## Ortam Ayarlari

- `.env.example` genel ornek dosyadir.
- `.env.development.example` ve `.env.production.example` ortama ozel sablonlardir.
- `.env.test.example` test ortam sablonudur.
- `DB_PASSWORD` kullanilir; geriye uyum icin `DB_PASS` da desteklenir.

## Kod Standartlari

- Lint: `npm run lint`
- Format: `npm run format`

## Repo Yonetimi

- Branch stratejisi: `docs/branching.md`

## Dokumantasyon
- API (OpenAPI): `docs/openapi.yaml`
- Kullanici Kilavuzu: `docs/user-guide.md`
- Teknik Dokumantasyon: `docs/technical.md`
