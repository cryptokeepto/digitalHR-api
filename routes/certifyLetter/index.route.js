const express = require("express");
const router = express.Router();

router.use("/employmentCertifyLetter", require("./typeCertifyLetter/employmentCertifyLetter.route"));
router.use("/certifyLetterForHousingLoan", require("./typeCertifyLetter/certifyLetterForHousingLoan.route"));
router.use("/certifyLetterForFurtherEducation", require("./typeCertifyLetter/certifyLetterForFurtherEducation.route"));
router.use("/certifyLetterForTouristVisaApplication", require("./typeCertifyLetter/certifyLetterForTouristVisaApplication.route"));
router.use("/certifyLetterForBusinessVisaApplication", require("./typeCertifyLetter/certifyLetterForBusinessVisaApplication.route"));

module.exports = router;