require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId
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
            if (data.result.n > 0) {
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

router.get("/showAllBySort", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME)
        .then(client => {
            const db = client.db("digitalHR");
            db.collection("users")
                .find({})
                .sort({ "age": 1 }) // asc = 1, desc = -1
                .toArray()
                .then((data) => {
                    if (data.result.n > 0) {
                        res.json({ "status": true, "message": data });
                        console.log("find complete");
                    } else {
                        res.json({ "status": false, "message": data });
                        console.log("find fail");
                    }
                }).catch(err => {
                    if (err) throw err;
                })
            client.close();
        })
        .catch(err => {
            throw err;
        });
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
            if (data.result.n > 0) {
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
            if (data.result.n > 0) {
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


router.put("/update", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        let oldObj = { "name": "tom" };
        let newObj = { "name": "mike", "age": 23 };
        db.collection("users").update(oldObj, newObj, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({ "status": true, "message": `${data.result.n} Updated` })
                console.log("update success");
            } else {
                res.json({ "status": false, "message": `${data.result.n} Updated` })
                console.log("update fail");
            }
        })
        client.close();
    });
});

router.delete("/deleteOne/:id", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        db.collection("users").deleteOne({ "_id": new mongodb.ObjectId(req.params.id) }, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({ "status": true, "message": `${data.deletedCount} Deleted` });
                console.log("delete complete");
            } else {
                res.json({ "status": false, "message": `${data.deletedCount} Deleted` });
                console.log("delete fail");
                console.log(`ObjectId("${req.params.id}")`)
            }
        })
        client.close();
    })
});

router.delete("/deleteMany/:age", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        const StringToNumber = parseInt(req.params.age)
        db.collection("users").deleteMany({ "age": { $lt: StringToNumber } }, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({ "status": true, "message": `${data.deletedCount} Deleted` });
                console.log("delete complete");
            } else {
                res.json({ "status": false, "message": `${data.deletedCount} Deleted` });
                console.log("delete fail");
            }
        })
        client.close();
    })
});

module.exports = router;

// db.createCollection("users", (err, res) => {
//     if (err) throw err;
//     console.log("created")
// });
