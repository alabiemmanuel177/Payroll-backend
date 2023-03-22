const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    pay: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;
