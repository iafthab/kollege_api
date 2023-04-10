const mongoose = require("mongoose");

// Internal Result of Students
const internalResultSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
  },
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper",
  },
  marks: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      internal1: {
        type: Number,
        required: true,
      },
      internal2: {
        type: Number,
        required: true,
      },
      seminar: {
        type: Number,
        required: true,
      },
      assignment: {
        type: Number,
        required: true,
      },
      attendance: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Internal_Result", internalResultSchema);
