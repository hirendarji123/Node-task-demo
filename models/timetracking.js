"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TimeTracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TimeTracking.belongsTo(models.Employee, {
        foreignKey: "empId",
        as: "timeTracking",
      });
    }
  }
  TimeTracking.init(
    {
      empId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Employees", // 'Users' refers to table name
          key: "id", // 'id' refers to column name in Users table
        },
      },
      date: DataTypes.DATE,
      timeIn: DataTypes.DATE,
      timeOut: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "TimeTracking",
    }
  );
  return TimeTracking;
};
