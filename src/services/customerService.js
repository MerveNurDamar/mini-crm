const { Customer } = require('../models');
const logger = require('../lib/logger');

async function listCustomers(options = {}) {
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  return Customer.findAll({
    limit,
    offset,
  });
}

function validateCustomerPayload(payload) {
  if (!payload || !payload.firstName) {
    const err = new Error('firstName is required');
    err.status = 400;
    throw err;
  }
  if (!payload.phone && !payload.email) {
    const err = new Error('phone or email is required');
    err.status = 400;
    throw err;
  }
}

async function createCustomer(payload) {
  validateCustomerPayload(payload);
  const customer = await Customer.create(payload);
  logger.info('Customer created', { customerId: customer.id });
  return customer;
}

async function getCustomerById(id) {
  const customer = await Customer.findByPk(id);
  if (!customer) {
    const err = new Error('customer not found');
    err.status = 404;
    throw err;
  }
  return customer;
}

async function updateCustomer(id, payload) {
  const customer = await getCustomerById(id);
  await customer.update(payload);
  logger.info('Customer updated', { customerId: customer.id });
  return customer;
}

async function deleteCustomer(id) {
  const customer = await getCustomerById(id);
  await customer.destroy();
  logger.info('Customer deleted', { customerId: customer.id });
  return { status: 'deleted' };
}

module.exports = {
  listCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
