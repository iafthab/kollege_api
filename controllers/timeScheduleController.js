const TimeSchedule = require("./../models/TimeSchedule");
const asyncHandler = require("express-async-handler");

// @desc Get TimeSchedule for each User
// @route GET /TimeSchedule
// @access Everyone
const getTimeSchedule = async (req, res) => {
  if (!req?.params?.user_id) {
    return res.status(400).json({ message: "ID Required" });
  }
  const timeSchedule = await TimeSchedule.findOne({
    user: req.params.user_id,
  }).exec();
  if (!timeSchedule) {
    return res.status(404).json({
      message: `Time Schedule not found`,
    });
  }
  res.json(timeSchedule);
};

// @desc Add TimeSchedule
// @route POST /time_Schedule
// @access Private
const addTimeSchedule = asyncHandler(async (req, res) => {
  const { user, schedule } = req.body;

  // Confirm Data
  if (!user || !schedule) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await TimeSchedule.findOne({
    user: user,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Time Schedule already exists" });
  }

  const TimeScheduleObj = {
    user,
    schedule,
  };

  // Create and Store New Time Schedule
  const record = await TimeSchedule.create(TimeScheduleObj);

  if (record) {
    res.status(201).json({
      message: `Time Schedule added successfully`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update TimeSchedule
// @route PATCH /TimeSchedule
// @access Private
const updateTimeSchedule = asyncHandler(async (req, res) => {
  const { user, schedule } = req.body;

  // Confirm Data
  if (!user || !schedule) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await TimeSchedule.findOne({ user: user }).exec();

  if (!record) {
    return res.status(404).json({ message: "Time Schedule doesn't exist" });
  }

  // // Check for duplicate
  // const duplicate = await TimeSchedule.findOne({
  //   user_id: req.params.user_id,
  // })
  //   .lean()
  //   .exec();

  // // Allow Updates to original
  // if (duplicate && duplicate?._id.toString() !== id) {
  //   return res.status(409).json({ message: "Duplicate Time Schedule" });
  // }

  record.schedule = schedule;

  const save = await record.save();
  if (save) {
    res.json({ message: `Time Schedule Updated` });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete TimeSchedule
// @route DELETE /time_schedule
// @access Private
const deleteTimeSchedule = asyncHandler(async (req, res) => {
  if (!req?.params?.user_id) {
    return res.status(400).json({ message: "ID Required" });
  }

  const record = await TimeSchedule.findById(req.params.user_id).exec();
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
