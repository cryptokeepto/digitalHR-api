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

    const page = parseInt(req.query.page);
    const rows = parseInt( req.query.rows);
    const start = (page - 1) * rows;
    
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {

        const db = client.db("digitalHR");

        db.collection("certifyLetter").find().count()
        .then((count) => {
            let pageTotals = count / rows;
            return Math.ceil(pageTotals);
        })
        .then((pageTotals) => {
            db.collection("certifyLetter")
            .aggregate([{ $lookup: { from: "files", localField: "owner.filesID", foreignField: "filesID", as: "owner.filesOwner" }}, { $skip: start }, { $limit: rows }])
            .toArray((err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    res.json({ "status": true, "message": { "data": data, "pageTotals": pageTotals }});
                    console.log("find complete");
                } else {
                    res.json({ "status": true, "message": { "data": data, "pageTotals": pageTotals }});
                    console.log("find fail");
                    client.close();
                }
            })
        })
        .catch((err) => {
            console.log("error");
            client.close();
        })
      
    })

})

router.put("/updateAll", (req, res) => {
    let ticketID = req.body.ticketID;
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("certifyLetter").updateOne({ "ticketID": ticketID }, { $set: req.body }, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({ "status": true, "message": `${data.modifiedCount} Updated` });
                console.log("insert complete");
                client.close();
            } else {
                res.json({ "status": false, "message": `${data.modifiedCount} Updated` });
                console.log("insert fail");
                client.close();
            }
        })
    });
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