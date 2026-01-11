const { Product, ProductPrice } = require('../models');
const logger = require('../lib/logger');

async function listProducts(options = {}) {
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  return Product.findAll({
    limit,
    offset,
    include: [{ model: ProductPrice }],
  });
}

function validateProductPayload(payload) {
  if (!payload || !payload.name) {
    const err = new Error('name is required');
    err.status = 400;
    throw err;
  }
  if (!payload.sku) {
    const err = new Error('sku is required');
    err.status = 400;
    throw err;
  }
}

async function createProduct(payload) {
  validateProductPayload(payload);
  const product = await Product.create({
    name: payload.name,
    sku: payload.sku,
    stockTracking: payload.stockTracking !== undefined ? payload.stockTracking : true,
    stockQty: payload.stockQty ?? null,
  });

  if (payload.priceType && payload.priceAmount) {
    await ProductPrice.create({
      productId: product.id,
      priceType: payload.priceType,
      priceAmount: payload.priceAmount,
      currency: payload.currency || 'TRY',
    });
  }

  logger.info('Product created', { productId: product.id });
  return Product.findByPk(product.id, { include: [{ model: ProductPrice }] });
}

async function getProductById(id) {
  const product = await Product.findByPk(id, { include: [{ model: ProductPrice }] });
  if (!product) {
    const err = new Error('product not found');
    err.status = 404;
    throw err;
  }
  return product;
}

async function updateProduct(id, payload) {
  const product = await getProductById(id);
  await product.update({
    name: payload.name ?? product.name,
    sku: payload.sku ?? product.sku,
    stockTracking: payload.stockTracking ?? product.stockTracking,
    stockQty: payload.stockQty ?? product.stockQty,
  });

  if (payload.priceType && payload.priceAmount) {
    await ProductPrice.create({
      productId: product.id,
      priceType: payload.priceType,
      priceAmount: payload.priceAmount,
      currency: payload.currency || 'TRY',
    });
  }

  logger.info('Product updated', { productId: product.id });
  return Product.findByPk(product.id, { include: [{ model: ProductPrice }] });
}

async function deleteProduct(id) {
  const product = await getProductById(id);
  await ProductPrice.destroy({ where: { productId: product.id } });
  await product.destroy();
  logger.info('Product deleted', { productId: product.id });
  return { status: 'deleted' };
}

module.exports = {
  listProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
