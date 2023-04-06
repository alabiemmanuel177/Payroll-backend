const express = require("express");
const router = express.Router();
const moment = require("moment");

const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const Position = require("../models/Position");
const Lateness = require("../models/Lateness");

// Route to post attendance
router.post("/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Get the employee from the database
    const employee = await Employee.findById(employeeId).populate("position");

    // Get the Lateness from the database
    const lateness = await Lateness.findOne();

    // Get the current time
    const currentTime = moment().format("HH:mm");

    // Check if attendance is marked earlier than startTime in Lateness schema
    if (currentTime < moment(lateness.startTime).format("HH:mm")) {
      return res.status(400).json({ error: "Not yet in working hours" });
    }

    // Check if attendance is marked outside the allowed time
    if (currentTime > moment(lateness.lateMarkEndTime).format("HH:mm")) {
      return res
        .status(400)
        .json({ error: "Attendance can't be marked outside the time giving" });
    }

    // Set the date to the current date
    const date = new Date();

    // Create the attendance object
    const attendance = new Attendance({
      employee: employeeId,
      date,
      present: true,
    });

    // Check if attendance is marked between startTime and lateMarkStartTime
    if (currentTime <= moment(lateness.lateMarkStartTime).format("HH:mm")) {
      // Set the pay to the pay in the position schema referenced in the Employee schema
      attendance.pay = employee.position.pay;
    } else {
      // Attendance is marked between lateMarkStartTime and lateMarkEndTime
      // Set late to true in the attendance
      attendance.late = true;

      // // Calculate the deduction percentage
      // const minutesLate = moment(currentTime, "HH:mm").diff(
      //   moment(lateness.lateMarkStartTime, "HH:mm"),
      //   "minutes"
      // );
      const deduction =
        (lateness.deductionPercentage * employee.position.pay) / 100;

      // Deduct a percentage of the deductionPercentage from the pay in the Position referenced in the position schema
      attendance.pay = employee.position.pay - deduction;
    }

    // Save the attendance object
    await attendance.save();

    // Return success message and the attendance object
    res.json({ message: "Attendance marked successfully", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// router.post("/", async (req, res) => {
//   const { employeeId } = req.body;

//   try {
//     // Find the employee and position
//     const employee = await Employee.findById(employeeId);
//     const position = await Position.findById(employee.position);

//     // Check if the employee has already marked attendance for today
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const attendanceToday = await Attendance.findOne({
//       employee: employeeId,
//       date: today,
//     });
//     if (attendanceToday) {
//       return res.status(400).send("Attendance already marked for today");
//     }

//     // Check if the employee was early or late
//     const now = new Date();
//     const lateness = await Lateness.findOne({
//       start: { $lte: now },
//       end: { $gte: now },
//     });

//     let pay = position.pay;
//     let deduction = 0;

//     if (lateness) {
//       const latenessPercentage = lateness.deductionAmmount / 100;
//       const totalMinutesLate =
//         (now.getTime() - lateness.start.getTime()) / (1000 * 60);
//       const deductionAmount = position.pay * latenessPercentage;
//       // deduction = deductionAmount * (totalMinutesLate / 60);
//       pay -= deductionAmount;
//     }

//     // Create the attendance record with the server's timestamp
//     const attendance = new Attendance({
//       employee: employeeId,
//       date: today,
//       present: true,
//       late: !!lateness,
//       pay,
//       deduction,
//     });

//     await attendance.save();
//     res.json(attendance);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error saving attendance");
//   }
// });

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

router.get("/daily/attendance", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const attendances = await Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate("employee");
    res.json(attendances);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
