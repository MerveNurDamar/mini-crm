# Loglama Sistemi

## Kapsam
- Request/response loglari
- Hata loglari
- Trace ID mekanizmasi
- Log seviyeleri: info/warn/error

## Trace ID
- Header: `X-Trace-Id` (config ile degistirilebilir)
- Istek gelmezse sistem otomatik uretir.
- Response header olarak geri doner.

## Ornek Log Ciktilari (JSON)
```json
{
  "level": "info",
  "message": "request completed",
  "timestamp": "2026-01-11T11:10:00.000Z",
  "method": "POST",
  "path": "/api/orders",
  "status": 201,
  "durationMs": 42,
  "traceId": "trc_1704971400_ab12cd"
}
```
```json
{
  "level": "error",
  "message": "Unhandled error",
  "timestamp": "2026-01-11T11:10:10.000Z",
  "traceId": "trc_1704971410_ef34gh",
  "stack": "Error: customer not found"
}
```

## Notlar
- `LOG_LEVEL` ve `LOG_FORMAT` ile kontrol edilir.
- `LOG_FORMAT=text` kullanilirsa okunabilir metin formatina gecilir.
