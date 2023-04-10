const express = require("express");
const router = express.Router();
const internalController = require("./../controllers/internalController");

// TODO Student Side
// router.route('/class')
// get result of every course
// .get()

router
  .route("/:batch/:course")
  .get(internalController.getInternal)
  .post(internalController.addInternal)
  .patch(internalController.updateInternal)
  .delete(internalController.deleteInternal);

module.exports = router;
