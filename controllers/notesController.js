const Notes = require("./../models/Notes");
const asyncHandler = require("express-async-handler");

// @desc Get Notes for each Paper
// @route GET /Notes/:paper
// @access Everyone
const getNotes = async (req, res) => {
  if (!req?.params?.paperId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const notes = await Notes.find({
    paper: req.params.paperId,
  }).exec();
  if (!notes.length) {
    return res.status(404).json({
      message: `No Notes found`,
    });
  }
  res.json(notes);
};

// @desc Get Notes for each Paper
// @route GET /Notes/:paper
// @access Everyone
const getNote = async (req, res) => {
  if (!req?.params?.noteId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const Note = await Notes.findById(req.params.noteId).exec();
  if (!Note) {
    return res.status(404).json({
      message: "Note Not Found",
    });
  }
  res.json(Note);
};

// @desc Add Notes
// @route POST /Notes
// @access Private
const addNotes = asyncHandler(async (req, res) => {
  const { paper, title, body } = req.body;

  // Confirm Data
  if (!paper || !title || !body) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await Notes.findOne({
    paper: req.params.paper,
    title: req.params.title,
    body: req.params.body,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Note already exists" });
  }

  const NotesObj = {
    paper,
    title,
    body,
  };

  // Create and Store New Note
  const record = await Notes.create(NotesObj);

  if (record) {
    res.status(201).json({
      message: `Note Added Successfully`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Notes
// @route PATCH /Notes
// @access Private
const updateNotes = asyncHandler(async (req, res) => {
  const { id, paper, title, body } = req.body;

  // Confirm Data
  if (!paper || !title || !body) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Notes.findById(req.params.noteId).exec();

  if (!record) {
    return res.status(404).json({ message: "Note doesn't exist" });
  }

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

// @desc Delete Note
// @route DELETE /Note
// @access Private
const deleteNotes = asyncHandler(async (req, res) => {
  if (!req.params.noteId) {
    return res.status(400).json({ message: "Note ID required" });
  }

  const record = await Notes.findById(req.params.noteId).exec();

  if (!record) {
    return res.status(404).json({ message: "Note not found" });
  }

  await record.deleteOne();

  res.json({
    message: `Note Deleted`,
  });
});

module.exports = {
  getNotes,
  getNote,
  addNotes,
  updateNotes,
  deleteNotes,
};
