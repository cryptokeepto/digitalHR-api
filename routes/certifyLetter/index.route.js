const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;

router.use("/employmentCertifyLetter", require("./typeCertifyLetter/employmentCertifyLetter.route"));
router.use("/certifyLetterForHousingLoan", require("./typeCertifyLetter/certifyLetterForHousingLoan.route"));
router.use("/certifyLetterForFurtherEducation", require("./typeCertifyLetter/certifyLetterForFurtherEducation.route"));
router.use("/certifyLetterForTouristVisaApplication", require("./typeCertifyLetter/certifyLetterForTouristVisaApplication.route"));
router.use("/certifyLetterForBusinessVisaApplication", require("./typeCertifyLetter/certifyLetterForBusinessVisaApplication.route"));

// show all for admin
router.get("/all", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("certifyLetter")
        .aggregate([{ $lookup: { from: "files", localField: "owner.filesID", foreignField: "filesID", as: "owner.filesOwner" }}])
        .toArray((err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.json({ "status": true, "message": data });
                client.close();
                console.log("find complete");
            } else {
                res.json({ "status": false, "message": data });
                client.close();
                console.log("find fail");
            }
        })
    })
})

router.delete("/delete", (req, res) => {
    let ticketID = req.query.ticketID;
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("certifyLetter").deleteOne({"ticketID": ticketID }, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({ "status": true, "message": `${data.deletedCount} Deleted` });
                console.log("insert complete");
                client.close();
            } else {
                res.json({ "status": false, "message": `${data.deletedCount} Deleted` });
                console.log("insert fail");
                client.close();
            }
        })
    })
})

module.exports = router;