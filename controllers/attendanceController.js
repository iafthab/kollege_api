const Attendance = require("./../models/Attendance");
const asyncHandler = require("express-async-handler");

// @desc Get Attendance
// @route GET /attendance
// @access Everyone
const getAttendance = async (req, res) => {
  if (!req?.params?.class || !req?.params?.date || !req?.params?.hour) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const attendance = await Attendance.findOne({
    batch: req.params.batch,
    date: req.params.date,
    hour: req.params.hour,
  }).exec();
  if (!attendance) {
    return res.status(404).json({
      message: `No Attendance Record found for ${req.params.batch} on ${req.params.date} ${req.params.hour} hour`,
    });
  }
  res.json(attendance);
};

// @desc Add Attendance
// @route POST /attendance
// @access Private
const addAttendance = asyncHandler(async (req, res) => {
  const { batch, date, hour, attendance } = req.body;

  // Confirm Data
  if (!batch || !date || !hour || !attendance) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }

  // Check for Duplicates
  const duplicate = await Attendance.findOne({
    class: req.params.batch,
    date: req.params.date,
    hour: req.params.hour,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Attendance record already exists" });
  }

  const attendanceObj = {
    batch,
    date,
    hour,
    attendance,
  };

  // Create and Store New teacher
  const record = await Attendance.create(attendanceObj);
  console.log(record);

  if (record) {
    res.status(201).json({
      message: `New Attendance Record for ${req.params.batch} on ${req.params.date} ${req.params.hour} hour Added`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Attendance
// @route PATCH /attendance
// @access Private
const updateAttendance = asyncHandler(async (req, res) => {
  const { id, batch, date, hour, attendance } = req.body;

  // Confirm Data
  if (!id || !batch || !date || !hour || !attendance) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Attendance.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Attendance record doesn't exist" });
  }

  //   // Check for duplicate
  //   const duplicate = await Teacher.findOne({
  //     class: req.params.batch,
  //     date: req.params.date,
  //     hour: req.params.hour,
  //   })
  //     .lean()
  //     .exec();

  //   // Allow Updates to original
  //   if (duplicate && duplicate?._id.toString() !== id) {
  //     return res.status(409).json({ message: "Duplicate Username" });
  //   }

  record.batch = batch;
  record.date = date;
  record.hour = hour;
  record.attendance = attendance;

  const save = await record.save();
  if (save) {
    res.json({
      message: `${req.params.batch} on ${req.params.date} ${req.params.hour} hour Record Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete Teacher
// @route DELETE /Teacher
// @access Private
const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Attendance ID required" });
  }

  const record = await Attendance.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Attendance Record not found" });
  }

  await record.deleteOne();

  res.json({
    message: `Attendance Record found for ${record.batch} on ${record.date} ${record.hour} hour deleted`,
  });
});

module.exports = {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
};
