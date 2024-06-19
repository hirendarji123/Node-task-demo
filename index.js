const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const employeeRoute = require("./routes/employees");
const app = express();
const { sequelize } = require("./models");
// middleware
app.use(cors());
app.use(helmet());

const PORT = process.env.PORT || 4000;

app.use("/employee", employeeRoute);
app.get("/", (req, res) => {
  return res.json({
    status: true,
    message: "Hello from Home Page",
  });
});

app.get("*", (req, res) => {
  return res.status(404).json({
    status: false,
    message: "Route not found",
    data: {},
    error: true,
  });
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
  app.listen(PORT, () => {
    console.log(`App is running on  port ${PORT}`);
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
