require("dotenv").config();
const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const officegen = require("officegen");
const fs = require("fs");
const out = fs.createWriteStream("./data.docx");
const path = require("path");


router.get("/download", (req, res) => {

    // init document
    const docx = officegen({
        "type": "docx",
        "creator": "sittikiat",
        "title": "digitalHR",
        "subject": "HR"
    });

    // check error
    docx.on("error", (err) => {
        throw err;
    });

    var pObj = docx.createP();
    pObj.addText("Hello World");
    pObj.addText("sittikiat", { back: "red" });

    var pObj = docx.createP();
    pObj.addText("OMG", { highlight: true });
    pObj.addText("add link", { link: "http://www.google.com" });

    var pObj = docx.createP({ align: "center" });
    pObj.addText("underline and bold", { bold: true, underline: true })

    var pObj = docx.createP();
    pObj.addText("a");
    pObj.addLineBreak(); // ขึ้นบรรทัดใหม่
    pObj.addText("b");

    docx.putPageBreak(); // ขึ้นหน้าใหม่

    var pObj = docx.createP();
    pObj.addText("font face", { font_face: "Algerian", font_size: 40 })

    docx.putPageBreak();

    var pObj = docx.createP();
    pObj.addImage(path.join(__dirname, "images_for_examples/image3.png"), { cx: 300, cy: 300 });

    var lObj = docx.createListOfNumbers();
    lObj.addText("Option 1")
    var lObj = docx.createListOfNumbers();
    lObj.addText("Option 2")
    lObj.addHorizontalLine();

    var pObj = docx.createP({ backline: 'E0E0E0' });
    pObj.addText('Backline text1');
    pObj.addText(' text2');


    const table = [
        [{
            val: "No.",
            opts: {
                cellColWidth: 4261,
                b: true,
                sz: '48',
                shd: {
                    fill: "7F7F7F",
                    themeFill: "text1",
                    "themeFillTint": "80"
                },
                fontFamily: "Avenir Book"
            }
        }, {
            val: "Title1",
            opts: {
                b: true,
                color: "A00000",
                align: "right",
                shd: {
                    fill: "92CDDC",
                    themeFill: "text1",
                    "themeFillTint": "80"
                }
            }
        }, {
            val: "Title2",
            opts: {
                align: "center",
                cellColWidth: 42,
                b: true,
                sz: '48',
                shd: {
                    fill: "92CDDC",
                    themeFill: "text1",
                    "themeFillTint": "80"
                }
            }
        }],
        [1, 'All grown-ups were once children', ''],
        [2, 'there is no harm in putting off a piece of work until another day.', ''],
        [3, 'But when it is a matter of baobabs, that always means a catastrophe.', ''],
        [4, 'watch out for the baobabs!', 'END'],
    ]

    var tableStyle = {
        tableColWidth: 4261,
        tableSize: 24,
        tableColor: "ada",
        tableAlign: "left",
        tableFontFamily: "Comic Sans MS"
    }
    docx.createTable(table, tableStyle)

    var header = docx.getHeader().createP();
    header.addText('This is the header');


    // create document local
    // docx.generate(out, {
    //     "finalize": function (writen) {
    //         console.log("Writed success" + writen);
    //     },
    //     "error": function (err) {
    //         console.log("error" + err)
    //     }
    // });

    // create document use res on express
    res.writeHead(200, {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        'Content-disposition': 'attachment; filename=data.docx'
    })
    docx.generate(res, {
        "finalize": function (writen) {
            console.log("Writed success" + writen);
        },
        "error": function (err) {
            console.log("error" + err)
        }
    });

})



module.exports = router;
