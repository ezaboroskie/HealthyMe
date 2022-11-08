'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.addColumn('Users', 'firstName',{
    
    
      type:Sequelize.STRING,
      
   
    })

    await queryInterface.addColumn('Users', 'lastName',{
    
    
      type:Sequelize.STRING,
      
   
    })

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
