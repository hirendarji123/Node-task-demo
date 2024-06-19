const { INTERNAL_SERVER_ERROR } = require("../common");
const { Employee, TimeTracking, sequelize } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
const format2 = "YYYY-MM-DD";
const weekData = ["currentWeek", "previousWeek"];
exports.getAllUser = async (req, res) => {
  try {
    const result = [];
    const { data = "currentWeek" } = req.query;
    let curr, first, last, firstDay, lastDay;
    if (weekData[0] == data) {
      curr = new Date(); // get current date
      first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
      last = first + 4; // last day is the first day + 6
      firstDay = new Date(curr.setDate(first)).toUTCString();
      lastDay = new Date(curr.setDate(last)).toUTCString();
    } else {
      curr = new Date();
      curr.setDate(curr.getDate() - 7);
      first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
      last = first + 4; // last day is the first day + 6
      firstDay = new Date(curr.setDate(first)).toUTCString();
      lastDay = new Date(curr.setDate(last)).toUTCString();
    }
    // find all user data
    const allEmployees = await Employee.findAll({
      attributes: ["name", "id"],
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: TimeTracking,
          require: true,
          as: "timeTracking",
          attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          where: {
            date: {
              [Op.between]: [new Date(firstDay), new Date(lastDay)],
            },
          },
          order: [["date"]],
        },
      ],
    });

    const responseData = { totalTime: 0, timeTracking: [] };

    for (let item of allEmployees) {
      let data = {};
      responseData.name = item.name;
      responseData.empId = item.id;
      // we have timetracking data for user
      if (Object.keys(item.timeTracking).length > 0) {
        for (let innerItem of Object.values(item.timeTracking)) {
          const { date, timeIn, timeOut } = innerItem.dataValues;
          var duration = moment.duration(
            moment(timeOut != null ? timeOut : new Date()).diff(moment(timeIn))
          );
          var hours = duration.asHours();

          const dateUnique = moment(date).format(format2);
          data[dateUnique]
            ? (data[dateUnique] += hours)
            : (data[dateUnique] = hours);

          responseData.totalTime += hours;
        }
        for (let [key, value] of Object.entries(data)) {
          let temp = {
            date: key,
            totalTime: value,
          };

          responseData.timeTracking.push(temp);
        }
      }
      result.push(responseData);
    }

    return res.json({
      status: true,
      message: "Fetched all user data",
      data: result || [],
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      status: true,
      message: INTERNAL_SERVER_ERROR,
      data: null,
      error: true,
    });
  }
};
