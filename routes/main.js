const AuthRouter = require("./auth");
const AdminRouter = require("./admin");
const EmployeeRouter = require("./employee");
const PositionRouter = require("./position");
const LatenessRouter = require("./lateness");
const MonthlyPayRouter = require("./monthlyPay");
const MonthlyPayrollRouter = require("./monthlyPayroll");
const AttendanceRouter = require("./attendance");
const cors = require("cors"); // Import cors middleware

const routes = ({ app }) => {
  app.use(cors()); // Use cors middleware
  app.use("/auth", AuthRouter);
  app.use("/admin", AdminRouter);
  app.use("/employee", EmployeeRouter);
  app.use("/position", PositionRouter);
  app.use("/attendance", AttendanceRouter);
  app.use("/lateness", LatenessRouter);
  app.use("/monthlypay", MonthlyPayRouter);
  app.use("/monthlypayroll", MonthlyPayrollRouter);
  return app;
};

module.exports = { routes };
