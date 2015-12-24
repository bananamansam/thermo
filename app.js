var fs = require("fs"),                                
    http = require('http'),    
    url = require('url'), 
    thermo = require('./thermo'),
    utilities = require('./utilities'),   
    baseDirectory = __dirname;

const PORT = 8080;
const THERMO_FILE = '/sys/bus/w1/devices/28-000005212eb7/w1_slave';
const THERMO_INTERVAL = 1000 * 60 * 5; 

utilities.log('Listening on '+ PORT);

function handleRequest(request, response){
   var requestUrl = baseDirectory + url.parse(request.url);
   var fsPath = requestUrl.pathname;

   fs.exists(fsPath, function(exists) {
     try {
       if(exists) {
         response.writeHead(200)
         fs.createReadStream(fsPath).pipe(response);
       } else {
         response.writeHead(500);
       }
     } finally {
        response.end();
     } 
   });
};

http.createServer(handleRequest).listen(PORT);
thermo.pollThermocouple(THERMO_FILE, THERMO_INTERVAL);