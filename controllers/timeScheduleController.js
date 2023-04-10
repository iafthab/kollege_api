const TimeSchedule = require("./../models/TimeSchedule");
const asyncHandler = require("express-async-handler");

// @desc Get TimeSchedule for each Teacher
// @route GET /TimeSchedule
// @access Everyone
const getTimeSchedule = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID Required" });
  }
  const timeSchedule = await TimeSchedule.findOne({
    teacher_id: req.params.teacher_id,
  }).exec();
  if (!timeSchedule) {
    return res.status(404).json({
      message: `No TimeSchedule found for ${req.params.teacher_id}`,
    });
  }
  res.json(timeSchedule);
};

// @desc Add TimeSchedule
// @route POST /time_Schedule
// @access Private
const addTimeSchedule = asyncHandler(async (req, res) => {
  const { teacher, teacher_id, schedule } = req.body;

  // Confirm Data
  if (!teacher || !teacher_id || !schedule) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await TimeSchedule.findOne({
    teacher_id: req.params.teacher_id,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Time Schedule already exists" });
  }

  const TimeScheduleObj = {
    teacher,
    teacher_id,
    schedule,
  };

  // Create and Store New Time Schedule
  const record = await TimeSchedule.create(TimeScheduleObj);
  console.log(record);

  if (record) {
    res.status(201).json({
      message: `TimeSchedule added for ${req.params.teacher}`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update TimeSchedule
// @route PATCH /TimeSchedule
// @access Private
const updateTimeSchedule = asyncHandler(async (req, res) => {
  const { id, teacher, teacher_id, schedule } = req.body;

  // Confirm Data
  if (!id || !teacher || !teacher_id || !schedule) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await TimeSchedule.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Time Schedule doesn't exist" });
  }

  //   // Check for duplicate
  //   const duplicate = await TimeSchedule.findOne({
  //     teacher_id: req.params.teacher_id,
  //   })
  //     .lean()
  //     .exec();

  //   // Allow Updates to original
  //   if (duplicate && duplicate?._id.toString() !== id) {
  //     return res.status(409).json({ message: "Duplicate Time Schedule" });
  //   }

  record.teacher = teacher;
  record.teacher_id = teacher_id;
  record.schedule = schedule;

  const save = await record.save();
  if (save) {
    res.json({ message: `Note Updated` });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete TimeSchedule
// @route DELETE /time_schedule
// @access Private
const deleteTimeSchedule = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID required" });
  }
  const record = await TimeSchedule.findById(id).exec();
  if (!record) {
    return res.status(404).json({ message: "Time Schedule not found" });
  }
  await record.deleteOne();
  res.json({ message: `Time Schedule deleted` });
});

module.exports = {
  getTimeSchedule,
  addTimeSchedule,
  updateTimeSchedule,
  deleteTimeSchedule,
};
