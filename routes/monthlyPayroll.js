const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();
// import the necessary models
const MonthlyPay = require("../models/MonthlyPay");
const MonthlyPayroll = require("../models/MonthlyPayroll");

// define the route
router.get("/monthlypayroll/:month", async (req, res) => {
  try {
    // get the month from the request parameters
    const { month } = req.params;

    // find all the monthly pays for the given month
    const monthlyPays = await MonthlyPay.find({ month });

    // calculate the total pay for each employee for the given month
    const employeePays = {};
    monthlyPays.forEach((pay) => {
      const { employee, totalPay } = pay;
      if (!employeePays[employee]) {
        employeePays[employee] = 0;
      }
      employeePays[employee] += totalPay;
    });

    // create a monthly payroll object
    const monthlyPayroll = new MonthlyPayroll({
      month,
      year: new Date().getFullYear(),
      totalPay: Object.values(employeePays).reduce((a, b) => a + b, 0),
      employeePays: Object.entries(employeePays).map(
        ([employee, totalPay]) => ({ employee, totalPay })
      ),
    });

    // save the monthly payroll to the database
    await monthlyPayroll.save();

    // send the monthly payroll as the response
    res.json(monthlyPayroll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to create or update monthly payroll
router.post("/current-month", async (req, res) => {
  try {
    // Get current month and year
    const today = new Date();
    const currentMonth = today.toLocaleString("default", { month: "long" });
    const currentYear = today.getFullYear().toString();

    // Check if monthly payroll already exists for current month and year
    let monthlyPayroll = await MonthlyPayroll.findOne({
      month: currentMonth,
      year: currentYear,
    });

    // If monthly payroll does not exist, create a new one
    if (!monthlyPayroll) {
      monthlyPayroll = new MonthlyPayroll({
        month: currentMonth,
        year: currentYear,
        totalPay: 0,
        employeePays: [],
      });
    }

    // Get all employees and their monthly pay for the current month
    const employees = await Employee.find();
    const monthlyPays = await Promise.all(
      employees.map(async (employee) => {
        const monthlyPay = await MonthlyPay.findOne({
          employee: employee._id,
          month: currentMonth,
          year: currentYear,
        });
        return {
          employee: employee._id,
          totalPay: monthlyPay ? monthlyPay.totalPay : 0,
        };
      })
    );

    // Calculate the total pay for the monthly payroll
    const totalPay = monthlyPays.reduce(
      (acc, monthlyPay) => acc + monthlyPay.totalPay,
      0
    );

    // Update the monthly payroll with the employee pays and total pay
    monthlyPayroll.employeePays = monthlyPays;
    monthlyPayroll.totalPay = totalPay;

    // Save the monthly payroll
    await monthlyPayroll.save();

    res
      .status(200)
      .json({ message: "Monthly payroll created or updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
