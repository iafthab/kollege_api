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
  if (!notes) {
    return res.status(404).json({
      message: `No Notes found for ${req.params.paper}`,
    });
  }
  res.json(notes);
};

// // @desc Get Notes for each Paper
// // @route GET /Notes/:paper
// // @access Everyone
// const getNote = async (req, res) => {
//   if (!req?.params?.noteId) {
//     return res
//       .status(400)
//       .json({ message: "Incomplete Request: Params Missing" });
//   }
//   const notes = await Notes.find({
//     paper: req.params.paper,
//   }).exec();
//   if (!Notes) {
//     return res.status(404).json({
//       message: `No Notes found for ${req.params.paper}`,
//     });
//   }
//   res.json(notes);
// };

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

  // // Check for Duplicates
  // const duplicate = await Notes.findOne({
  //   paper: req.params.paper,
  //   title: req.params.title,
  //   body: req.params.body,
  // })
  //   .lean()
  //   .exec();

  // if (duplicate) {
  //   return res.status(409).json({ message: "Notes record already exists" });
  // }

  const NotesObj = {
    paper,
    title,
    body,
  };

  // Create and Store New teacher
  const record = await Notes.create(NotesObj);
  console.log(record);

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
  if (!id || !paper || !title || !body) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Notes.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Notes record doesn't exist" });
  }

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
