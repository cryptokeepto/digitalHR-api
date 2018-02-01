const express = require("express");
const app = express();

app.use("/users", require("./users.route"));
app.use("/excel", require("./excel.route"));
app.use("/word", require("./word.route"));

module.exports = app;