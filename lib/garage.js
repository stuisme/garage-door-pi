
var fs = require('fs');
var path = require('path');
var Gpio = require('onoff').Gpio;
var contact = new Gpio(18, 'in');
var relay = new Gpio(4, 'in');

var logFile = path.join(__dirname, 'log', 'log.txt');
var garageState;

function exit() {
  contact.unexport();
  relay.unexport();
  process.exit();
}

process.on('SIGINT', exit);

contact.watch((err, value) => {
  if (err) {
    throw err;
  }

  log('Garage Door Status Changed to ' + value);
});

//get contact status
function status() {
  return new Promise((resolve, reject) => {
    relay.read((err, value) => {
      if (err){
        console.log('Error reading status');
        reject();
      }
      console.log('Contact Status:', value);
      var status = value ? 'open' : 'close'; //maybe this works????
      log('Door is ' + status.toUpperCase());
      resolve(value);
    });
  });
}

//toggle door
function toggleDoor() {
  return new Promise((resolve, reject) => {
    relay.setDirection('out');
    log('')
    setTimeout(() => {
      relaySwitch.setDirection('in');
      resolve();
    }, 300);
  });
}

function log(message){
  if (message){
    var msg = new Date().toString() + '\t' + message;
    console.log(msg);

    fs.appendFile(logFile, msg, (err) => {
      if(err)
        console.log('Error writing to log file.');
    });
  }else{
    return new Promise((resolve, reject) => {
      fs.readFile(logFile, (err, data) => {
          if (err){
            console.log('Error reading log file');
            reject(err);
          }
          resolve(data);
      });
    });
  }
}


module.exports = {
  log:log,
  status: status,
  toggle: toggle
};
