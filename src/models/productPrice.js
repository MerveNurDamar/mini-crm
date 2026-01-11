module.exports = (sequelize, DataTypes) => {
  const ProductPrice = sequelize.define(
    'ProductPrice',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      priceType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      priceAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'TRY',
      },
    },
    {
      tableName: 'product_prices',
      underscored: true,
    }
  );

  return ProductPrice;
};
