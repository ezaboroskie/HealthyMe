'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class phealth extends Model {
    
    static associate(models) {
    models.phealth.hasMany(models.phealthnote, {as: 'phealthnotes', foreignKey:'phealthnotesid'})
    }
  }
  phealth.init({
    goal: DataTypes.STRING,
    description: DataTypes.TEXT,
    completed: DataTypes.BOOLEAN,
    phealthsid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'phealth',
  });
  return phealth;
};