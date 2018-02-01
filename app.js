require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader("Access-Control-Allow-Methods", "GET, DELETE")
    next();
})
app.use(bodyParser.json());
app.use("/api", require("./routes/index.route"));
app.use("*", (req, res, next) => {
    res.end("404 Not Found");
});



const server = app.listen(process.env.API_PORT, process.env.API_HOSTNAME, () => {
    const port = server.address().port;
    const hostname = server.address().address;
    console.log(`Server running at ${hostname}:${port}`);
})