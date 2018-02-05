require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path")
// const out = fs.createWriteStream(path.join(__dirname, "data.pdf"))

router.get("/download", (req, res) => {
    let doc = new PDFDocument({ autoFirstPage: false })
    // init pdf
    doc.info.Title = "Thomsonreuter";

    let lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl."
    doc.addPage({ margin: 50 })
        .text("THOMSONREUTER", { align: "center" })
        .image(__dirname + "/images_for_examples/image3.png", 200, 80, { width: 200, height: 200 })
        .fontSize(16)
        .text(lorem, 200, 300)
        .moveDown()
        .text("sittikiat sujitranon", { align: "right" })

    doc.addPage()
        .text("page 2")



    doc.pipe(res)
    // doc.pipe(out)
    doc.end();
})


module.exports = router;