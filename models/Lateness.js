const mongoose = require("mongoose");

const latenessSchema = new mongoose.Schema(
  {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    deductionAmmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Lateness = mongoose.model("Lateness", latenessSchema);

module.exports = Lateness;
