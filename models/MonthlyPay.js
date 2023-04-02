// monthlyPay.js
const mongoose = require("mongoose");

const monthlyPaySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    totalPay: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const MonthlyPay = mongoose.model("MonthlyPay", monthlyPaySchema);

module.exports = MonthlyPay;
