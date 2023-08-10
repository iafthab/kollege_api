const Teacher = require("./../models/Teacher");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get Teacher
// @route GET /teacher
// @access Private
const getTeacher = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const teacher = await Teacher.findById(req.params.id)
    .select("-password -_id -__v")
    .lean();
  if (!teacher) {
    return res.status(404).json({ message: "No Teacher Found." });
  }
  res.json(teacher);
});

// @desc Get all Teachers
// @route GET /Teachers
// @access Private
const getNewTeachers = asyncHandler(async (req, res) => {
  if (!req?.params?.department)
    return res.status(400).json({ message: "Params Missing" });

  const teachers = await Teacher.find({
    department: req.params.department,
    roles: [],
  })
    .select("-password")
    .lean();
  if (!teachers?.length) {
    return res.status(404).json({ message: "No Registered Teacher(s) Found." });
  }
  res.json(teachers);
});

// @desc Get Teacher Names only
// @route GET /TeachersList
// @access Private
const getTeacherList = asyncHandler(async (req, res) => {
  if (!req?.params?.department)
    return res.status(400).json({ message: "Params Missing" });

  const teachersList = await Teacher.find({
    department: req.params.department,
  })
    .select("name")
    .lean();
  if (!teachersList?.length) {
    return res.status(400).json({ message: "No Teacher(s) Found" });
  }
  res.json(teachersList);
});

// @desc Create New Teacher
// @route POST /Teacher
// @access Private
const createNewTeacher = asyncHandler(async (req, res) => {
  const { username, name, email, qualification, department, password, roles } =
    req.body;

  // Confirm Data
  if (
    !username ||
    !name ||
    !email ||
    !qualification ||
    !department ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for Duplicates
  const duplicate = await Teacher.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const teacherObj = {
    username,
    name,
    email,
    qualification,
    department,
    password: hashedPwd,
    roles,
  };

  // Create and Store New teacher
  const teacher = await Teacher.create(teacherObj);

  if (teacher) {
    res.status(201).json({ message: `New Teacher ${username} Registered` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Teacher
// @route PATCH /Teacher
// @access Private
const approveTeacher = asyncHandler(async (req, res) => {
  const { id, roles } = req.body;

  // Confirm Data
  if ((!id, !roles)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Find Teacher
  const teacher = await Teacher.findById(id).exec();
  if (!teacher) {
    return res.status(400).json({ message: "User not found" });
  }

  teacher.roles = roles;

  // if (password) {
  //   // Hash Pwd
  //   teacher.password = await bcrypt.hash(password, 10);
  // }
  await teacher.save();

  res.json({ message: "Teacher Approved" });
});

// @desc Delete Teacher
// @route DELETE /Teacher
// @access Private
const deleteTeacher = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Teacher ID required" });
  }

  const teacher = await Teacher.findById(id).exec();

  if (!teacher) {
    return res.status(400).json({ message: "Teacher not found" });
  }

  const result = await teacher.deleteOne();

  res.json({ message: `${result.username} deleted` });
});

module.exports = {
  getTeacher,
  getNewTeachers,
  getTeacherList,
  createNewTeacher,
  approveTeacher,
  deleteTeacher,
};
