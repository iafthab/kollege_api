const express = require("express");
const router = express.Router();
const paperController = require("./../controllers/paperController");

router
  .route("/")
  .post(paperController.addPaper)
  .get(paperController.getAllPapers);

router.route("/students/:paperId").get(paperController.getStudentsList);
router.route("/teacher/:teacherId").get(paperController.getPapers);

router
  .route("/:paperId")
  .get(paperController.getPaper)
  .patch(paperController.updatePaper)
  .delete(paperController.deletePaper);

module.exports = router;
