const router = require("express").Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

//UPDATE ADMIN
router.put("/:id", async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedAdmin);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE ADMIN
router.delete("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    await admin.delete();
    return res.status(200).json("admin has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ADMIN
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    return res.status(200).json(admin);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL ADMIN
router.get("/", async (req, res) => {
  try {
    let admins;
    admins = await Admin.find();
    return res.status(200).json(admins);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//PATCH ADMIN
router.patch("/:id", async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, {
      $push: req.body,
    });
    return res.status(200).json(updatedAdmin);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//CHANGE PASSWORD ADMIN
router.post("/change-password", async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({ _id: id });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Incorrect old password" });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();
    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
