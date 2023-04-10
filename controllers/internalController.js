const Internal = require("./../models/InternalResult");
const asyncHandler = require("express-async-handler");

// @desc Get Internal Result
// @route GET /internal/:class/:paper
// @access Everyone
const getInternal = async (req, res) => {
  if (!req?.params?.batch || !req?.params?.paper) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const internal = await Internal.findOne({
    batch: req.params.batch,
    paper: req.params.paper,
  }).exec();
  if (!internal) {
    return res.status(404).json({
      message: `No Internal Record found for ${req.params.batch} in ${req.params.paper}`,
    });
  }
  res.json(internal);
};

// @desc Add Internal
// @route POST /Internal
// @access Private
const addInternal = asyncHandler(async (req, res) => {
  const { batch, paper, marks } = req.body;

  // Confirm Data
  if (!batch || !paper || !marks) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await Internal.findOne({
    batch: req.params.batch,
    paper: req.params.paper,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Internal record already exists" });
  }

  const InternalObj = {
    batch,
    paper,
    marks,
  };

  // Create and Store New teacher
  const record = await Internal.create(InternalObj);
  console.log(record);

  if (record) {
    res.status(201).json({
      message: `Internal Record for ${req.params.batch} on ${req.params.paper} Added`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Internal
// @route PATCH /Internal
// @access Private
const updateInternal = asyncHandler(async (req, res) => {
  const { id, batch, paper, marks } = req.body;

  // Confirm Data
  if (!id || !batch || !paper || !marks) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Internal.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Internal record doesn't exist" });
  }

  // Check for duplicate
  const duplicate = await Internal.findOne({
    batch: req.params.batch,
    paper: req.params.paper,
  })
    .lean()
    .exec();

  // Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  record.batch = batch;
  record.paper = paper;
  record.marks = marks;

  const save = await record.save();
  if (save) {
    res.json({
      message: `${req.params.batch}'s ${req.params.paper} Internal Record Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete Teacher
// @route DELETE /Teacher
// @access Private
const deleteInternal = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Internal ID required" });
  }

  const record = await Internal.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Internal Record not found" });
  }

  await record.deleteOne();

  res.json({
    message: `Internal Record found for ${record.batch} on ${record.papaer} deleted`,
  });
});

module.exports = {
  getInternal,
  addInternal,
  updateInternal,
  deleteInternal,
};
