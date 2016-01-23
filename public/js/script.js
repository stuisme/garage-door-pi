
(function(document, window, $){
  var apiUrl = 'http://' +  window.location.hostname + ':' + window.location.port;

  var garageDoorStatus = function(){
    return $.get(apiUrl + '/status');
  };

  var toggleGarageDoor = function(){
    return $.post(apiUrl + '/toggle');
  }

  $('#toggleBtn').on('click', function(){
    toggleGarageDoor();
  });

  setInterval(function(){
    garageDoorStatus().done(function(response){
      $('#status').text(response.text);
    });
  }, 1000)

})(document, window, $)
