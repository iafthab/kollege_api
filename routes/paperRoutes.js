const express = require("express");
const router = express.Router();
const paperController = require("./../controllers/paperController");

router.route("/").post(paperController.addPaper);
router.route("/staff/:staffId").get(paperController.getPapersStaff);

router.route("/manage/:studentId").get(paperController.getAllPapers);
router.route("/students/:paperId").get(paperController.getStudentsList);
router.route("/student/:studentId").get(paperController.getPapersStudent);

router
  .route("/:paperId")
  .get(paperController.getPaper)
  .patch(paperController.updateStudents)
  .delete(paperController.deletePaper);

module.exports = router;
