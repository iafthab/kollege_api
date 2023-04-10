const express = require("express");
const router = express.Router();
const teacherController = require("./../controllers/teacherController");

router
  .route("/")
  .get(teacherController.getAllTeachers)
  .post(teacherController.createNewTeacher)
  .patch(teacherController.updateTeacher)
  .delete(teacherController.deleteTeacher);

module.exports = router;
