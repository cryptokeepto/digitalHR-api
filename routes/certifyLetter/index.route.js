const express = require("express");
const router = express.Router();

router.use("/employmentCertifyLetter", require("./employmentCertifyLetter.route"));

module.exports = router;