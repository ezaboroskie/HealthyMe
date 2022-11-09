'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   models.usergoal.belongsTo(models.user, {as: 'user', foreignKey: 'phealthid'})
    // }
  }
  note.init({
    body: DataTypes.TEXT,
    notesid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'note',
  });
  return note;
};