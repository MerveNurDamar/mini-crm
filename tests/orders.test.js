const request = require('supertest');
const app = require('../src/app');
const { sequelize, Customer, Order, Product } = require('../src/models');

describe('Orders API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/orders creates order for existing customer', async () => {
    const product = await Product.create({
      name: 'Urun 1',
      sku: 'SKU-ORDER-1',
      stockTracking: true,
      stockQty: 10,
    });
    const customer = await Customer.create({ firstName: 'Test', phone: '5551112233' });
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerId: customer.id,
        items: [{ productId: product.id, qty: 2, unitPrice: 50 }],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    const dbOrder = await Order.findByPk(res.body.id);
    expect(dbOrder).not.toBeNull();
  });

  test('POST /api/orders returns 404 for missing product', async () => {
    const res = await request(app).post('/api/orders').send({
      customer: { firstName: 'Guest', phone: '5551112233' },
      items: [{ productId: 9999, qty: 1, unitPrice: 10 }],
    });
    expect(res.statusCode).toBe(404);
  });
});
