'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class phealthnote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   models.mhealth.belongsTo(models.user, {as: 'user', foreignKey: 'mhealthid'})
    // }
  }
  phealthnote.init({
    body: DataTypes.STRING,
    phealthnotesid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'phealthnote',
  });
  return phealthnote;
};