'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mhealth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   models.mhealth.belongsTo(models.user, {as: 'user', foreignKey: 'mhealthid'})
    // }
  }
  mhealth.init({
    goal: DataTypes.STRING,
    description: DataTypes.TEXT,
    completed: DataTypes.BOOLEAN,
    mhealthsid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'mhealth',
  });
  return mhealth;
};