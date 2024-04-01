const { mongoose } = require("mongoose");
const Paper = require("./../models/Paper");
const asyncHandler = require("express-async-handler");

// @desc Get Papers for each Staff
// @route GET /Paper/staff/staffId
// @access Everyone
const getPapersStaff = asyncHandler(async (req, res) => {
  if (!req?.params?.staffId) {
    return res.status(400).json({ message: "Staff ID Missing" });
  }
  const papers = await Paper.find({
    teacher: req.params.staffId,
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

// @desc Get Papers for each Student
// @route GET /paper/student/:studentId
// @access Everyone
const getPapersStudent = asyncHandler(async (req, res) => {
  if (!req?.params?.studentId) {
    return res.status(400).json({ message: "Student ID Missing" });
  }
  const papers = await Paper.aggregate([
    {
      $lookup: {
        from: "staffs",
        localField: "teacher",
        foreignField: "_id",
        as: "teacher",
      },
    },
    {
      $unwind: "$teacher",
    },
    {
      $project: {
        students: {
          $in: [new mongoose.Types.ObjectId(req.params.studentId), "$students"],
        },
        semester: 1,
        year: 1,
        paper: 1,
        "teacher.name": 1,
      },
    },
    {
      $match: { students: true },
    },
  ]);
  if (!papers) {
    return res.status(404).json({
      message: `No Paper(s) found`,
    });
  }
  console.log(papers);
  res.json(papers);
});

// @desc Get All Papers
// @route GET /paper/
// @access Everyone
const getAllPapers = asyncHandler(async (req, res) => {
  if (!req?.params?.studentId) {
    return res.status(400).json({ message: "Student ID Missing" });
  }

  const papers = await Paper.aggregate([
    {
      $lookup: {
        from: "staffs",
        localField: "teacher",
        foreignField: "_id",
        as: "teacher",
      },
    },
    {
      $unwind: "$teacher",
    },
    {
      $project: {
        semester: 1,
        year: 1,
        paper: 1,
        "teacher.name": 1,
        students: 1,
        department: 1,
        joined: {
          $in: [new mongoose.Types.ObjectId(req.params.studentId), "$students"],
        },
      },
    },
  ]);
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
  if (!students?.students.length) {
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
  const { department, semester, year, paper, students, teacher } = req.body;

  // Confirm Data
  if (!department || !paper || !semester || !year || !students || !teacher) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

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

  // Create and Store New staff
  const record = await Paper.create(PaperObj);

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
const updateStudents = asyncHandler(async (req, res) => {
  const { id, students } = req.body;

  // Confirm Data
  if (!id || !students) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Paper.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Paper doesn't exist" });
  }

  record.students = students;

  const save = await record.save();
  if (save) {
    res.json({ message: "Updated" });
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
  getPapersStaff,
  getPapersStudent,
  getStudentsList,
  getPaper,
  updateStudents,
  deletePaper,
};
