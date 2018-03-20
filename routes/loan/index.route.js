require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();

router.use("/carLoan", require("./typeLoan/carLoan.route"));

router.get("/all", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        db.collection("loan")
            .aggregate([
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