require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs");
const Zip = require("node-7z");
const rimraf = require("rimraf"); // module delete directory same rm -rf
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
    if (checkFiles !== true) {
        fs.mkdirSync(filePath);
    }
}

function compressFileToZip(ticketID, file) {
    const zip = new Zip();
    const option = {
        t: "zip"
    };
    zip.add(`./files/generateDocuments/word/${ticketID}`, file, option)
        .then(() => {
            rimraf(`./files/generateDocuments/word/${ticketID}`, function (err) {
                if (err) throw err;
                console.log(`generate ${ticketID}.zip and delete old folder success`);
            });
        })
        .catch((error) => {
            console.log(`generate ${ticketID}.zip and delete old folder fail`);
            throw err;
        })
}

function checkBanksAndGenerate(ticket, banks) {
    // check directory is have if not have directory system automate generate directory
    checkFilesDir("./files");
    checkFilesDir("./files/generateDocuments");
    checkFilesDir("./files/generateDocuments/word");
    checkFilesDir(`./files/generateDocuments/word/${ticket.ticketID}`);

    if (banks.BBL) {
        generateBBL(ticket).generate(fs.createWriteStream(`./files/generateDocuments/word/${ticket.ticketID}/${ticket.ticketID}-BBL.docx`))
    }
    if (banks.GHB) {
        generateGHB(ticket).generate(fs.createWriteStream(`./files/generateDocuments/word/${ticket.ticketID}/${ticket.ticketID}-GHB.docx`));
    }
    if (banks.LHBank) {
        generateLHBank(ticket).generate(fs.createWriteStream(`./files/generateDocuments/word/${ticket.ticketID}/${ticket.ticketID}-LHBank.docx`));
    }
    if (banks.UOB) {
        generateUOB(ticket).generate(fs.createWriteStream(`./files/generateDocuments/word/${ticket.ticketID}/${ticket.ticketID}-UOB.docx`));
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
                checkBanksAndGenerate(ticket, ticket.owner.banks);
                setTimeout(() => {
                    compressFileToZip(ticketID, `./files/generateDocuments/word/${ticketID}`);
                }, 1000)
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



