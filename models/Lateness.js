const mongoose = require("mongoose");

const latenessSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    lateMarkStartTime: {
      type: Date,
      required: true,
    },
    lateMarkEndTime: {
      type: Date,
      required: true,
    },
    deductionPercentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Lateness = mongoose.model("Lateness", latenessSchema);
module.exports = Lateness;
