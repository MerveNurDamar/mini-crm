# Test Raporu

## Calistirma
Komut:
```
npm run test:coverage
```

## Sonuc Ozeti
- Test Suites: 4 passed, 4 total
- Tests: 13 passed, 13 total
- Tarih: 2026-01-11

## Kapsam (Coverage)
```
All files | % Stmts 70.98 | % Branch 65.41 | % Funcs 72.09 | % Lines 70.79
```

Detay:
```
File                 | % Stmts | % Branch | % Funcs | % Lines
src                  |   89.28 |       50 |   66.66 |   89.28
src/config/index.js  |     100 |    70.96 |     100 |     100
src/lib/logger.js    |   66.66 |       40 |       0 |   66.66
src/models/*         |     100 |       50 |     100 |     100
src/routes/*         |   54.83 |      100 |   53.84 |   54.83
src/services/*       |   68.69 |    69.23 |      80 |   68.14
```

## Notlar
- Testlerde sqlite (in-memory) kullanildi.
- 404 senaryosu loglama cikti urettigi icin console output gorunebilir.
