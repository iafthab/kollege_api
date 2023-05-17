const express = require("express");
const router = express.Router();
const teacherController = require("./../controllers/teacherController");

router.route("/list").get(teacherController.getTeacherList);
router.route("/approve/:Department").get(teacherController.getNewTeachers);

router
  .route("/")
  .post(teacherController.createNewTeacher)
  .patch(teacherController.approveTeacher)
  .delete(teacherController.deleteTeacher);

module.exports = router;
