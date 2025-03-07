'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('commandes', 'adresse_livraison', {
      type: Sequelize.JSON,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
 
    await queryInterface.removeColumn('commandes', 'adresse_livraison');
  }
};
