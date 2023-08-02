const Paper = require("./../models/Paper");
const asyncHandler = require("express-async-handler");

// @desc Get Papers for each Teacher
// @route GET /Paper/teacher/teacherId
// @access Everyone
const getPapers = asyncHandler(async (req, res) => {
  if (!req?.params?.teacherId) {
    return res.status(400).json({ message: "Teacher ID Missing" });
  }
  const papers = await Paper.find({
    teacher: req.params.teacherId,
  })
    .select("-students")
    .exec();
  if (!papers) {
    return res.status(404).json({
      message: `No Paper(s) found`,
    });
  }
  res.json(papers);
});

// @desc Get Papers for each Teacher
// @route GET /paper/
// @access Everyone
const getAllPapers = asyncHandler(async (req, res) => {
  const papers = await Paper.find()
    .select("-students")
    .populate({
      path: "teacher",
      model: "Teacher",
      select: "name",
    })
    .exec();
  if (!papers) {
    return res.status(404).json({
      message: `No Paper(s) found`,
    });
  }
  res.json(papers);
});

// @desc Get Students for each paper
// @route GET /paper/students/:paperId
// @access Private
const getStudentsList = asyncHandler(async (req, res) => {
  if (!req?.params?.paperId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }

  const students = await Paper.findById(req.params.paperId)
    .select("students")
    .populate({ path: "students", select: "name" })
    .exec();
  console.log(students);
  if (!students?.students) {
    return res.status(400).json({ message: "No Students Found" });
  }
  res.json(students.students);
});

// @desc Get Paper
// @route GET /Paper
// @access Everyone
const getPaper = asyncHandler(async (req, res) => {
  if (!req?.params?.paperId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const paper = await Paper.findOne({
    _id: req.params.paperId,
  })
    .populate({ path: "teacher", select: "name" })
    .populate({ path: "students", select: "name" })
    .exec();
  if (!paper) {
    return res.status(404).json({
      message: `No Paper(s) found`,
    });
  }
  res.json(paper);
});

// @desc Add Paper
// @route POST /Paper
// @access Private
const addPaper = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { department, semester, year, paper, students, teacher } = req.body;

  // // Confirm Data
  // if (!department || !paper) {
  //   return res
  //     .status(400)
  //     .json({ message: "Incomplete Request: Fields Missing" });
  // }

  // Check for Duplicates
  const duplicate = await Paper.findOne({
    department: req.body.department,
    paper: req.body.paper,
    students: req.body.students,
    teacher: req.body.teacher,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Paper already exists" });
  }

  const PaperObj = {
    department,
    semester,
    paper,
    year,
    students,
    teacher,
  };
  console.log(PaperObj);

  // Create and Store New teacher
  const record = await Paper.create(PaperObj);
  console.log(record);

  if (record) {
    res.status(201).json({
      message: `New Paper ${req.body.paper} added `,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Paper
// @route PATCH /Paper
// @access Private
const updatePaper = asyncHandler(async (req, res) => {
  const { id, department, paper, students, teacher } = req.body;

  // Confirm Data
  if (!id || !department || !paper || !students || !teacher) {
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
    paper: req.params.paperId,
  })
    .lean()
    .exec();

  //   Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Paper" });
  }

  record.students = students;
  record.department = department;
  record.paper = paper;
  record.teacher = teacher;

  const save = await record.save();
  if (save) {
    res.json({
      message: `${paper} Updated`,
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
    return res.status(400).json({ message: "Paper ID required" });
  }

  const record = await Paper.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Paper not found" });
  }

  await record.deleteOne();

  res.json({ message: `${paper} deleted` });
});

module.exports = {
  addPaper,
  getAllPapers,
  getPapers,
  getStudentsList,
  getPaper,
  updatePaper,
  deletePaper,
};
