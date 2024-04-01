const { default: mongoose } = require("mongoose");
const Internal = require("./../models/Internal");
const asyncHandler = require("express-async-handler");

// @desc Get Internal Result
// @route GET /internal/:paper
// @access Everyone
const getInternal = asyncHandler(async (req, res) => {
  if (!req?.params?.paper) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const internal = await Internal.findOne({
    paper: req.params.paper,
  }).exec();
  if (!internal) {
    return res.status(404).json({
      message: "No Existing Record(s) found. Add New Record.",
    });
  }
  res.json(internal);
});

// @desc Get Internal Result
// @route GET /internal/student/:studentId
// @access Everyone
const getInternalStudent = asyncHandler(async (req, res) => {
  if (!req?.params?.studentId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const internal = await Internal.aggregate([
    {
      $lookup: {
        from: "paper",
        localField: "paper",
        foreignField: "_id",
        as: "paper",
      },
    },
    {
      $unwind: "$paper",
    },
    {
      $project: {
        marks: {
          $filter: {
            input: "$marks",
            as: "mark",
            cond: {
              $eq: [
                "$$mark._id",
                new mongoose.Types.ObjectId(req.params.studentId),
              ],
            },
          },
        },
        "paper.paper": 1,
      },
    },
    {
      $unwind: "$marks",
    },
  ]);
  if (!internal.length) {
    return res.status(404).json({
      message: "No Records Found.",
    });
  }
  res.json(internal);
});

// @desc Add Internal
// @route POST /Internal
// @access Private
const addInternal = asyncHandler(async (req, res) => {
  const { paper, marks } = req.body;

  // Confirm Data
  if (!paper || !marks) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }
  // Check for Duplicates
  const duplicate = await Internal.findOne({
    paper: req.params.paper,
  })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Internal record already exists" });
  }

  const InternalObj = {
    paper,
    marks,
  };
  // Create and Store New Internal Record
  const record = await Internal.create(InternalObj);
  if (record) {
    res.status(201).json({
      message: `Internal Record  Added`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Internal
// @route PATCH /Internal
// @access Private
const updateInternal = asyncHandler(async (req, res) => {
  const { id, paper, marks } = req.body;

  // Confirm Data
  if (!id || !paper || !marks) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Internal.findById(id).exec();
  if (!record) {
    return res.status(404).json({ message: "Internal record doesn't exist" });
  }

  // Check for duplicate
  const duplicate = await Internal.findOne({
    paper: req.params.paper,
  })
    .lean()
    .exec();

  // Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Username" });
  }
  record.paper = paper;
  record.marks = marks;
  const save = await record.save();
  if (save) {
    res.json({
      message: ` Internal Record Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete Internal Record
// @route DELETE /Internal Record
// @access Private
const deleteInternal = asyncHandler(async (req, res) => {
  const id = req.params.paper;

  if (!id) {
    return res.status(400).json({ message: "Internal ID required" });
  }

  const record = await Internal.findById(id).exec();
  if (!record) {
    return res.status(404).json({ message: "Internal Record not found" });
  }

  await record.deleteOne();
  res.json({
    message: `Internal Record deleted`,
  });
});

module.exports = {
  getInternal,
  getInternalStudent,
  addInternal,
  updateInternal,
  deleteInternal,
};
