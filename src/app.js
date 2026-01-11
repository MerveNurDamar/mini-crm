const express = require('express');
const logger = require('./lib/logger');
const config = require('./config');

const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

const app = express();

// TODO: rate limiting, cors vs. düşünülmemiş
app.use(express.json());

// Request/response loglama + trace id
app.use((req, res, next) => {
  const headerName = config.logging.traceIdHeader || 'X-Trace-Id';
  const incomingTraceId = req.header(headerName);
  const traceId = incomingTraceId || `trc_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  req.traceId = traceId;
  res.setHeader(headerName, traceId);

  const start = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    logger.log(level, 'request completed', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
      traceId,
    });

    if (durationMs >= config.logging.slowRequestMs) {
      logger.warn('slow request', {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs,
        traceId,
      });
    }
  });

  next();
});

app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);

// Hata yakalama (detaysız)
app.use((err, req, res) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    traceId: req.traceId,
  });
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Bir hata oluştu', traceId: req.traceId });
});

module.exports = app;
