const express = require("express");
const router = express.Router();
const attendanceController = require("./../controllers/attendanceController");

// TODO Student Side
// router.route('/:date')
// .get()

router
  .route("/:batch/:date/:hour")
  .get(attendanceController.getAttendance)
  .post(attendanceController.addAttendance)
  .patch(attendanceController.updateAttendance)
  .delete(attendanceController.deleteAttendance);

module.exports = router;
