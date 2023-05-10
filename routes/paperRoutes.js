const express = require("express");
const router = express.Router();
const paperController = require("./../controllers/paperController");

// TODO Student Side
// router.route('/:paper')
// .get()

router.route("/").post(paperController.addPaper);

router
  .route("/:paperId")
  .get(paperController.getPaper)
  // .post(paperController.addPaper)
  .patch(paperController.updatePaper)
  .delete(paperController.deletePaper);

router.route("/teacher/:teacherId").get(paperController.getPapers);

module.exports = router;
