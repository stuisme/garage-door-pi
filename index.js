'use strict';

const dotenv = require('dotenv').config();
const config = require('./config');
const Hapi = require('hapi');
const Path = require('path');
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

server.register(require('inert'), (err) => {
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
    server.start((err) => {
      if (err) {
        throw err;
      }
      console.log('Server running at:', server.info.uri);
    });
});

/*
 Send direct message via twitter if garage door is open for X number of minutes.
 Also log the door opening and closing
 */

var openSeconds = 0;
var resendCount = 0;
var notificationTimeSeconds = config.notifications.timeBeforeNotification * 60;
var currentStatus = {
  value: null
};

function notifyOpenDoor(){
  garage.status().then((status) => {
    if (status.value === 1 && openSeconds >= 0 && openSeconds < notificationTimeSeconds) {
        openSeconds++;
    }else if(openSeconds === notificationTimeSeconds){
        resendCount++;
        var timeOpen = config.notifications.timeBeforeNotification * resendCount;
        var openMessage = new Date().toString() + ' ' + config.notifications.openMessage.replace(/{time}/gi, timeOpen);
        twitter.dm(config.notifications.twitter.screenName, openMessage);
        openSeconds = 0;
    }else{
      resendCount = 0;
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
