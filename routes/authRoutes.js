const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

router.route("/login/staff").post(authController.staffLogin);
router.route("/login/student").post(authController.studentLogin);

//? Incase of JWT
//   .route("/logout")
//   .post(authController.logout);

module.exports = router;
