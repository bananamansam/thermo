var express = require("express"),
    settings = require('./settings'),
    util = require('./utilities'),
    db = require('./db'),
    app = express(),
    bodyParser = require('body-parser');

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.map = function(a, route){
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        app.map(a[key], route + key);
        break;
      // get: function(){ ... }
      case 'function':
        util.log(key + ' ' + route);
        app[key](route, a[key]);
        break;
    }
  }
};

app.map({
   '/api/thermoReadings': {
      get: function(req,res){
         db.thermoCouple.get(function(data) { 
            var results = [];
            for(var n = 0; n < data.length; n++){
               results.push({ 
                 capture_date: new Date(data[n].capture_date).toString(),
                 thermo_value: data[n].thermo_value
               });
            }
            res.json(results);
         });
      },
      '/:filter': {
         get: function(req, res){
            res.json({ filter: req.body.filter});            
         },
      },
      post: function(req,res){
         console.log(req.body);
         db.thermoCouple.insert(req.body.capture_date, req.body.thermo_value);
         res.status(200);
      }
   },
   '/thermo.html': {
      get: function (req, res){
         res.sendFile('index.html', { root: __dirname });
      }
   }
});


module.exports = {
  start: function () {
     app.listen(settings.PORT, function () {
        console.log('Listening on ' + settings.PORT);
     });
  } 
};