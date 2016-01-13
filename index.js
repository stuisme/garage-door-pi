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
      console.log('response:', response)
      return reply({
        status: response
      });
    });
  }
});

//
// server.route({
//     method: 'POST',
//     path: '/toggle',
//     handler: function(request, reply) {
//       return garage.toggle(function(response) {
//           reply(JSON.stringify({
//             status: response
//           }););
//         }
//       });

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});



//watch for contact status and update log file
//possible email/text/twitter/other


/* api

GET: Get door status
  Read contact state

POST: Toggle the Door status
  Send to relay

GET: Log file

*/
