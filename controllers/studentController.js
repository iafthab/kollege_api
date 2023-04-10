const Student = require("./../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all Student
// @route GET /Student
// @access Private
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().select("-password").lean();
  if (!students?.length) {
    return res.status(400).json({ message: "No Students Found" });
  }
  res.json(students);
});

// @desc Create New Student
// @route POST /Student
// @access Private
const createNewStudent = asyncHandler(async (req, res) => {
  const {
    admission_no,
    name,
    email,
    phone,
    department,
    course,
    batch,
    password,
  } = req.body;

  // Confirm Data
  if (
    !admission_no ||
    !name ||
    !email ||
    !phone ||
    !department ||
    !course ||
    !batch ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for Duplicates
  const duplicate = await Student.findOne({ admission_no }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Admission Number" });
  }

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const studentObj = {
    admission_no,
    name,
    email,
    phone,
    department,
    course,
    batch,
    password: hashedPwd,
  };

  // Create and Store New student
  const student = await Student.create(studentObj);

  if (student) {
    res.status(201).json({ message: `New Student ${admission_no} created` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Student
// @route PATCH /Student
// @access Private
const updateStudent = asyncHandler(async (req, res) => {
  const {
    id,
    admission_no,
    name,
    email,
    phone,
    department,
    course,
    batch,
    password,
  } = req.body;

  // Confirm Data
  if (
    !id ||
    !admission_no ||
    !name ||
    !email ||
    !phone ||
    !department ||
    !course ||
    !batch
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Student
  const student = await Student.findById(id).exec();

  if (!student) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await Student.findOne({ admission_no }).lean().exec();

  // Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Admission Number" });
  }

  student.admission_no = admission_no;
  student.name = name;
  student.email = email;
  student.phone = phone;
  student.course = course;
  student.department = department;
  student.batch = batch;

  if (password) {
    // Hash Pwd
    student.password = await bcrypt.hash(password, 10);
  }

  await student.save();

  res.json({ message: "User Updated" });
});

// @desc Delete Student
// @route DELETE /Student
// @access Private
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Student ID required" });
  }

  const student = await Student.findById(id).exec();

  if (!student) {
    return res.status(400).json({ message: "Student not found" });
  }

  const result = await student.deleteOne();

  res.json({ message: `${result.admission_no} deleted` });
});

module.exports = {
  getAllStudents,
  createNewStudent,
  updateStudent,
  deleteStudent,
};
