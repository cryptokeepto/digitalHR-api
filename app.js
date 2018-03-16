require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/api", require("./routes/index.route"));
app.use("*", (req, res, next) => {
    res.end("404 Not Found");
});


const server = app.listen(process.env.API_PORT, process.env.API_HOSTNAME, () => {
    const port = server.address().port;
    const hostname = server.address().address;
    console.log(`Server running at ${hostname}:${port}`);
})