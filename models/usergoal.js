'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usergoal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   models.usergoal.belongsTo(models.user, {as: 'user', foreignKey: 'usergoalid'})
    // }
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