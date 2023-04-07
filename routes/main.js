const AuthRouter = require("./auth");
const AdminRouter = require("./admin");
const EmployeeRouter = require("./employee");
const PositionRouter = require("./position");
const LatenessRouter = require("./lateness");
const MonthlyPayRouter = require("./monthlyPay");
const MonthlyPayrollRouter = require("./monthlyPayroll");
const AttendanceRouter = require("./attendance");

const routes = ({ app }) => {
  app.use("/auth", AuthRouter);
  app.use("/admin", AdminRouter);
  app.use("/employee", EmployeeRouter);
  app.use("/position", PositionRouter);
  app.use("/attendance", AttendanceRouter);
  app.use("/lateness", LatenessRouter);
  app.use("/monthlypay", MonthlyPayRouter);
  app.use("/monthlypayroll", MonthlyPayrollRouter);
};

module.exports = { routes };
