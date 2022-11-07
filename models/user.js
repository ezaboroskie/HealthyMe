'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.phealth, {as: 'phealths', foreignKey:'phealthsid'})
      models.User.hasMany(models.mhealth, {as: 'mhealths', foreignKey:'mhealthsid'})
      models.User.hasMany(models.usergoal, {as: 'usergoals', foreignKey:'usergoalid'})
      
      
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    profilepic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};