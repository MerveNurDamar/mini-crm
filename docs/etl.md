# ETL (Musteri Import)

## Calistirma
```bash
npm run etl:customers -- --file data/customers.xlsx
```

Opsiyonel:
- `--dry-run`: veritabanina yazmadan rapor uretir.

## Kurallar
- Telefon normalize edilir (+90 formatina cevrilir).
- Email temel regex ile dogrulanir; hatali email bos kabul edilir.
- Ad zorunludur; telefon veya email zorunludur.
- Duplicate kontrolu: telefon veya email daha once eklenmisse kayit atlanir.

## Raporlar
`reports/` altinda iki dosya olusur:
- `etl-<timestamp>.json` (ozet)
- `etl-<timestamp>-errors.json` (hatali satirlar)
