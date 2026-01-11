const { Sequelize } = require('sequelize');
const config = require('../config');
const logger = require('../lib/logger');

const sequelizeOptions = {
  host: config.db.host,
  port: config.db.port,
  dialect: config.db.dialect,
  logging: (msg) => logger.debug(msg),
};

if (config.db.dialect === 'sqlite') {
  sequelizeOptions.storage = config.db.storage;
}

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  sequelizeOptions
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modeller
db.Customer = require('./customer')(sequelize, Sequelize.DataTypes);
db.Order = require('./order')(sequelize, Sequelize.DataTypes);
db.OrderItem = require('./orderItem')(sequelize, Sequelize.DataTypes);
db.Product = require('./product')(sequelize, Sequelize.DataTypes);
db.ProductPrice = require('./productPrice')(sequelize, Sequelize.DataTypes);

// İlişkiler (tam bitmemiş)
db.Customer.hasMany(db.Order, { foreignKey: 'customerId' });
db.Order.belongsTo(db.Customer, { foreignKey: 'customerId' });

db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId' });
db.Product.hasMany(db.OrderItem, { foreignKey: 'productId' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'productId' });

db.Product.hasMany(db.ProductPrice, { foreignKey: 'productId' });
db.ProductPrice.belongsTo(db.Product, { foreignKey: 'productId' });

module.exports = db;
