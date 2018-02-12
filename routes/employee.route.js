require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("employee");
});





module.exports = router;