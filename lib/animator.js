/*

 Simple class to interface with table flipping bot

 */

const EventEmitter = require('events');
const SerialPort = require("serialport").SerialPort;
const merge = require('merge');

var SIGNALS = Object.freeze({
  ANIMATE : '1'
});

var encoding = "ascii";

function Animator(options){

  EventEmitter.call(this);

  // config
  var config = {
    port : '/dev/cu.usbmodem1411'
  };
  merge(config, (options || {}));

  // init
  var serialPort = new SerialPort(config.port, {
    baudrate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
  });


  // public api
  this.animate = function(callback){
    serialPort.open(function() {
      console.log('opened');

      serialPort.on('data', handleDataRead);

      setTimeout(function () {
        console.log('writing');
        serialPort.write(new Buffer(SIGNALS.ANIMATE, encoding), function () {
          console.log('wrote');
        });
      }, 2000);

      setTimeout(function () {
        console.log('closing');
        serialPort.close(callback);
      }, 5000);
    });
  };

  function handleDataRead(data){
    console.log(data);
  }

}


module.exports = Animator;