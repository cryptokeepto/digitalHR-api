const officegen = require("officegen");

function generateGHB(ticket) {
    const docx = officegen({
        "type": "docx",
        "creator": ticket.owner.employeeID,
        "title": "GHB",
        "subject": "HR"
    });
    // check error
    docx.on("error", (err) => {
        throw err;
    });

    //----------------------------------//

    var pObj = docx.createP();
    pObj.options.align = "right";
    pObj.addText(`ที่ บริษัท <รอยเตอร์ ซอฟท์แวร์> (ประเทศไทย) จำกัด`, { font_face: "Cordia New", font_size: 15 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.options.align = "center";
    pObj.addText(`วันที่ <วัน เดือน ปีพศ>`, { font_face: "Cordia New", font_size: 15 });
    pObj.addLineBreak();
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.options.align = "left";
    pObj.addText(`เรื่อง		การกู้เงินโครงการสวัสดิการเงินกู้เพื่อที่อยู่อาศัย`, { font_face: "Cordia New", font_size: 15 });

    var pObj = docx.createP();
    pObj.options.align = "left";
    pObj.addText(`เรียน		กรรมการผู้จัดการธนาคารอาคารสงเคราะห์`, { font_face: "Cordia New", font_size: 15 });

    var pObj = docx.createP();
    pObj.options.align = "left";
    pObj.addText(`อ้างถึง 	ข้อตกลงระหว่างธนาคารอาคารสงเคราะห์ กับ บริษัท <รอยเตอร์ ซอฟท์แวร์> (ประเทศไทย) จำกัด ฉบับวันที่ 1 สิงหาคม 2548 (สวัสดิการ 001W481235 (RSTL) / 001W481269 (RTL))`, { font_face: "Cordia New", font_size: 15 });


    var pObj = docx.createP();
    pObj.options.align = "left";
    pObj.addText(`          บริษัท <รอยเตอร์ ซอฟท์แวร์> (ประเทศไทย) จำกัด ขอเรียนให้ทราบว่า <คำนำหน้าชื่อ> <ชื่อ นามสกุล>       รหัสพนักงาน <Employee ID> เป็นพนักงานตำแหน่ง <Job Title>  เข้าทำงานเมื่อวันที่ <วัน เดือน ปีพศ>  ได้รับเงินเดือน เดือนละ <Base Monthly Salary> บาท (สุทธิเดือนละ <Net Base Monthly Salary> บาท) และมีโบนัสประจำปี 1 เดือน`, { font_face: "Cordia New", font_size: 15 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.options.align = "left";
    pObj.addText(`          บริษัทได้พิจารณาแล้ว เห็นว่า <คำนำหน้าชื่อ> <ชื่อ นามสกุล> มีคุณสมบัติเหมาะสมที่จะเป็นผู้กู้ในโครงการสวัสดิการเงินกู้เพื่อที่อยู่อาศัยตามข้อตกลงดังกล่าวข้างต้น`, { font_face: "Cordia New", font_size: 15 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.options.align = "left";
    pObj.addText(`          จึงเรียนมาเพื่อโปรดทราบ`, { font_face: "Cordia New", font_size: 15 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.options.align = "center";
    pObj.addText(`ขอแสดงความนับถือ`, { font_face: "Cordia New", font_size: 15 });
    pObj.addLineBreak();
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.options.align = "center";
    pObj.addText(`จิราพร วงศ์พาสุข`, { font_face: "Cordia New", font_size: 15 });

    var pObj = docx.createP();
    pObj.options.align = "center";
    pObj.addText(`ผู้จัดการฝ่ายทรัพยากรบุคคล`, { font_face: "Cordia New", font_size: 15 });
    pObj.addLineBreak();

    var pObj = docx.createP();
    pObj.options.align = "left";
    pObj.addText(`หมายเหตุ หนังสือรับรองฉบับนี้มีอายุ 30 วัน นับตั้งแต่วันที่ออกหนังสือ สอบถามข้อมูลเพิ่มเติมได้ที่ ฝ่ายทรัพยากรบุคคล บริษัท <รอยเตอร์ ซอฟท์แวร์> (ประเทศไทย) จำกัด โทร 0-2648-9000 ต่อ 9758`, { font_face: "Cordia New", font_size: 15 });


   
    return docx;

}


module.exports = generateGHB;
