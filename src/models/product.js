module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      stockTracking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      stockQty: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'products',
      underscored: true,
    }
  );

  return Product;
};
