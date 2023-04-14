const Paper = require("./../models/Paper");
const asyncHandler = require("express-async-handler");

// @desc Get Paper for each Paper
// @route GET /Paper
// @access Everyone
const getPapers = async (req, res) => {
  if (!req?.params?.teacherId) {
    return res.status(400).json({ message: "Teacher ID Missing" });
  }
  const papers = await Paper.find({
    teachers: req.params.teacherId,
  }).exec();
  if (!papers) {
    return res.status(404).json({
      message: `No Paper found for ${req.params.teacherId}`,
    });
  }
  res.json(papers);
};

// @desc Get Paper for each Paper
// @route GET /Paper
// @access Everyone
const getPaper = async (req, res) => {
  if (
    !req?.params?.paper ||
    !req?.params?.department ||
    !req?.params?.teachers
  ) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const paper = await Paper.find({
    department: req.params.department,
    paper: req.params.paper,
    students: req.params.students,
    teachers: req.params.teachers,
  }).exec();
  if (!paper) {
    return res.status(404).json({
      message: `No Paper found for ${req.params.paper}`,
    });
  }
  res.json(paper);
};

// @desc Add Paper
// @route POST /Paper
// @access Private
const addPaper = asyncHandler(async (req, res) => {
  const { department, paper, students, teachers } = req.body;

  // Confirm Data
  if (!department || !paper || !students || !teachers) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await Paper.findOne({
    department: req.params.department,
    paper: req.params.paper,
    students: req.params.students,
    teachers: req.params.teachers,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Paper record already exists" });
  }

  const PaperObj = {
    department,
    paper,
    students,
    teachers,
  };

  // Create and Store New teacher
  const record = await Paper.create(PaperObj);
  console.log(record);

  if (record) {
    res.status(201).json({
      message: `Paper added for ${req.params.paper}`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Paper
// @route PATCH /Paper
// @access Private
const updatePaper = asyncHandler(async (req, res) => {
  const { id, department, paper, students, teachers } = req.body;

  // Confirm Data
  if (!id || !department || !paper || !students || !teachers) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Paper.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Paper doesn't exist" });
  }

  //! Needs Testing
  // Check for duplicate
  const duplicate = await Paper.findOne({
    department: req.params.department,
    paper: req.params.paper,
    students: req.params.students,
    teachers: req.params.paper,
  })
    .lean()
    .exec();

  //   Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Paper" });
  }

  record.department = department;
  record.paper = paper;
  record.students = students;
  record.teachers = teachers;

  const save = await record.save();
  if (save) {
    res.json({
      message: `Note Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete Paper
// @route DELETE /Paper
// @access Private
const deletePaper = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  const record = await Paper.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Note not found" });
  }

  await record.deleteOne();

  res.json({ message: `Paper deleted` });
});

module.exports = {
  getPapers,
  getPaper,
  addPaper,
  updatePaper,
  deletePaper,
};
