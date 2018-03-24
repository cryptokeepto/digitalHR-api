require("dotenv").config();
const express = require("express");
const router = express.Router();
const generateEmployment = require("../../templates/word/certifyLetter/typeCertifyLetter/employment");
let ticketID;
var docx;

router.get("/", (req, res) => {
    res.end("word");
})

router.route("/download")
    .post((req, res) => {
        const tickets = req.body;

        for (const ticket of tickets) {
            switch (ticket.typeCertifyLetter) {
                case "employmentCertifyLetter":
                    // ยังขาดแบ่งประเถทของ employment
                    ticketID = ticket.ticketID;
                    docx = generateEmployment(ticket);
                    break;
                case "certifyLetterForTouristVisaApplication":
                    break;
                case "certifyLetterForHousingLoan":
                    break;
                case "certifyLetterForFurtherEducation":
                    break;
                case "certifyLetterForBusinessVisaApplication":
                    break;
                default:
                    console.log("typeCertifyLetter not have in system");
            }
        }
        res.end();
    })
    .get((req, res) => {
        if (docx === undefined || ticketID === undefined) throw "docx and ticketID is not value, Please generate word first time";
        res.writeHead(200, {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            'Content-disposition': `attachment; filename=${ticketID}.docx`
        });
        docx.generate(res, {
            "finalize": () => console.log("Writed success"),
            "error": () => { throw err }
        });
    })



module.exports = router;