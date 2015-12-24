var db = require('./db'),
    utilities = require('./utilities'),
    fs = require("fs"),
    DEBUG = 3,
    intervalId;

function getDatePartition(){
   var now = new Date();
   return now.getUTCFullYear() + '-' +
      now.getUTCMonth() + '-' +
      now.getUTCDate();
}; 

function readTemp_raw (file){
   var i, raw_data, degreesC;

   if(fs.existsSync(file)){
      raw_data = fs.readFileSync(file).toString();
      if(raw_data && raw_data.indexOf('YES') !== -1){
         utilities.log(raw_data, DEBUG);
         i = raw_data.indexOf('t=');         
         degreesC = raw_data.substring(i + 2);         
         return Number(degreesC) / 1000 * 9/5 + 32;                                    
      } else {
         utilities.log('Failed to read temp', DEBUG);
      }
   } else{
      utilities.log('File not found! [' + file + ']', DEBUG);
   }

   return null;
};
   
function poll(file){
   var read = readTemp_raw(file);
   if(read){
      db.thermoCouple.insert(getDatePartition(), read);
   }
};

module.exports = {
   pollThermocouple: function(file, interval){
      utilities.log('initializing interval [' + interval + ']ms')
      poll();
      intervalId = setInterval(function() {
         poll();                          
      }, interval);    
   },
   stopPoll: function(){
      if(intervalId){
         clearInterval(intervalId);
         intervalId = null;
      }
   }
};