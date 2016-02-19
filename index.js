'use strict';

//const dotenv = require('dotenv').config();
const config = require('./config');
const Hapi = require('hapi');
//const Path = require('path');
const Animator = require('./lib/animator');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var http = require('http');


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

setInterval(function(){

  var url = 'http://scopecreepbot.azurewebsites.net/alexa';


  var options = {
    host: 'scopecreepbot.azurewebsites.net',
    port: 80,
    path: '/alexa'
  };

  http.get(options, function(resp){
    resp.on('data', function(chunk){
      var data = JSON.parse(chunk.toString());
      console.log(data);
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
  });
}, (1500)) ;//1 sec
