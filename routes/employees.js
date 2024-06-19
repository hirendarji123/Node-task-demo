const express = require("express");
const { getAllUser } = require("../controllers/employees");
const route = express.Router();

route.get("/:id", getAllUser);

module.exports = route;
