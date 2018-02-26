const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;

router.use("/carLoan", require("./typeLoan/carLoan.route"));
router.use("/parentalMedicalCareLoan", require("./typeLoan/parentalMedicalCareLoan.route"));
router.use("/emergencyLoan", require("./typeLoan/emergencyLoan.route"));

module.exports = router;