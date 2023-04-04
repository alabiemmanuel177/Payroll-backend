const express = require("express");
const router = express.Router();
const MonthlyPay = require("../models/MonthlyPay");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Route to get monthly pay for an employee
router.get("/:employeeId/:month/:year", async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;

    // Find all attendance records for the given employee and month
    const attendances = await Attendance.find({
      employee: employeeId,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    // Calculate the total pay for the month
    const totalPay = attendances.reduce(
      (acc, attendance) => acc + attendance.pay,
      0
    );

    // Create a new MonthlyPay document or update an existing one
    const monthlyPay = await MonthlyPay.findOneAndUpdate(
      { employee: employeeId, month, year },
      { totalPay },
      { new: true, upsert: true }
    );

    res.status(200).json(monthlyPay);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:employeeId", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Find all attendances for the employee within the current month and year
    const attendances = await Attendance.find({
      employee: employeeId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Calculate total pay for the month
    const totalPay = attendances.reduce(
      (acc, attendance) => acc + attendance.pay,
      0
    );

    // Create or update the MonthlyPay record for the employee and month
    const monthName = now.toLocaleString("default", { month: "long" });
    const monthlyPay = await MonthlyPay.findOneAndUpdate(
      { employee: employeeId, month: monthName, year: currentYear },
      {
        employee: employeeId,
        month: monthName,
        year: currentYear,
        totalPay,
      },
      { upsert: true, new: true }
    ).populate("employee");

    res.json(monthlyPay);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get monthly pay for all employees
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Find all employees
    const employees = await Employee.find();

    // Calculate total pay for each employee in the current month
    const monthlyPays = await Promise.all(
      employees.map(async (employee) => {
        // Find all attendances for the employee within the current month and year
        const attendances = await Attendance.find({
          employee: employee._id,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        // Calculate total pay for the month
        const totalPay = attendances.reduce(
          (acc, attendance) => acc + attendance.pay,
          0
        );

        // Create or update the MonthlyPay record for the employee and month
        const monthName = now.toLocaleString("default", { month: "long" });
        const monthlyPay = await MonthlyPay.findOneAndUpdate(
          { employee: employee._id, month: monthName, year: currentYear },
          {
            employee: employee._id,
            month: monthName,
            year: currentYear,
            totalPay,
          },
          { upsert: true, new: true }
        ).populate("employee");

        return monthlyPay;
      })
    );

    res.json(monthlyPays);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get monthly pay for all employees
router.post("/all", async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Find all employees
    const employees = await Employee.find();

    // Calculate total pay for each employee in the current month
    const monthlyPays = await Promise.all(
      employees.map(async (employee) => {
        // Find all attendances for the employee within the current month and year
        const attendances = await Attendance.find({
          employee: employee._id,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        // Calculate total pay for the month
        const totalPay = attendances.reduce(
          (acc, attendance) => acc + attendance.pay,
          0
        );

        // Create or update the MonthlyPay record for the employee and month
        const monthName = now.toLocaleString("default", { month: "long" });
        const monthlyPay = await MonthlyPay.findOneAndUpdate(
          { employee: employee._id, month: monthName, year: currentYear },
          {
            employee: employee._id,
            month: monthName,
            year: currentYear,
            totalPay,
          },
          { upsert: true, new: true }
        ).populate("employee");

        return monthlyPay;
      })
    );
    const totalMonthlyPay = monthlyPays.reduce(
      (acc, monthlyPay) => acc + monthlyPay.totalPay,
      0
    );

    res.json({ monthlyPays, totalMonthlyPay });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
