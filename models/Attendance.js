const mongoose = require("mongoose");

// Attendance of Students
const attendanceSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    hour: {
      type: Number,
      required: true,
    },
    attendance: {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student",
      },
      present: {
        type: Boolean,
        default: "true",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
