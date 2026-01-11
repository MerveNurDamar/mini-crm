# Kurulum Rehberi

## Gereksinimler
- Node.js 18+
- PostgreSQL 14+ (prod/dev)
- SQLite (testler icin, otomatik kullanilir)

## Kurulum
```bash
npm install
cp .env.development.example .env
```

## Veritabani
PostgreSQL icin bir veritabani olustur:
```sql
CREATE DATABASE mini_crm_dev;
```

## Migration
```bash
npm run migrate
```

## Calistirma
```bash
npm run dev
```

## Test
```bash
npm run test:coverage
```

## Secret Notu
- Parolalar ve secret degerler repo disinda tutulmalidir.
- CI/CD icin GitHub Actions Secrets veya benzeri yapi kullanilabilir.
