# Branch Stratejisi ve PR Rehberi

## Branch Modeli

- main: uretim icin stabilize dal.
- develop: entegrasyon dali.
- feature/\*: yeni ozellikler (ornegin: feature/customer-api).
- fix/\*: hata duzeltmeleri.
- chore/\*: config, doc, refactor.

## PR ve Code Review

- Her degisiklik develop dalina PR ile alinır.
- En az bir ekip arkadasi review eder (ders kapsaminda zorunlu).
- PR aciklamasi: amac, degisen dosyalar, test notlari.

## Basit Akis

1. develop dalindan yeni branch ac.
2. Degisiklikleri yap, lokal testleri calistir.
3. PR ac ve review iste.
4. Onay sonrasi develop'a merge.
5. Surum cikisi icin develop -> main merge.
