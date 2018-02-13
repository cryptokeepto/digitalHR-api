require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();
const autoIncrement = require("mongodb-autoincrement");
const multer = require("multer");
const path = require('path');

// multer
const storage = multer.diskStorage({
    destination: "./files",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage }).single("file");
// multer

router.get("/", (req, res) => {
    res.end("certifyLetterForTouristVisaApplication");
});

router.post("/add", (req, res) => {
    upload(req, res, (err) => {
        if (err) throw err;
        if (req.file !== undefined) {
            console.log("upload success");
        } else {
            console.log("upload fail");
        }
        res.end();
    });
});


module.exports = router;