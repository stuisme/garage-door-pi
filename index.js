'use strict';

const dotenv = require('dotenv').config();
const config = require('./config');
const Hapi = require('hapi');
const garage = require('./lib/garage');
const twitter = require('./lib/twitter');


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  port: config.server.port,
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

var openSeconds = 0;
var notificationTimeSeconds = config.notifications.timeBeforeNotification * 60;
var openMessage = config.notifications.openMessage.replace(/{time}/gi, config.notifications.timeBeforeNotification);
var currentStatus = {
  value: null
};

function notifyOpenDoor(){
  garage.status().then((status) => {
    if (status.value === 1 && openSeconds < notificationTimeSeconds) {
        openSeconds++;
    }else if(openSeconds === notificationTimeSeconds){
        twitter.dm(config.notifications.twitter.screenName, openMessage);
        openSeconds = 0;
    }else{
      openSeconds = 0;
    }
  });
}

function logStatusChange(){
  garage.status().then((status) => {
    if (currentStatus.value !== status.value) {
      garage.log('Garage Door is now ' + status.text);
      currentStatus = status;
    }
  });
}

setInterval(() => {
    logStatusChange();
    notifyOpenDoor();
}, 1000 * 1) //1 sec
