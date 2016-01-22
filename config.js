
var config = {
  server:{
    port: 8000
  },

  gpio: {
    relay: 23,
    contact: 4
  },

  notifications:{
    timeBeforeNotification: 30, //minutes
    openMessage: 'Your garage door has been open for {time} minutes.',
    twitter:{
      screenName: 'terrymooreii'
    }
  }
};


module.exports = config;
