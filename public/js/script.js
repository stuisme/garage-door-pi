
(function(document, window, $){
  var apiUrl = 'http://' +  window.location.hostname + ':' + window.location.port;

  var garageDoorStatus = function(){
    return $.get(apiUrl + '/status');
  };

  var toggleGarageDoor = function(){
    return $.post(apiUrl + '/toggle');
  }

  $('#toggleBtn').on('click', function(){
    $('#toggleBtn').prop("disabled",true);

    toggleGarageDoor();

    setTimeout(function(){
      $('#toggleBtn').prop("disabled",false);
    }, 1000 * 10); //10 seconds
  });

  setInterval(function(){
    garageDoorStatus().done(function(response){
      $('#status').text(response.text);
    });
  }, 1000)

})(document, window, $)
