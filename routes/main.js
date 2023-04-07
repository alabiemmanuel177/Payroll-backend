const express = require("express");
const router = express.Router();

const allowedOrigins = ["http://localhost:3000", "http://example.com"];

// Middleware to implement CORS with specific origins
const corsMiddleware = function (req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) !== -1) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};

// Apply middleware to all routes
router.use(corsMiddleware);

// Import route handlers
const AuthRouter = require("./auth");
const AdminRouter = require("./admin");
const EmployeeRouter = require("./employee");
const PositionRouter = require("./position");
const LatenessRouter = require("./lateness");
const MonthlyPayRouter = require("./monthlyPay");
const MonthlyPayrollRouter = require("./monthlyPayroll");
const AttendanceRouter = require("./attendance");

// Register routes
router.use("/auth", AuthRouter);
router.use("/admin", AdminRouter);
router.use("/employee", EmployeeRouter);
router.use("/position", PositionRouter);
router.use("/attendance", AttendanceRouter);
router.use("/lateness", LatenessRouter);
router.use("/monthlypay", MonthlyPayRouter);
router.use("/monthlypayroll", MonthlyPayrollRouter);

module.exports = { routes };
