const router = require("express").Router();
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");

//UPDATE employee
router.put("/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedEmployee);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    await employee.delete();
    return res.status(200).json("Employee has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "position"
    );
    return res.status(200).json(employee);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL employee
router.get("/", async (req, res) => {
  try {
    let employees;
    employees = await Employee.find().populate("position");
    return res.status(200).json(employees);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//PATCH employee
router.patch("/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, {
      $push: req.body,
    });
    return res.status(200).json(updatedEmployee);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//CHANGE PASSWORD STUDENT
router.post("/change-password", async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  try {
    const employee = await Employee.findOne({ _id: id });

    const isMatch = await bcrypt.compare(oldPassword, employee.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Incorrect old password" });

    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(newPassword, salt);

    await employee.save();
    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
