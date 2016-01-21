'use strict';

const dotenv = require('dotenv').config();

const Hapi = require('hapi');
const garage = require('./lib/garage');
const twitter = require('./lib/twitter');


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  port: 8000,
  routes: {
    cors: true
  }
});

// Add the route
server.route({
  method: 'GET',
  path: '/hello',
  handler: function(request, reply) {
    return reply('hello world');
  }
});

server.route({
  method: 'GET',
  path: '/status',
  handler: function(request, reply) {
    return garage.status().then(function(response) {
      return reply(response);
    });
  }
});

server.route({
  method: 'POST',
  path: '/toggle',
  handler: function(request, reply) {
    return garage.toggle().then(function(response) {
      return reply({
        status: response
      });
    });
  }
});

server.route({
  method: 'GET',
  path: '/log',
  handler: function(request, reply) {
    return garage.log().then(function(response) {
      return reply(response);
    });
  }
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});


/*

Send email or text or direct message if it later than 9 and open for longer than 10 min
*/

var triggered = false;

setInterval(function() {
    garage.status().then((status) => {
      var date = new Date();
      if (date.getHours() >= 22 && status.value === 1) {
        if (!triggered) {
          triggered = true;
          console.log('triggered but not sent')
        } else {
          triggered = false;
          twitter.dm('terrymooreii', 'Your garage door is open');
        }
      }
    });
  }, 1000 * 60 * 10) //ten minutes


var currentStatus = {
  value: null
};

setInterval(() => {
    garage.status().then((status) => {
      if (currentStatus.value !== status.value) {
        garage.log('Garage Door is now ' + status.text);
        currentStatus = status;
      }
    });
  }, 1000 * 1) //1 sec
