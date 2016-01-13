'use strict';

const Hapi = require('hapi');
const garage = require('./lib/garage');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  port: 8000
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

setInterval(function(){
  garage.status().then(function(status){
    var date = new Date();
    if (date.getHour() >= 9 && status.value === 1){
      if(!triggered){
        triggered = true;
      }else{
        triggered = false;
        console.log('send message')
      }
    }
  });


}, 1000 * 60 * 10) //ten minutes
