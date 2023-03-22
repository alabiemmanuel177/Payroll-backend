const AuthRouter = require("./auth");
const AdminRouter = require("./admin");
const EmployeeRouter = require("./employee");
const PositionRouter = require("./position");


const routes = ({ app, io }) => {
  app.use("/auth", AuthRouter);
  app.use("/admin", AdminRouter);
  app.use("/employee", EmployeeRouter);
  app.use("/position", PositionRouter);
};

module.exports = { routes };
