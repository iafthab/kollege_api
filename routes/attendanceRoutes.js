const express = require("express");
const router = express.Router();
const attendanceController = require("./../controllers/attendanceController");

// TODO Student Side
router
  .route("/student/:studentId/:date")
  .get(attendanceController.getAttendanceStudent);

router
  .route("/:paper/:date/:hour")
  .get(attendanceController.getAttendance)
  .post(attendanceController.addAttendance)
  .patch(attendanceController.updateAttendance);

router.route("/:id").delete(attendanceController.deleteAttendance);

module.exports = router;
