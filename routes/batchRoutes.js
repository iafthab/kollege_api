const express = require("express");
const router = express.Router();
const batchController = require("./../controllers/batchController");

// TODO Student Side
// router.route('/:date')
// .get()

router
  .route("/:batch")
  .get(batchController.getBatch)
  .post(batchController.addBatch)
  .patch(batchController.updateBatch)
  .delete(batchController.deleteBatch);

module.exports = router;
