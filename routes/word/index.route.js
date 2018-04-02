require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs");
const Zip = require("node-7z");
const rimraf = require("rimraf"); // module delete directory same rm -rf
let ticketGlobal;
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
    return zip.add(`./files/generateDocuments/word/${ticketID}`, file, option);
}

function checkBanksAndGenerate(ticket, banks) {
    // check directory is have if not have directory system automate generate directory
    checkFilesDir("./files");
    checkFilesDir("./files/generateDocuments");
    checkFilesDir("./files/generateDocuments/word");
    checkFilesDir(`./files/generateDocuments/word/${ticket.ticketID}`);

    const promise = new Promise((resolve) => {
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
        resolve(true);
    })

    return promise;
}

async function generateBank(ticket, banks) {
    try {
        await checkBanksAndGenerate(ticket, banks);
        console.log("generating...");
        await compressFileToZip(ticket.ticketID, `./files/generateDocuments/word/${ticket.ticketID}`);
        console.log("generating success");
        rimraf(`./files/generateDocuments/word/${ticket.ticketID}`, function (err) {
            if (err) throw err;
            console.log(`generate ${ticket.ticketID}.zip and delete old folder success`);
        });
    } catch (error) {
        console.log(`generate ${ticket.ticketID}.zip and delete old folder fail`);
        throw error;
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
                ticketGlobal = ticket;
                ticket.owner.checked === "haveSalary" ? docx = generateEmploymentAndSalary(ticket) : docx = generateEmployment(ticket);
                docx ? res.json({ "status": true, "message": `${ticket.ticketID}.docx` }) : res.json({ "status": false, "message": `${ticket.ticketID} generate docx fail` });
                break;
            case "certifyLetterForTouristVisaApplication":
                ticketGlobal = ticket;
                ticket.owner.schengenCountries ? docx = generateSchengenTouristVisaApplication(ticket) : docx = generateNormalTouristVisaApplication(ticket);
                docx ? res.json({ "status": true, "message": `${ticket.ticketID}.docx` }) : res.json({ "status": false, "message": `${ticket.ticketID} generate docx fail` });
                break;
            case "certifyLetterForFurtherEducation":
                ticketGlobal = ticket;
                docx = generateFurtherEducation(ticket);
                docx ? res.json({ "status": true, "message": `${ticket.ticketID}.docx` }) : res.json({ "status": false, "message": `${ticket.ticketID} generate docx fail` });
                break;
            case "certifyLetterForHousingLoan":
                ticketGlobal = ticket;
                generateBank(ticket, ticket.owner.banks)
                    .then(() => {
                        res.json({ "status": true, "message": `${ticket.ticketID}.zip` });
                    })
                    .catch(() => {
                        res.json({ "status": false, "message": `${ticket.ticketID} generate zip fail` });
                    })
                break;
            case "certifyLetterForBusinessVisaApplication":
                break;
            default:
                res.json({ "status": true, "message": `typeCertifyLetter not have in system` });
        }
    })
    .get((req, res) => {
        if (ticketGlobal.typeCertifyLetter !== "certifyLetterForHousingLoan") {
            if (docx === undefined || ticketGlobal.ticketID === undefined) throw "docx and ticketID is not value, Please generate word first time";
            res.writeHead(200, {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                'Content-disposition': `attachment; filename=${ticketGlobal.ticketID}.docx`
            });
            docx.generate(res, {
                "finalize": () => console.log("Writed success"),
                "error": () => { throw err }
            });
        } else {
            res.download(`./files/generateDocuments/word/${ticketGlobal.ticketID}.zip`)
        }
    })



module.exports = router;



