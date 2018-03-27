const officegen = require("officegen");

function generateFurtherEducation(ticket) {
    const docx = officegen({
        "type": "docx",
        "creator": ticket.owner.employeeID,
        "title": "furtherEducation",
        "subject": "digitalHR"
    });
    // check error
    docx.on("error", (err) => {
        throw err;
    });

    //----------------------------------//

    var pObj = docx.createP();
    pObj.addLineBreak();
    pObj.addLineBreak();
    pObj.addText(`${ticket.modifiedAt}`, { font_face: "Arial", font_size: 12 });
    pObj.addLineBreak();
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText("To Whom It May Concern:", { font_face: "Arial", font_size: 12 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText(`<Title> ${ticket.owner.firstName} ${ticket.owner.lastName} has requested that the company issue this letter in support of <his/her> application to further <his/her> studies.`, { font_face: "Arial", font_size: 12 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText(`We are pleased to confirm that <Title> ${ticket.owner.firstName} ${ticket.owner.lastName} is an employee of <Company>. She joined the Company on Service Date> and is currently serving in the position as <Position>. During her <tenure>’ tenure with the company, <Title> <First Name>’s performance has been entirely satisfactory. Moreover, <his/her> works well with the company’s management team, peers and other staff members.`, { font_face: "Arial", font_size: 12 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText("Please feel free to contact the undersigned should you require further information or contact Mr. Bhorrawee Wirachai at 662 648 9758.", { font_face: "Arial", font_size: 12 });
    pObj.addLineBreak();
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText("Yours truly,", { font_face: "Arial", font_size: 12 });
    pObj.addLineBreak();
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.addText("Jiraporn Wogpasuk", { font_face: "Arial", font_size: 12 });
    pObj.addLineBreak();
    pObj.addText("Human Resources Manager", { font_face: "Arial", font_size: 12 });
    pObj.addLineBreak();
    pObj.addText("Telephone: 662 648 9775", { font_face: "Arial", font_size: 12 });

    var pObj = docx.createP();
    pObj.addLineBreak();
    pObj.addLineBreak();
    pObj.addLineBreak();
    pObj.addLineBreak();
    pObj.addLineBreak();
    pObj.addLineBreak();
    pObj.addText("Not valid without the company’s seal", { font_face: "Arial", font_size: 12, bold: true });

    return docx;
}


module.exports = generateFurtherEducation;
