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
    static associate(models) {
      // define association here
    }
  }
  mhealth.init({
    goal: DataTypes.STRING,
    description: DataTypes.TEXT,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'mhealth',
  });
  return mhealth;
};