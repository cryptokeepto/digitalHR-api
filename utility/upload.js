const multer = require("multer");
const path = require('path');
const fs = require("fs");

function splitFileTypeDest(file, cb) {
    const folderFileType = file.mimetype.split("/").shift();
    if (folderFileType === "image") {
        fs.mkdir("./files/images", () => {
            // create sub folder
            const ext = path.extname(file.originalname).split(".").pop(); // get extention
            fs.mkdir("./files/images/" + ext, () => {
                cb(null, "./files/images/" + ext);
            });
        });
    } else if (folderFileType === "application") {
        fs.mkdir("./files/documents", () => {
            const ext = path.extname(file.originalname).split(".").pop();
            fs.mkdir("./files/documents/" + ext, () => {
                cb(null, "./files/documents/" + ext);
            });
        })
    } else {
        throw("file type comming soon.");
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        splitFileTypeDest(file, cb);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage }).array("files");

module.exports = upload;