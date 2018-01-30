require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const router = express.Router();


// users

router.get("/", (req, res) => {
    res.send("Welcome to api")
})

router.get("/showOne", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        db.collection("users").findOne({}, (err, data) => {
            if (err) throw err;
            if (data) {
                res.json({ "status": true, "message": data });
                console.log("find complete");
            } else {
                res.json({ "status": false, "message": data });
                console.log("find fail");
            }
        });
        client.close();
    })
})

router.get("/showAll", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        db.collection("users").find({}).toArray((err, data) => {
            if (err) throw err;
            if (data) {
                res.json({ "status": true, "message": data });
                console.log("find complete");
            } else {
                res.json({ "status": false, "message": data });
                console.log("find fail");
            }
        });
        client.close();
    })
})

router.post("/addOne", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        let myObj = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "sex": req.body.sex,
            "email": req.body.email,
            "image": req.body.image // comming soon
        }
        db.collection("users").insertOne(myObj, (err, data) => {
            if (err) throw err;
            if (data) {
                res.json({ "status": true, "message": `${data.insertedCount} Inserted` });
                console.log("insert complete");
            } else {
                res.json({ "status": false, "message": `${data.insertedCount} Inserted` });
                console.log("insert fail");
            }
        });
        client.close();
    });
});

router.post("/addMany", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err
        const db = client.db("digitalHR");
        let myObj = [
            { "name": "tom", "age": 34 },
            { "name": "janny", "age": 23 },
            { "name": "martin", "age": 74 },
            { "name": "jackson", "age": 14 },
            { "name": "yeil", "age": 43 },
        ]
        db.collection("users").insertMany(myObj, (err, data) => {
            if (err) throw err
            if (data) {
                res.json({ "status": true, "message": `${data.insertedCount} Inserted` });
                console.log("insert complete");
            } else {
                res.json({ "status": false, "message": `${data.insertedCount} Inserted` });
                console.log("insert fail");
            }
        });
        client.close();
    })
});

router.delete("/delete/:id", (req, res) => {
    res.send("delete: " + req.params.id);
});

module.exports = router;

// db.createCollection("users", (err, res) => {
//     if (err) throw err;
//     console.log("created")
// });
