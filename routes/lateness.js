const router = require("express").Router();
const Lateness = require("../models/Lateness");

//CREATE LATENESS
router.post("/", async (req, res) => {
  const newLateness = new Lateness(req.body);
  try {
    const savedLateness = await newLateness.save();
    return res.status(200).json(savedLateness);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//UPDATE LATENESS
router.put("/:id", async (req, res) => {
  try {
    const updatedLateness = await Lateness.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedLateness);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE LATENESS
router.delete("/:id", async (req, res) => {
  try {
    const lateness = await Lateness.findById(req.params.id);
    await lateness.delete();
    return res.status(200).json("Lateness has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET LATENESS
router.get("/:id", async (req, res) => {
  try {
    const latenessS = await Lateness.findById(req.params.id);
    return res.status(200).json(latenessS);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL LATENESS
router.get("/", async (req, res) => {
  try {
    let latenessS;
    latenessS = await Lateness.find();
    return res.status(200).json(latenessS);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//PATCH LATENESS
router.patch("/:id", async (req, res) => {
  try {
    const updatedLateness = await Lateness.findByIdAndUpdate(req.params.id, {
      $push: req.body,
    });
    return res.status(200).json(updatedLateness);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
