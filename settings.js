var PORT = 8080,
   THERMO_FILE = '/sys/bus/w1/devices/28-000005212eb7/w1_slave',
   THERMO_INTERVAL = 1000 * 60 * 5;

module.exports = {
   PORT: PORT,
   THERMO_FILE: THERMO_FILE,
   THERMO_INTERVAL: THERMO_INTERVAL
};