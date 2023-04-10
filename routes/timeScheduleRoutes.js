const express = require("express");
const router = express.Router();
const timeScheduleController = require("./../controllers/timeScheduleController");

// TODO Student Side
// router.route('/:time')
// .get()

router
  .route("/:id")
  .get(timeScheduleController.getTimeSchedule)
  .post(timeScheduleController.addTimeSchedule)
  .patch(timeScheduleController.updateTimeSchedule)
  .delete(timeScheduleController.deleteTimeSchedule);

module.exports = router;
