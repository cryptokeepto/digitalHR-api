require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dal = require("./connection/connect");
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use("/api", require("./routes/index.route"));
app.use("*", (req, res, next) => {
  res.end("404 Not Found");
});

function startListening() {
  dal
    .connect(host)
    .then(() => {
      server = app.listen(ports, api, () => {
        const port = server.address().port;
        const hostname = server.address().address;
        console.log(`Server running at ${hostname}:${port}`);
      });
    })
    .catch(error => {
      console.error(error);
    });
}
/**
 * @function disconnection server and mongoDB
 */
function stopListening() {
  if (!server) {
    return;
  }
  console.log("Closing server now...");
  server.close(() => {
    dal.disconnect();
    console.log("Server is closed.");
  });
}

process.on("SIGTERM", () => {
  stopListening();
});

process.on("SIGINT", () => {
  stopListening();
});
/**
 *
 */
startListening();
