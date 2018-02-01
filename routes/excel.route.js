require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId
const express = require("express");
const router = express.Router();
const excel = require("excel4node");



router.get("/download", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        const db = client.db("digitalHR");
        db.collection("users").find({}).toArray((err, data) => {
            if (err) throw err;

            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet("report-users");

            // header
            worksheet.cell(1, 1).string("firstname");
            worksheet.cell(1, 2).string("lastname");
            worksheet.cell(1, 3).string("sex");
            worksheet.cell(1, 4).string("email");
            worksheet.cell(1, 5).string("image");

            // body
            let row = 2;
            let field = 1;
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < 5; j++) {
                    worksheet.cell(row, 1).string(data[i].firstName);
                    worksheet.cell(row, 2).string(data[i].lastName);
                    worksheet.cell(row, 3).string(data[i].sex);
                    worksheet.cell(row, 4).string(data[i].email);
                    worksheet.cell(row, 5).string(data[i].image);
                    field++
                }
                field = 1;
                row++;
            }
            workbook.write("execelFile.xlsx", res);
        })
        client.close();
    })
});



module.exports = router;
