const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const logger = require('../lib/logger');

// TODO: servis katmanı düşünülmüş ama direkt model kullanılmış
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const orders = await orderService.listOrders({ limit, offset });
    res.json(orders);
  } catch (err) {
    logger.error('Error listing orders', { err });
    next(err);
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (err) {
    logger.error('Error getting order', { err });
    next(err);
  }
});

// POST /api/orders
router.post('/', async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    logger.error('Error creating order', { err });
    next(err);
  }
});

module.exports = router;
