const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require('cors')
const db = require("./api/models");
const moment = require('moment-timezone');
const time =  moment.tz( "Asia/Kolkata").hours() + "." + moment.tz( "Asia/Kolkata").minutes()
var os = require("os");

app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('api/uploads')); 

app.get("/", (req, res) => {
  console.log('Application is running', new Date());
  res.json({ message: "Welcome to VaoXpod application." });
});
db.sequelize.sync().then(() => {
  console.log("Drop and re-sync db.");
});
require("./api/routes/UserRoute.js")(app);
const server = app.listen(process.env.PORT || 8000, () => {
  const port = server.address().port;
  console.log(`Server is working on port ${port} ${JSON.stringify(server.address())}`);
});