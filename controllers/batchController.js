const Batch = require("./../models/Batch");
const asyncHandler = require("express-async-handler");

// @desc Get Batch
// @route GET /Batch
// @access Everyone
const getBatch = async (req, res) => {
  if (!req?.params?.batch) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const batch = await Batch.findOne({ batch: req.params.batch }).exec();
  if (!batch) {
    return res
      .status(404)
      .json({ message: `Batch ${req.params.batch} not found` });
  }
  res.json(batch);
};

// @desc Add Batch
// @route POST /batch
// @access Private
const addBatch = asyncHandler(async (req, res) => {
  const { batch, department, course, semester, advisor, students } = req.body;

  // Confirm Data
  if (!batch || !department || !course || !semester || !advisor || !students) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await Batch.findOne({ batch: req.params.batch })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Batch record already exists" });
  }

  const BatchObj = {
    batch,
    department,
    course,
    semester,
    advisor,
    students,
  };

  // Create and Store New teacher
  const record = await Batch.create(BatchObj);
  console.log(record);

  if (record) {
    res.status(201).json({
      message: `New Batch ${req.params.batch} Created`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Batch
// @route PATCH /Batch
// @access Private
const updateBatch = asyncHandler(async (req, res) => {
  const { id, batch, department, course, semester, advisor, students } =
    req.body;

  // Confirm Data
  if (
    !id ||
    !batch ||
    !department ||
    !course ||
    !semester ||
    !advisor ||
    !students
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Batch.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Batch record doesn't exist" });
  }

  // Check for duplicate
  const duplicate = await Batch.findOne({ batch: req.params.batch })
    .lean()
    .exec();

  // Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Batch" });
  }

  record.batch = batch;
  record.department = department;
  record.course = course;
  record.semester = semester;
  record.advisor = advisor;
  record.students = students;

  const save = await record.save();
  if (save) {
    res.json({
      message: `${req.params.batch} Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete Batch
// @route DELETE /Batch
// @access Private
const deleteBatch = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Batch ID required" });
  }

  const record = await Batch.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Batch Record not found" });
  }

  await record.deleteOne();

  res.json({
    message: `Batch ${record.batch} Deleted`,
  });
});

module.exports = {
  getBatch,
  addBatch,
  updateBatch,
  deleteBatch,
};
