const express = require("express");
const router = express.Router();
const notesController = require("./../controllers/notesController");

// TODO Student Side
// router.route('/paper')
// .get()

router
  .route("/:batch/:paper")
  .get(notesController.getNotes)
  .post(notesController.addNotes)
  .patch(notesController.updateNotes)
  .delete(notesController.deleteNotes);

module.exports = router;
