require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs");
let ticketID;
var docx;
// typeWord
const generateEmployment = require("../../templates/word/certifyLetter/typeCertifyLetter/employment");
const generateEmploymentAndSalary = require("../../templates/word/certifyLetter/typeCertifyLetter/employmentAndSalary");

const generateSchengenTouristVisaApplication = require("../../templates/word/certifyLetter/typeCertifyLetter/schengenTouristVisaApplication");
const generateNormalTouristVisaApplication = require("../../templates/word/certifyLetter/typeCertifyLetter/normalTouristVisaApplication");

const generateFurtherEducation = require("../../templates/word/certifyLetter/typeCertifyLetter/furtherEducation");

const generateBBL = require("../../templates/word/certifyLetter/typeCertifyLetter/banks/BBL");
const generateGHB = require("../../templates/word/certifyLetter/typeCertifyLetter/banks/GHB");
const generateLHBank = require("../../templates/word/certifyLetter/typeCertifyLetter/banks/LHBank");
const generateUOB = require("../../templates/word/certifyLetter/typeCertifyLetter/banks/UOB");
// typeWord

function checkFilesDir(filePath) {
    let checkFiles = fs.existsSync(filePath);
    if (checkFiles !== true) 
        fs.mkdirSync(filePath);
}


function checkBanks(ticket, banks) {
    // check dir is have if not have dir system automate generate dir
    checkFilesDir("./files");
    checkFilesDir("./files/generateDocuments");
    checkFilesDir("./files/generateDocuments/word");

    if (banks.BBL) {
        generateBBL(ticket).generate(fs.createWriteStream(`./files/generateDocuments/word/${ticket.ticketID}-BBL.docx`))
    }
    if (banks.GHB) {
        generateGHB(ticket).generate(fs.createWriteStream(`./files/generateDocuments/word/${ticket.ticketID}-GHB.docx`));
    }
    if (banks.LHBank) {
        generateLHBank(ticket).generate(fs.createWriteStream(`./files/generateDocuments/word/${ticket.ticketID}-LHBank.docx`));
    }
    if (banks.UOB) {
        generateUOB(ticket).generate(fs.createWriteStream(`./files/generateDocuments/word/${ticket.ticketID}-UOB.docx`));
    }
}

router.get("/", (req, res) => {
    res.end("word");
})

router.route("/download")
    .post((req, res) => {
        const ticket = req.body;
        switch (ticket.typeCertifyLetter) {
            case "employmentCertifyLetter":
                ticketID = ticket.ticketID;
                ticket.owner.checked === "haveSalary" ? docx = generateEmploymentAndSalary(ticket) : docx = generateEmployment(ticket);
                break;
            case "certifyLetterForTouristVisaApplication":
                ticketID = ticket.ticketID;
                ticket.owner.schengenCountries ? docx = generateSchengenTouristVisaApplication(ticket) : docx = generateNormalTouristVisaApplication(ticket);
                break;
            case "certifyLetterForFurtherEducation":
                ticketID = ticket.ticketID;
                docx = generateFurtherEducation(ticket);
                break;
            case "certifyLetterForHousingLoan":
                ticketID = ticket.ticketID;
                checkBanks(ticket, ticket.owner.banks);
                break;
            case "certifyLetterForBusinessVisaApplication":
                break;
            default:
                console.log("typeCertifyLetter not have in system");
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



