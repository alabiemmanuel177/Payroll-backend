const router = require("express").Router();
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const ProfilePic = require("../models/ProfilePic");
const { uploader, deleteFile } = require("../util/cloudinary");
const multer = require("multer");
const fs = require("fs");

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
    const employee = await Employee.findById(req.params.id)
      .populate("position")
      .populate("profilePic");
    return res.status(200).json(employee);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL employee
router.get("/", async (req, res) => {
  try {
    let employees;
    employees = await Employee.find()
      .populate("position")
      .populate("profilePic");
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    //reject file
    cb({ message: "Unsupported file format" }, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter,
});

// Upload a new profile picture for a user
router.post(
  "/:userId/profilepic",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await Employee.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: "Student not found" });
      }

      const result = await uploader(req, "PayRoll/profile_pictures");

      // Create a new profile picture document in the database
      const newProfilePic = new ProfilePic({
        fileUrl: result.secure_url,
        fileType: req.file.mimetype,
        fileName: req.file.originalname,
        public_id: result.id,
      });
      await newProfilePic.save();

      // Update the reference to the new profile picture in the user's document
      user.profilePic = newProfilePic._id;
      await user.save();

      res
        .status(200)
        .json({ message: "Profile picture uploaded successfully" });
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete the profile picture for a user
router.delete("/:userId/profilepic", async (req, res) => {
  try {
    const user = await Employee.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if the user has a profile picture
    if (!user.profilePic) {
      return res
        .status(400)
        .json({ message: "User does not have a profile picture" });
    }

    const profilePic = await ProfilePic.findById(user.profilePic);

    if (!profilePic) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    // Delete the profile picture from Cloudinary
    await deleteFile(profilePic.public_id);

    // Delete the profile picture document from the database
    await ProfilePic.findByIdAndDelete(profilePic._id);

    // Remove the reference to the profile picture from the user's document
    user.profilePic = undefined;
    await user.save();

    res.status(200).json({ message: "Profile picture deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
