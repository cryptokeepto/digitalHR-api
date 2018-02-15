require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();
const autoIncrement = require("mongodb-autoincrement");

router.get("/", (req, res) => {
    res.send("certifyLetterForHousingLoan");
});

router.post("/add", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        autoIncrement.getNextSequence(db, "certifyLetter", "id", (err, autoIndex) => {
            let myObj = {
                "ticketID": "TID" + Date.now(),
                "createdAt": new Date(),
                "status": req.body.status,
                "typeCertifyLetter": req.body.typeCertifyLetter,
                "owner": {
                    "id": autoIndex, // autoincrement
                    "employeeID": req.body.employeeID, // string
                    "typeCertifyLetter": req.body.typeCertifyLetter, // type
                    "firstName": req.body.firstName,
                    "lastName": req.body.lastName,
                    "note": req.body.note,
                    "numberOfCopy": req.body.numberOfCopy,
                    "banks": {
                        "BBL": req.body.banks.BBL,
                        "GHB": req.body.banks.GHB,
                        "LHBank": req.body.banks.LHBank,
                        "UOB": req.body.banks.UOB
                    }
                }
            }
            db.collection("certifyLetter").insertOne(myObj, (err, data) => {
                if (err) throw err;
                if (data.result.n > 0) {
                    res.json({ "status": true, "message": `${data.insertedCount} Inserted` });
                    console.log("insert complete");
                    client.close();
                } else {
                    res.json({ "status": false, "message": `${data.insertedCount} Inserted` });
                    console.log("insert fail");
                    client.close();
                }
            })
        });
    });
});

// for admin
router.get("/show", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("certifyLetter").find({ "typeCertifyLetter": "certifyLetterForHousingLoan" }).toArray((err, data) => {
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


module.exports = router;