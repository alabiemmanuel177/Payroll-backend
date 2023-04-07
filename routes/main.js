const AuthRouter = require("./auth");
const AdminRouter = require("./admin");
const EmployeeRouter = require("./employee");
const PositionRouter = require("./position");
const LatenessRouter = require("./lateness");
const MonthlyPayRouter = require("./monthlyPay");
const MonthlyPayrollRouter = require("./monthlyPayroll");
const AttendanceRouter = require("./attendance");

const routes = ({ app, io, allowedOrigins }) => {
  app.use(
    cors({
      origin: function (origin, callback) {
        // Check if the request origin is in the allowed origins array
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );

  app.use("/auth", AuthRouter);
  app.use("/admin", AdminRouter);
  // Add CORS middleware to the LatenessRouter
  EmployeeRouter.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) !== -1) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use("/employee", EmployeeRouter);
  // Add CORS middleware to the LatenessRouter
  PositionRouter.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) !== -1) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use("/position", PositionRouter);
  // Add CORS middleware to the LatenessRouter
  AttendanceRouter.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) !== -1) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use("/attendance", AttendanceRouter);

  // Add CORS middleware to the LatenessRouter
  LatenessRouter.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) !== -1) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use("/lateness", LatenessRouter);
  // Add CORS middleware to the MonthlyPayrollRouter
  MonthlyPayRouter.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) !== -1) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use("/monthlypay", MonthlyPayrollRouter);
  // Add CORS middleware to the MonthlyPayrollRouter
  MonthlyPayrollRouter.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) !== -1) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use("/monthlypayroll", MonthlyPayrollRouter);
};

module.exports = { routes };
