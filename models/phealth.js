'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class phealth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   models.usergoal.belongsTo(models.user, {as: 'user', foreignKey: 'phealthid'})
    // }
  }
  phealth.init({
    goal: DataTypes.STRING,
    description: DataTypes.TEXT,
    completed: DataTypes.BOOLEAN,
    phealthid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'phealth',
  });
  return phealth;
};