require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes/api.route")
const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use("/api", router);
app.use("*", (req, res, next) => {
    res.end("404 Not Found");
});



const server = app.listen(process.env.API_PORT, process.env.API_HOSTNAME, () => {
    const port = server.address().port;
    const hostname = server.address().address;
    console.log(`Server running at ${hostname}:${port}`);
})