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

router.post("/addFiles", (req, res) => {
    upload(req, res, (err) => {
        if (req.files === undefined) throw new Error("files is undefined");
        if (!err) {
            //-- upload --//
            const myFiles = [];
            req.files.forEach((e) => {
                let file = {
                    "filename": e.filename,
                    "originalname": e.originalname,
                    "pathFile": path.join(e.destination.split(".").pop(), e.filename),
                    "size": e.size,
                    "mimetype": e.mimetype
                }
                myFiles.push(file);
            })
            //-- upload --//

            // connect mongodb
            MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
                const db = client.db("digitalHR");
                const fileID = "FID" + Date.now();
                const myObj = {
                    "filesID": fileID,
                    "files": myFiles
                }
                db.collection("files").insertOne(myObj, (err, data) => {
                    if (err) throw err;
                    if (data.result.n > 0) {
                        res.json({ "status": true, "message": "upload file success", "fileID": fileID });
                        console.log("insert complete");
                        client.close();
                    } else {
                        res.json({ "status": false, "message": "upload file fail" });
                        console.log("insert fail");
                        client.close();
                    }
                })
            });
            // connect mongodb

        } else {
            throw err;
            res.end();
        };
    });

});

router.post("/add", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        let myObj = {
            "ticketID": "TID" + Date.now(),
            "createdAt": getDate(),
            "modifiedAt": "-",
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
                "filesID": req.body.owner.filesID,
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



    })
});

// for admin
router.get("/show", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("certifyLetter")
        .aggregate(
            [
                { $match: { "typeCertifyLetter": "certifyLetterForTouristVisaApplication" }},
                { $lookup: { from: "files", localField: "owner.filesID", foreignField: "filesID", as: "owner.filesOwner" }}
            ]
        )
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


router.put("/update", (req, res) => {
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