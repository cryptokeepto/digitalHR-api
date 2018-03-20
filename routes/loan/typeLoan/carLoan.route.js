require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();
const path = require("path");
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
    res.send("carloan");
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
    let myObj = {
        "ticketID": "TID" + Date.now(),
        "createdAt": getDate(),
        "modifiedAt": "-",
        "status": req.body.status,
        "typeLoan": req.body.typeLoan,
        "owner": {
            "employeeID": req.body.owner.employeeID,
            "firstName": req.body.owner.firstName,
            "lastName": req.body.owner.lastName,
            "givenName": req.body.owner.givenName,
            "familyName": req.body.owner.familyName,
            "nationalIDNumber": req.body.owner.nationalIDNumber,
            "mailingAddress": req.body.owner.mailingAddress,
            "requestAmount": req.body.owner.requestAmount,
            "typeOfCarID": req.body.owner.typeOfCarID,
            "filesID": req.body.owner.filesID
        }
    }

    // connect database
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        db.collection("loan").insertOne(myObj, (err, data) => {
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

router.get("/show", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        db.collection("loan")
            .aggregate([
                { $match: { typeLoan: "carLoan" } },
                { $lookup: { from: "typeOfCar", localField: "owner.typeOfCarID", foreignField: "typeOfCarID", as: "owner.typeOfCarOwner" } },
                { $lookup: { from: "files", localField: "owner.filesID", foreignField: "filesID", as: "owner.filesOwner" } }
            ])
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
    });
})

module.exports = router;