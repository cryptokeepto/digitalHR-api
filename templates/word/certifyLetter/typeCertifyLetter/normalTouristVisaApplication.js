const officegen = require("officegen");

function generateNormalTouristVisaApplication(ticket) {
    const docx = officegen({
        "type": "docx",
        "creator": ticket.owner.employeeID,
        "title": "touristVisaApplication",
        "subject": "digitalHR"
    });
    // check error
    docx.on("error", (err) => {
        throw err;
    });

    //----------------------------------//

    var pObj = docx.createP();
    pObj.addText(`${ticket.modifiedAt}`, { font_face: "Arial", font_size: 11 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText("«Visa_Section»", { font_face: "Arial", font_size: 11 });
    
    var pObj = docx.createP();
    pObj.addText("«Embassy»", { font_face: "Arial", font_size: 11 });

    var pObj = docx.createP();
    pObj.addText("Bangkok, Thailand", { font_face: "Arial", font_size: 11 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.options.align = "center";
    pObj.addText(`Re:    <Title> ${ticket.owner.firstName} ${ticket.owner.lastName}`, { font_face: "Arial", font_size: 11, bold: true });

    var pObj = docx.createP();
    pObj.options.align = "center";
    pObj.addText(`    Passport No. ${ticket.owner.passportNumber}`, { font_face: "Arial", font_size: 11, bold: true });
    pObj.addLineBreak();

    // artical

    var pObj = docx.createP();
    pObj.addText(`Dear Sir or Madam:`, { font_face: "Arial", font_size: 11 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText(`This letter is submitted in support of <Title> ${ticket.owner.firstName} ${ticket.owner.lastName}’s visa application.`, { font_face: "Arial", font_size: 11 });

    var pObj = docx.createP();
    pObj.addText(`<Title> ${ticket.owner.firstName} ${ticket.owner.lastName}, a citizen of Thailand, is currently employed with <Company> where <heshe> serves in the position of <Position>. <HeShe>  joined the Company on <Service date> and receives an annual salary of THB <Annual Salary>`, { font_face: "Arial", font_size: 11 });

    var pObj = docx.createP();
    pObj.addText(`<Title> ${ticket.owner.firstName} ${ticket.owner.lastName} would like to take a leisure trip to <Country> during ${ticket.owner.periodOfVisit.from} to ${ticket.owner.periodOfVisit.to}. On completing the trip, <heshe> will return to resume <hisher> work with the Company.`, { font_face: "Arial", font_size: 11 });

    var pObj = docx.createP();
    pObj.addText("Please feel free to contact the undersigned should you require further information or contact Ms. Natthida Srimuang at 662 648 8449.", { font_face: "Arial", font_size: 11 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText("Thank you for your kind cooperation in this regard.", { font_face: "Arial", font_size: 11 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText("Yours truly,", { font_face: "Arial", font_size: 11 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText("Jiraporn Wogpasuk", { font_face: "Arial", font_size: 11 });
    pObj.addLineBreak();
    pObj.addText("Human Resources Manager", { font_face: "Arial", font_size: 11 });
    pObj.addLineBreak();
    pObj.addText("Telephone: 662 648 9775", { font_face: "Arial", font_size: 11 });

    var pObj = docx.createP();

    pObj.addLineBreak();
    pObj.addLineBreak();
    pObj.addText("Not valid without the company’s seal", { font_face: "Arial", font_size: 11, bold: true });

    return docx;
}


module.exports = generateNormalTouristVisaApplication;
