const { Console } = require("console");
const fs = require("fs");
const moment = require('moment-timezone');




var file = moment.tz("Asia/Kolkata").date()+ '.' + ( moment.tz("Asia/Kolkata").month()+1) + '.' +moment.tz("Asia/Kolkata").year()
const myLogger = new Console({
  stdout: fs.createWriteStream(`${file}.txt`),
  stderr: fs.createWriteStream(`${file}Err.txt`),
});


module.exports = {
    myLogger
};