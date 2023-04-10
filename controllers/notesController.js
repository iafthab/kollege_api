const Notes = require("./../models/Notes");
const asyncHandler = require("express-async-handler");

// @desc Get Notes for each Paper
// @route GET /Notes/:batch/:paper
// @access Everyone
const getNotes = async (req, res) => {
  if (!req?.params?.batch || !req?.params?.paper) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const notes = await Notes.find({
    batch: req.params.batch,
    paper: req.params.paper,
  }).exec();
  if (!Notes) {
    return res.status(404).json({
      message: `No Notes found for ${req.params.batch} in ${req.params.paper}`,
    });
  }
  res.json(notes);
};

// @desc Add Notes
// @route POST /Notes
// @access Private
const addNotes = asyncHandler(async (req, res) => {
  const { batch, paper, title, body } = req.body;

  // Confirm Data
  if (!batch || !paper || !title || !body) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await Notes.findOne({
    batch: req.params.batch,
    paper: req.params.paper,
    title: req.params.title,
    body: req.params.body,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Notes record already exists" });
  }

  const NotesObj = {
    batch,
    paper,
    title,
    body,
  };

  // Create and Store New teacher
  const record = await Notes.create(NotesObj);
  console.log(record);

  if (record) {
    res.status(201).json({
      message: `Notes added for ${req.params.paper}`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Notes
// @route PATCH /Notes
// @access Private
const updateNotes = asyncHandler(async (req, res) => {
  const { id, batch, paper, title, body } = req.body;

  // Confirm Data
  if (!id || !batch || !paper || !title || !body) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Notes.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Notes record doesn't exist" });
  }

  //   // Check for duplicate
  //   const duplicate = await Notes.findOne({
  //     batch: req.params.batch,
  //     paper: req.params.paper,
  //   })
  //     .lean()
  //     .exec();

  // Allow Updates to original
  //   if (duplicate && duplicate?._id.toString() !== id) {
  //     return res.status(409).json({ message: "Duplicate Username" });
  //   }

  record.batch = batch;
  record.paper = paper;
  record.title = title;
  record.body = body;

  const save = await record.save();
  if (save) {
    res.json({
      message: ` Note Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete Teacher
// @route DELETE /Teacher
// @access Private
const deleteNotes = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  const record = await Notes.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Note not found" });
  }

  await record.deleteOne();

  res.json({
    message: `Notes Record deleted`,
  });
});

module.exports = {
  getNotes,
  addNotes,
  updateNotes,
  deleteNotes,
};
