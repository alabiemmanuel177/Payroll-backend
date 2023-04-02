const mongoose = require("mongoose");

const monthlyPayrollSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    totalPay: {
      type: Number,
      required: true,
    },
    employeePays: [
      {
        employee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
          required: true,
        },
        totalPay: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);


const MonthlyPayroll = mongoose.model("MonthlyPayroll", monthlyPayrollSchema);

module.exports = MonthlyPayroll;
