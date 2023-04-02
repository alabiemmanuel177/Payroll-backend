const mongoose = require("mongoose");

const deductionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Deduction = mongoose.model("Deduction", deductionSchema);

module.exports = Deduction;
