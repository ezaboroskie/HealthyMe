'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usergoal extends Model {
   
    static associate(models) {
    models.usergoal.hasMany(models.usergoalsnote, {as: 'usergoalsnotes', foreignKey:'usergoalsnotesid'})
    }
  }
  usergoal.init({
    goal: DataTypes.STRING,
    description: DataTypes.TEXT,
    completed: DataTypes.BOOLEAN,
    usergoalid: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'usergoal',
  });
  return usergoal;
};