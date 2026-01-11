'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('customers', ['phone'], {
      name: 'uniq_customers_phone',
      unique: true,
      where: {
        phone: { [Sequelize.Op.ne]: null },
      },
    });

    await queryInterface.addIndex('customers', ['email'], {
      name: 'uniq_customers_email',
      unique: true,
      where: {
        email: { [Sequelize.Op.ne]: null },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('customers', 'uniq_customers_phone');
    await queryInterface.removeIndex('customers', 'uniq_customers_email');
  },
};
