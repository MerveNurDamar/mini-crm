const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

// Not: test setup/teardown eksik, bazı testler flaky
describe('Customers API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // migrate yerine sync kullanılmış
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('GET /api/customers initially returns empty array', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('POST /api/customers creates customer', async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({ firstName: 'Test', lastName: 'User', phone: '5551112233' });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  // TODO: Bu test bazen patlıyor, nedenine bakılmadı
  test('GET /api/customers returns at least one customer', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.body.length).toBeGreaterThan(0);
  });
});
