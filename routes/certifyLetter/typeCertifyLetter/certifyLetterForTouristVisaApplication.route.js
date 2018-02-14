require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();
const autoIncrement = require("mongodb-autoincrement");
const upload = require("../../../utility/upload");


router.get("/", (req, res) => {
    res.end("certifyLetterForTouristVisaApplication");
});

router.post("/add", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        upload(req, res, (err) => {
            if (!err) {
                //-- upload --//
                const myFiles = [];
                req.files.forEach((e) => {
                    let file = {
                        "filename": e.filename,
                        "originalname": e.originalname,
                        "size": e.size,
                        "mimetype": e.mimetype
                    }
                    myFiles.push(file);
                })
                //-- upload --//
                let myObj = {
                    "ticketID": "TID" + Date.now(),
                    "createdAt": new Date(),
                    "status": req.body.status,
                    "typeCertifyLetter": req.body.typeCertifyLetter,
                    "owner": {
                        "employeeID": req.body.owner.employeeID,
                        "firstName": req.body.owner.firstName,
                        "lastName": req.body.owner.lastName,
                        "numberOfCopy": req.body.owner.numberOfCopy,
                        "passportNumber": req.body.owner.passportNumber,
                        "passportExpiryDate": req.body.owner.passportExpiryDate,
                        "files": myFiles,
                        "embassyForVisaApplication": req.body.owner.embassyForVisaApplication,
                        "countryOfVisit": req.body.owner.countryOfVisit,
                        "periodOfVisit": {
                            "from": req.body.owner.periodOfVisit.from,
                            "to": req.body.owner.periodOfVisit.to
                        },
                        "note": req.body.owner.note
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
            } else {
                throw err;
                res.end();
            };
        });

    })
});

// for admin
router.get("/show", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("certifyLetter").find({ "typeCertifyLetter": "certifyLetterForTouristVisaApplication" }).toArray((err, data) => {
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