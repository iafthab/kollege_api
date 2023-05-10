const mongoose = require("mongoose");

// Teacher Details
const teacherSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  password: {
    // username+12
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      default: "Teacher",
    },
  ],
});

module.exports = mongoose.model("Teacher", teacherSchema);
