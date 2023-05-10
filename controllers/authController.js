const Teacher = require("./../models/Teacher");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Auth Login
// @route POST /auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  const teacher = await Teacher.findOne({ username }).exec();

  if (!teacher) {
    return res.status(404).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, teacher.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });
  else {
    res.status(200).json(teacher);
  }
});

// // @desc Auth Logout
// // @route POST /auth/logout
// // @access Public
// const logout = asyncHandler(async (req, res) => {});

module.exports = { login };
