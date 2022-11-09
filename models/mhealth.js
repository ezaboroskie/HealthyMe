'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mhealth extends Model {
 
    static associate(models) {
    models.mhealth.hasMany(models.mhealthnote, {as: 'mhealthnotes', foreignKey:'mhealthnotesid'})
    }
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