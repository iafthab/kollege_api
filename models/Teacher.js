const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-plugin-autoinc");

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
  phone: {
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
  advisor: {
    type: String,
    default: "none",
  },
});

// teacherSchema.plugin(AutoIncrement, {
//   id: "teacherIds",
//   inc_field: "teacher_id",
// });

// teacherSchema.plugin(autoIncrement, {
//   model: "Teacher",
//   field: "Teacher_Id",
//   startAt: 100,
// });

module.exports = mongoose.model("Teacher", teacherSchema);
