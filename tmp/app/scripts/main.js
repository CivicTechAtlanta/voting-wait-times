

//http://stackoverflow.com/a/3855394
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);


// { "timestamp": "2016-03-05T00:00:00", "precinct": "1", "waittime": 2, "reporterid": "e3f99640d60577f72086b54087423593", "state": "GA"}
function addEstimate(precinctnum, state, email, waittime, callback){
  console.log("adding time");
  $.ajax({
    method: 'POST',
    url: '/waittimes',
    data: JSON.stringify({
      precinct: precinctnum,
      state: state,
      reporterid: md5(email),
      waittime: waittime,
      timestamp: new Date().toISOString()
    }),
    contentType: 'application/json',
    dataType: 'json',
    success: null
  }).then(callback);
}

function getTime(precinctnum, state, callback){
  console.log("getting time");
  $.ajax({
    method: 'GET',
    url: '/waittimes',
    data: {
      where: 'precinct = '+precinctnum+' AND state = \''+state+'\'',
      order: 'timestamp DESC',
      limit: 1
    },
    dataType: 'json'
  }).then(callback);
}


var waitTimeMap = [
  "No Line (whoo hoo!)",
  "Small Line (Less than 10 min)",
  "Medium Line (10-45 min)",
  "Long Line (Over 45 min)"
];

function drawTime() {

    console.log("updating...");

    getTime(precinct, state, function(res){

      console.log("got data", res);

      $('.precinct-name').text(state + " Precinct "+precinct);

      if(res[0]){
        var time = res[res.length-1];
        $('.wait-time').text(waitTimeMap[time.waittime]);

        $('.last-updated').text(new Date(time.timestamp).toRelativeString());
      }else{
        $('.wait-time').text("Unknown");

        $('.last-updated').text("Never");
      }
    });
}


function sendWait(time){
  var email = $('.email-field').val();

  addEstimate(precinct, state, email, time, function(){
    drawTime();
  });
}

function setLocation(state, precinct) {
  window.state = state;
  window.precinct = precinct;
  $('.state-field').val(state);
  $('.precinct-field').val(precinct);
}

$(document).ready(function(){


  setLocation($.QueryString['state'], $.QueryString['precinct']);

  if((!state || !precinct) && navigator.geolocation){
    // try and get from geolocation
    navigator.geolocation.getCurrentPosition(function(position){

      console.log("got position", position);

    });
  }


  drawTime();
  setInterval(drawTime, 15*1000);

  $('.btn-wait').click(function(){
    var wait = $(this).attr('wait');

    console.log("submit", wait);

    sendWait(wait);
  });

  // $('.btn-panic')
});