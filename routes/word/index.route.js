require("dotenv").config();
const express = require("express");
const router = express.Router();
const generateEmployment = require("../../templates/word/certifyLetter/typeCertifyLetter/employment");
let tickets;

function checkType(tickets) {
    for (const ticket of tickets) {
        switch (ticket.typeCertifyLetter) {
            case "employmentCertifyLetter":
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
}

router.get("/", (req, res) => {
    res.end("word");
})

router.get("/download", (req, res) => {
    console.log(tickets);
    // res.writeHead(200, {
    //     "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //     'Content-disposition': `attachment; filename=employment-${ticketID}.docx`
    // })
    // docx.generate(res, {
    //     "finalize": function (writen) {
    //         console.log("Writed success: " + writen);
    //     },
    //     "error": function (err) {
    //         console.log("error" + err)
    //     }
    // });
});

router.post("/download", (req, res) => {
    console.log("ok")
    // tickets = req.body;
})

module.exports = router;