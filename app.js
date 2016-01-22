var webserver = require('./webserver'),
    thermo = require('./thermo'),
    utilities = require('./utilities'),
    settings = require('./settings');

webserver.start();
thermo.pollThermocouple(settings.THERMO_FILE, settings.THERMO_INTERVAL);