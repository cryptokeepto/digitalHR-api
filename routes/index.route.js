const express = require("express");
const app = express();

app.use("/certifyLetter", require("./certifyLetter/index.route"));
app.use("/loan", require("./loan/index.route"));

app.use("/word", require("./word/index.route"));
// app.use("/pdf", require("./pdf.route"));;

module.exports = app;