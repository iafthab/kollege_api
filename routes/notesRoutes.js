const express = require("express");
const router = express.Router();
const notesController = require("./../controllers/notesController");

router
  .route("/:noteId")
  .get(notesController.getNote)
  .patch(notesController.updateNotes)
  .delete(notesController.deleteNotes);

router
  .route("/paper/:paperId")
  .get(notesController.getNotes)
  .post(notesController.addNotes);

module.exports = router;
