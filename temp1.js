var fs = require("fs");
var http = require('http');
var data = '';

const PORT = 8080;
const THERMO_FILE = '/sys/bus/w1/devices/28-000005212eb7/w1_slave';

console.log('Listening on '+ PORT);

function handleRequest(request, response){
  readTemp();
  response.setHeader('Content-Type', 'text/html');
  response.write('{ Temp: ' + data + '}');
  response.end();  
};

function readTemp(){
    var intervalId = setInterval(function() {
        var goodRead = readTemp_raw();
        log('Raw Read: ' + goodRead);
        
        if(goodRead){
            clearInterval(intervalId);
        }
    }, 2000);    
};

function readTemp_raw(){
   var i, f, raw_data;
  
   if(fs.existsSync(THERMO_FILE)){
      raw_data = fs.readFileSync(THERMO_FILE).toString();
      
      log(raw_data);
      if(raw_data.indexOf('YES') !== -1){
         i = raw_data.indexOf('t=');
         log(i);
         data = raw_data.substring(i+2);
         log(data);
         f = Number(data)/1000 * 9/5 + 32;
         log(f);
         data = f.toString();
         log(data);
         return true;
      } else {
         log('Failed to read temp');
      }
  } else{
      log('File not found! ' + THERMO_FILE);
  }
  
  return false;
};

function log(message){
   console.log(new Date() + ":" + message);
}

http.createServer(handleRequest).listen(PORT);
