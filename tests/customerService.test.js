jest.mock('../src/models', () => ({
  Customer: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

const { Customer } = require('../src/models');
const customerService = require('../src/services/customerService');

describe('customerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listCustomers returns list', async () => {
    Customer.findAll.mockResolvedValue([{ id: 1 }]);
    const result = await customerService.listCustomers();
    expect(result).toEqual([{ id: 1 }]);
  });

  test('createCustomer requires firstName', async () => {
    await expect(customerService.createCustomer({ phone: '555' })).rejects.toThrow(
      'firstName is required'
    );
  });

  test('createCustomer requires phone or email', async () => {
    await expect(customerService.createCustomer({ firstName: 'A' })).rejects.toThrow(
      'phone or email is required'
    );
  });

  test('createCustomer creates when valid', async () => {
    Customer.create.mockResolvedValue({ id: 1 });
    const result = await customerService.createCustomer({ firstName: 'A', phone: '555' });
    expect(result.id).toBe(1);
    expect(Customer.create).toHaveBeenCalled();
  });
});
