const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Lateness = require("../models/Lateness");
const Position = require("../models/Position");

// POST /attendance
router.post("/", async (req, res) => {
  const { employeeId } = req.body;

  try {
    // Find the employee and position
    const employee = await Employee.findById(employeeId);
    const position = await Position.findById(employee.position);

    // Check if the employee has already marked attendance for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendanceToday = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });
    if (attendanceToday) {
      return res.status(400).send("Attendance already marked for today");
    }

    // Check if the employee was early or late
    const lateness = await Lateness.findOne({
      start: { $lte: new Date() },
      end: { $gte: new Date() },
    });

    let pay = position.pay;
    let deduction = 0;

    if (lateness) {
      const latenessPercentage = lateness.deductionAmount / 100;
      const hoursLate = new Date().getHours() - lateness.start.getHours();
      const minutesLate = new Date().getMinutes() - lateness.start.getMinutes();
      const totalMinutesLate = hoursLate * 60 + minutesLate;
      const deductionAmount = position.pay * latenessPercentage;
      deduction = deductionAmount * (totalMinutesLate / 60);
      pay -= deduction;
    }

    // Create the attendance record with the server's timestamp
    const attendance = new Attendance({
      employee: employeeId,
      date: today,
      present: true,
      late: !!lateness,
      pay,
      deduction,
    });

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving attendance");
  }
});

//UPDATE ATTENDANCE
router.put("/:id", async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedAttendance);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE ATTENDANCE
router.delete("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    await attendance.delete();
    return res.status(200).json("Attendance has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ATTENDANCE
router.get("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate(
      "employee"
    );
    return res.status(200).json(attendance);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL ATTENDANCE
router.get("/", async (req, res) => {
  try {
    let attendances;
    attendances = await Attendance.find().populate("employee");
    return res.status(200).json(attendances);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//PATCH ATTENDANCE
router.patch("/:id", async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        $push: req.body,
      }
    );
    return res.status(200).json(updatedAttendance);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET payroll route handler
router.get("/payroll/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    // Get the employee's position document
    const employee = await Employee.findById(employeeId).populate("position");

    // Get all the attendance documents for the specified month and year
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    const attendanceDocs = await Attendance.find({
      employee: employeeId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Calculate the total pay for the month
    const totalPay =
      employee.position.pay *
      attendanceDocs.filter((doc) => doc.present).length;

    res.status(200).json({ totalPay });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET employee Attendance for a MONTH
router.get("/employee/:employeeId/attendance", async (req, res) => {
  try {
    // Get the employee ID from the request parameters
    const { employeeId } = req.params;

    // Get the current month and year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Find all attendance records for the given employee and current month
    const attendance = await Attendance.find({
      employee: employeeId,
      date: {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${month + 1}-01`),
      },
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
