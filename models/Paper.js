const mongoose = require("mongoose");

// Individual Paper in a Course
const paperSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  paper: {
    type: String,
    required: true,
  },
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
  teachers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
});

module.exports = mongoose.model("Paper", paperSchema);
