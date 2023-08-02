const mongoose = require("mongoose");

// Student Details
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  course: {
    type: String,
  },
  papers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      default: [],
    },
  ],
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
