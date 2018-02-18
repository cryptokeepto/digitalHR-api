require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;
const express = require("express");
const path = require("path");
const router = express.Router();
const upload = require("../../../utility/upload");

function getDate() {
    let d = new Date();
    let year = d.getFullYear().toString();
    let month = d.getMonth() + 1;
    let day = d.getDate().toString();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    
    if (month.toString().length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.toString().length < 2) hour = "0" + hour;
    if (minute.toString().length < 2) minute = "0" + minute;
    if (second.toString().length < 2) second = "0" + second;

    let result = [year, month, day].join("-") + " " + [hour, minute, second].join(":");
    return result;
}


router.get("/", (req, res) => {
    res.end("certifyLetterForTouristVisaApplication");
});

router.post("/add", (req, res) => {

    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        upload(req, res, (err) => {
            if (!err) {
                //-- upload --//
                // if (req.files == undefined) throw new Error("files is undefined");
                // const myFiles = [];
                // req.files.forEach((e) => {
                //     let file = {
                //         "filename": e.filename,
                //         "originalname": e.originalname,
                //         "pathFile": path.join(e.destination.split(".").pop(), e.filename),
                //         "size": e.size,
                //         "mimetype": e.mimetype
                //     }
                //     myFiles.push(file);
                // })
                //-- upload --//
                let myObj = {
                    "ticketID": "TID" + Date.now(),
                    "createdAt": getDate(),
                    "status": req.body.status,
                    "typeCertifyLetter": req.body.typeCertifyLetter,
                    "owner": {
                        "employeeID": req.body.owner.employeeID,
                        "firstName": req.body.owner.firstName,
                        "lastName": req.body.owner.lastName,
                        "firstNamePassport": req.body.owner.firstNamePassport,
                        "lastNamePassport": req.body.owner.lastNamePassport,
                        "numberOfCopy": req.body.owner.numberOfCopy,
                        "passportNumber": req.body.owner.passportNumber,
                        "passportExpiryDate": req.body.owner.passportExpiryDate,
                        "files": [].push(req.body.files),
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