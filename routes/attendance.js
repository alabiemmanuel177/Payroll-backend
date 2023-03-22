const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendance");
const Employee = require("../models/Employee");

router.post("/", async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).send(attendance);
  } catch (error) {
    res.status(400).send(error);
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
    const attendance = await Attendance.findById(req.params.id);
    return res.status(200).json(attendance);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL ATTENDANCE
router.get("/", async (req, res) => {
  try {
    let attendances;
    attendances = await Attendance.find().populate("author");
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

module.exports = router;
