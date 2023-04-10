const mongoose = require("mongoose");

// Individual Batches in a Department
const batchSchema = new mongoose.Schema({
  batch: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: [],
    },
  ],
});

module.exports = mongoose.model("Batch", batchSchema);
