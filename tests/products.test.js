const request = require('supertest');
const app = require('../src/app');
const { sequelize, Product } = require('../src/models');

describe('Products API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/products creates product', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'Urun 1',
      sku: 'SKU-1',
      stockTracking: false,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test('GET /api/products returns list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/products updates product', async () => {
    const product = await Product.create({ name: 'Urun 2', sku: 'SKU-2', stockTracking: true });
    const res = await request(app).put(`/api/products/${product.id}`).send({
      name: 'Urun 2a',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Urun 2a');
  });

  test('DELETE /api/products deletes product', async () => {
    const product = await Product.create({ name: 'Urun 3', sku: 'SKU-3', stockTracking: true });
    const res = await request(app).delete(`/api/products/${product.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('deleted');
  });
});
