require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();

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
    res.send("employmentCertifyLetter");
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
                "employeeID": req.body.owner.employeeID, // string
                "firstName": req.body.owner.firstName,
                "lastName": req.body.owner.lastName,
                "numberOfCopy": req.body.owner.numberOfCopy,
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
})

// for admin
router.get("/show", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("certifyLetter").find({ "typeCertifyLetter": "employmentCertifyLetter" }).toArray((err, data) => {
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