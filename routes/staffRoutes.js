const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

router.route("/").post(staffController.createNewStaff);
router.route("/list/:department").get(staffController.getStaffList);
router.route("/approve/:department").get(staffController.getNewStaffs);

router
  .route("/:id")
  .get(staffController.getStaff)
  .patch(staffController.approveStaff)
  .delete(staffController.deleteStaff);

module.exports = router;
