const router = require("express").Router();
const Position = require("../models/Position");

//CREATE CATEGORY
router.post("/", async (req, res) => {
  const newPosition = new Position(req.body);
  try {
    const savedPosition = await newPosition.save();
    return res.status(200).json(savedPosition);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//UPDATE CATEGORY
router.put("/:id", async (req, res) => {
  try {
    const updatedPosition = await Position.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedPosition);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE CATEGORY
router.delete("/:id", async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    await position.delete();
    return res.status(200).json("Position has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET CATEGORY
router.get("/:id", async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    return res.status(200).json(position);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL CATEGORY
router.get("/", async (req, res) => {
  try {
    let positions;
    positions = await Position.find();
    return res.status(200).json(positions);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//PATCH CATEGORY
router.patch("/:id", async (req, res) => {
  try {
    const updatedPosition = await Position.findByIdAndUpdate(req.params.id, {
      $push: req.body,
    });
    return res.status(200).json(updatedPosition);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
