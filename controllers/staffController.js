const Staff = require("../models/Staff");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get Staff
// @route GET /staff
// @access Private
const getStaff = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const staff = await Staff.findById(req.params.id)
    .select("-password -_id -__v")
    .lean();
  if (!staff) {
    return res.status(404).json({ message: "No Staff Found." });
  }
  res.json(staff);
});

// @desc Get all Staffs
// @route GET /Staffs
// @access Private
const getNewStaffs = asyncHandler(async (req, res) => {
  if (!req?.params?.department)
    return res.status(400).json({ message: "Params Missing" });

  const staffs = await Staff.find({
    department: req.params.department,
    role: "",
  })
    .select("-password")
    .lean();
  if (!staffs?.length) {
    return res.status(404).json({ message: "No Registered Staff(s) Found." });
  }
  res.json(staffs);
});

// @desc Get Staff Names only
// @route GET /StaffsList
// @access Private
const getStaffList = asyncHandler(async (req, res) => {
  if (!req?.params?.department)
    return res.status(400).json({ message: "Params Missing" });

  const staffsList = await Staff.find({
    department: req.params.department,
    role:{
      $in:['teacher','HOD']
    }
  })
    .select("name")
    .lean();
  if (!staffsList?.length) {
    return res.status(400).json({ message: "No Staff(s) Found" });
  }
  console.log(staffsList);
  res.json(staffsList);
});

// @desc Create New Staff
// @route POST /Staff
// @access Private
const createNewStaff = asyncHandler(async (req, res) => {
  const { username, name, email, department, password, role } = req.body;

  // Confirm Data
  if (!username || !name || !email || !department || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for Duplicates
  const duplicate = await Staff.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const staffObj = {
    username,
    name,
    email,
    department,
    password: hashedPwd,
    role,
  };

  // Create and Store New staff
  const staff = await Staff.create(staffObj);

  if (staff) {
    res.status(201).json({ message: `New Staff ${username} Registered` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Staff
// @route PATCH /Staff
// @access Private
const approveStaff = asyncHandler(async (req, res) => {
  const { id, role } = req.body;

  // Confirm Data
  if ((!id, !role)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Find Staff
  const staff = await Staff.findById(id).exec();
  if (!staff) {
    return res.status(400).json({ message: "User not found" });
  }

  staff.role = role;

  // if (password) {
  //   // Hash Pwd
  //   staff.password = await bcrypt.hash(password, 10);
  // }
  await staff.save();

  res.json({ message: "Staff Approved" });
});

// @desc Delete Staff
// @route DELETE /Staff
// @access Private
const deleteStaff = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Staff ID required" });
  }

  const staff = await Staff.findById(id).exec();

  if (!staff) {
    return res.status(400).json({ message: "Staff not found" });
  }

  const result = await staff.deleteOne();

  res.json({ message: `${result.username} deleted` });
});

module.exports = {
  getStaff,
  getNewStaffs,
  getStaffList,
  createNewStaff,
  approveStaff,
  deleteStaff,
};
