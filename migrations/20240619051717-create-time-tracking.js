"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TimeTrackings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      empId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Employees", // 'Employees' refers to table name
          key: "id", // 'id' refers to column name in Employees table
        },
      },
      date: {
        type: Sequelize.DATE,
      },
      timeIn: {
        type: Sequelize.DATE,
      },
      timeOut: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TimeTrackings");
  },
};
