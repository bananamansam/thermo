var cassandra = require('cassandra-driver'),
    async = require('async'),
    clientSettings = {contactPoints: ['127.0.0.1'], keyspace: 'hr'},
    client = new cassandra.Client(clientSettings);
    
module.exports = { 
   thermoCouple: {
      select: function(count){
         async.series([
            function connect(next){
                     client.connect(next);
                  },
                  function select(next){
                  }
         ], function(err){ if(err){
            console.error('There was an error inserting a reading.', err.message, err.stack);
            }});
         client.shutdown();
      },
      insert: function(dateGroup, value){
         async.series([          
            function connect(next){
               client.connect(next);
            },
            function insert(next){
               var query = 'INSERT INTO hr.thermo_readings '+
                  '(reading_date, reading_time, thermo_value) '+
                  'values (?, now(), ?)';
               client.execute(query, [dateGroup, value], { prepare: true }, next()) 
            }
         ], function (err) { 
            if(err){
               console.error('There was an error inserting a reading.', err.message, err.stack);
            }                        
         });
      }
   }   
};

