var sql = require('dblite'),
    db = new sql('./thermo.db'),   
    thermoCouple = {
      createTable: function() {
         db.query("CREATE TABLE if not exists thermo_readings (id INTEGER PRIMARY KEY, capture_date INTEGER, thermo_value real)");
      },
      get: function(callback, limit, captureDate) {
         db.query("SELECT id, capture_date, thermo_value FROM thermo_readings", 
            { id: Number, capture_date: Number, thermo_value: Number},
            function(err, rows){
              if (err){
                console.log(err);             
              }
              console.log(JSON.stringify(rows));
              return callback(rows || []);
            }
         );         
      },
      insert: function(dateGroup, value) {
         db.query("INSERT INTO thermo_readings (capture_date, thermo_value) values (?,?)", [dateGroup, value], function(err) {
          db.query("SELECT capture_date, thermo_value FROM thermo_readings", 
            function(err, rows) {
              (rows || []).forEach(function(row){
              console.log(row.capture_date + ": " + row.thermo_value);
            });
          });
        });
      }
   };

module.exports = { 
   thermoCouple: thermoCouple
};

