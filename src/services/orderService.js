const { sequelize, Order, OrderItem, Customer, Product } = require('../models');
const logger = require('../lib/logger');

async function listOrders(options = {}) {
  const limit = options.limit || 20;
  const offset = options.offset || 0;
  return Order.findAll({
    limit,
    offset,
    include: [{ model: OrderItem, include: [{ model: Product }] }, { model: Customer }],
  });
}

async function getOrderById(id) {
  const order = await Order.findByPk(id, {
    include: [{ model: OrderItem, include: [{ model: Product }] }, { model: Customer }],
  });
  if (!order) {
    const err = new Error('order not found');
    err.status = 404;
    throw err;
  }
  return order;
}

async function createOrder(payload) {
  if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
    const err = new Error('items are required');
    err.status = 400;
    throw err;
  }

  let customerId = payload.customerId || null;
  if (!customerId && payload.customer) {
    const { firstName, lastName, phone, email, address, note } = payload.customer;
    if (!firstName || (!phone && !email)) {
      const err = new Error('customer firstName and phone/email required');
      err.status = 400;
      throw err;
    }
    const guest = await Customer.create({ firstName, lastName, phone, email, address, note });
    customerId = guest.id;
  }

  const products = await Product.findAll({
    where: { id: payload.items.map((i) => i.productId) },
  });

  if (products.length !== payload.items.length) {
    const err = new Error('one or more products not found');
    err.status = 404;
    throw err;
  }

  let stockSufficient = true;
  const itemRows = payload.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const qty = item.qty || 1;
    const unitPrice = item.unitPrice || 0;
    if (product.stockTracking && product.stockQty !== null && product.stockQty < qty) {
      stockSufficient = false;
    }
    return {
      product,
      qty,
      unitPrice,
      lineTotal: Number((qty * unitPrice).toFixed(2)),
    };
  });

  const totalAmount = itemRows.reduce((sum, row) => sum + row.lineTotal, 0);
  const status = stockSufficient ? 'preparing' : 'pending';

  const order = await sequelize.transaction(async (t) => {
    const created = await Order.create(
      {
        customerId,
        status,
        totalAmount,
      },
      { transaction: t }
    );

    for (const row of itemRows) {
      await OrderItem.create(
        {
          orderId: created.id,
          productId: row.product.id,
          qty: row.qty,
          unitPrice: row.unitPrice,
          lineTotal: row.lineTotal,
        },
        { transaction: t }
      );

      if (row.product.stockTracking && row.product.stockQty !== null && stockSufficient) {
        await row.product.update(
          { stockQty: row.product.stockQty - row.qty },
          { transaction: t }
        );
      }
    }
    return created;
  });

  logger.info('Order created', { orderId: order.id, customerId: order.customerId, status });
  return getOrderById(order.id);
}

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
};
