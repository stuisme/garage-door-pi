var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


function dm(screenName, message) {
  var obj = {
    screen_name: screenName,
    text: message
  }
  client.post('direct_messages/new', obj, function(error, tweet, response) {
    if (error) {
      console.log(error)
    };
  });
}

module.exports = {
  dm: dm
};
