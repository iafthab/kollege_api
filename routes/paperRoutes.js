const express = require("express");
const router = express.Router();
const paperController = require("./../controllers/paperController");

// TODO Student Side
// router.route('/:paper')
// .get()

router.route("/:teacherId").get(paperController.getPapers);

router
  .route("/paper/:paper")
  .get(paperController.getPaper)
  .post(paperController.addPaper)
  .patch(paperController.updatePaper)
  .delete(paperController.deletePaper);

module.exports = router;
