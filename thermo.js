var db = require('./db'),
   utilities = require('./utilities'),
   fs = require("fs"),
   DEBUG = 3,
   _file,
   _maxRecords = 100,
   intervalId;

function getDatePartition() {
   var now = new Date();
   return now.getUTCFullYear() + '-' +
      now.getUTCMonth() + '-' +
      now.getUTCDate();
}

function readTemp_raw() {
   var i, raw_data, degreesC;

   if (fs.existsSync(_file)) {
      raw_data = fs.readFileSync(_file).toString();
      if (raw_data && raw_data.indexOf('YES') !== -1) {
         utilities.log(raw_data, DEBUG);
         i = raw_data.indexOf('t=');
         degreesC = raw_data.substring(i + 2);
         return Number(degreesC) / 1000 * 9 / 5 + 32;
      } else {
         utilities.log('Failed to read temp', DEBUG);
      }
   } else {
      utilities.log('File not found! [' + _file + ']', DEBUG);
   }

   return null;
}
   
function _poll() {
   var read = readTemp_raw(_file);
   if (read) {
      db.thermoCouple.insert(getDatePartition(), read);
   }
}

module.exports = {
   pollThermocouple: function (file, interval) {
      utilities.log('creating schema...');
      db.thermoCouple.createTable();
      
      utilities.log('initializing interval [' + interval + ']ms');
      _file = file;
      _poll();
      intervalId = setInterval(function () {
         _poll();
      }, interval);
   },
   stopPoll: function () {
      if (intervalId) {
         clearInterval(intervalId);
         intervalId = null;
      }
   }
};