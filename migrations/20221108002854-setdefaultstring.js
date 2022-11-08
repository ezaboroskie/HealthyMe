'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.changeColumn('Users', 'profilepic',{
    
    
      type:Sequelize.STRING,
      defaultValue: 'https://cdn-icons-png.flaticon.com/512/36/36447.png?w=826&t=st=1667863637~exp=1667864237~hmac=8b1f78c449a5e9c1400252bd8a7f920f404916db2efb00722b21a779493e7843'
      
   
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
