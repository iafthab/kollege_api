const express = require("express");
const router = express.Router();
const notesController = require("./../controllers/notesController");

// TODO Student Side
// router.route('/paper')
// .get()

router
  .route("/paper/:paperId")
  .get(notesController.getNotes)
  .post(notesController.addNotes);

router
  .route("/NoteId")
  .patch(notesController.updateNotes)
  .delete(notesController.deleteNotes);

module.exports = router;
