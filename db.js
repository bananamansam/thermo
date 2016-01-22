var sql = require('sqlite3'),
    db = new sql.Database('./thermo.db'),   
    thermoCouple = {
      createTable: function() {
         db.serialize(function() {
            db.run("CREATE TABLE if not exists thermo_readings (capture_date INTEGER, thermo_value real)");
         });
      },
      get: function(callback, limit, captureDate) {
         db.all("SELECT capture_date, thermo_value FROM thermo_readings", 
            function(err, rows){
              if (err){
                console.log(err);             
              }
            
              return callback(rows);
            }
         );         
      },
      insert: function(dateGroup, value) {
         var statement = db.prepare("INSERT INTO thermo_readings (capture_date, thermo_value) values (?,?)");
         statement.run(dateGroup, value);
         statement.finalize();
         db.each("SELECT capture_date, thermo_value FROM thermo_readings", function(err, row) {
           console.log(row.capture_date + ": " + row.thermo_value);
         });
      }
   };

module.exports = { 
   thermoCouple: thermoCouple
};

