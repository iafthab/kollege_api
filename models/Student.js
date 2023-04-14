const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-plugin-autoinc");

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
  phone: {
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
  papers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Paper,
      default: [],
    },
  ],
  admission_no: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// studentSchema.plugin(autoIncrement, {
//   model: "Student",
//   field: "Student_Id",
//   startAt: 100,
// });

module.exports = mongoose.model("Student", studentSchema);
