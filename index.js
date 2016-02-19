'use strict';

//const dotenv = require('dotenv').config();
const config = require('./config');
const Hapi = require('hapi');
//const Path = require('path');
const Animator = require('./lib/animator');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var rest = require('restler');


// Create a server with a host and port
const server = new Hapi.Server();

serialport.list(function(ports){
  console.log(arguments);
});

var animator = new Animator({
  port: '/dev/cu.usbmodem1421'
});
server.connection({
  port: config.server.port,
  routes: {
    cors: true
  }
});

server.route({
  method: 'GET',
  path: '/animate',
  handler: function(request, reply) {
    animator.animate(function(){
      return reply({ok: true});
    });
  }
});

server.register(require('inert'), function(err) {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    });
    // Start the server
    server.start(function(err){
      if (err) {
        throw err;
      }
      console.log('Server running at:', server.info.uri);
    });
});

var lock = false;

var handleMessage = function(message){
  lock = true;

  animator.animate(function(){
    rest.post('http://scopecreepbot.azurewebsites.net/alexa/' + message.Id +'/ack', {})
      .on('complete', function(data, response) {
        if (response.statusCode == 201) {
          // you can get at the raw response like this...
        }
        lock = false;
      });
  });

};

setInterval(function(){

  if (lock === true) return;

  rest.get('http://scopecreepbot.azurewebsites.net/alexa').on('complete', function(data) {

    console.log((new Date()).toUTCString() + ": " + JSON.stringify(data));
    if (!data || data.length == 0){
      return;
    }
    var message = data[0];

    handleMessage(message);

  });

}, (1500)) ;//1 sec
