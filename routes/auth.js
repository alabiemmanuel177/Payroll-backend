const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Employee = require("../models/Employee");

const router = express.Router();

// Employee registration route
router.post("/register/employee", async (req, res) => {
  try {
    const { name, email, password, position, sex, phoneNo, faceId } = req.body;

    // Check if user already exists
    const existingUser = await Employee.findOne({
      $or: [{ phoneNo }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "Employee already exists" });
    }

    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Password is required and must be a string" });
    }

    const saltRounds = 10; // Use 10 rounds of salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new Employee({
      name,
      email,
      password: hashedPassword,
      position,
      sex,
      phoneNo,
      faceId,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Return user information
    res.status(201).json({ user: savedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin registration route
router.post("/register/admin", async (req, res) => {
  try {
    const { name, email, password, sex, phoneNo } = req.body;

    // Check if user already exists
    const existingUser = await Admin.findOne({
      $or: [{ phoneNo }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const saltRounds = 10; // Use 10 rounds of salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      sex,
      phoneNo,
    });

    // Save user to database
    const savedAdmin = await newAdmin.save();

    // Return user information
    res.status(201).json({ user: savedAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// employee login route
router.post("/login/employee", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create and sign JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return token and user information
    res.status(200).json({
      token,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Admin login route
router.post("/login/admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create and sign JWT
    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return token and admin information
    res.status(200).json({ token, admin: admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
