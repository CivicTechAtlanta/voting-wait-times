(function(app, $){

  // convert an integer wait time severity to a string
  var waitTimeMap = [
    'No Line (whoo hoo!)',
    'Small Line (Less than 10 min)',
    'Medium Line (10-45 min)',
    'Long Line (Over 45 min)'
  ];

  app.addRoute('/precincts/:state/:county/:precinctId', '#precinct-info', function(data){

    var state = data.state.toLowerCase();
    var county = data.county.toLowerCase();
    var precinctId = data.precinctId;

    // placeholder name until data is loaded from firebase
    $('.precinct-name').text(county + ', ' + state + ' ' + precinctId);
    $('.wait-time').text('Unknown');
    $('.last-updated').text('Never');
    
    // get the node containing precinct data from firebase
    var precinctNode = app.db.child('precincts').child(state).child(county).child(precinctId);

    var waitNode = app.db.child('wait-times');

    var timeUpdateInterval = null;

    // get basic precinct data
    precinctNode.on('value', function(snapshot){
      var precint = snapshot.val();

      if(precint && precint.name){
        $('.precinct-name').text(precint.name);
      }
      // TODO: map link
      if(precint && precint.lastWait){
        // get new wait time
        waitNode.child(precint.lastWait).once('value', function(snapshot){
          var waitTime = snapshot.val();
          // update wait time
          $('.wait-time').text(waitTimeMap[waitTime.wait]);

          //update last updated. we do this on an interval so the time updates regularly
          // (e.g. 3 minutes ago, 4 minutes ago, ...)
          // `toRelativeString` is thanks to bower library `natural_dates`
          $('.last-updated').text(new Date(waitTime.timestamp).toRelativeString());

          clearInterval(timeUpdateInterval);
          timeUpdateInterval = setInterval(function(){
            $('.last-updated').text(new Date(waitTime.timestamp).toRelativeString());
          }, 15*1000);
        });
      }
    });   

    // when a wait time button is clicked
    $('.btn-wait').click(function(){

      // the severity of the wait is pulled from the 'wait' attribute on the button html
      var wait = $(this).attr('wait');

      // create a new wait time estimate at this moment
      // TODO: Authentication - don't let just anyone submit times
      var newNode = waitNode.push({
        timestamp: new Date().toISOString(),
        wait: wait,
        state: state,
        county: county,
        precinct: precinctId
      });

      precinctNode.update({lastWait: newNode.key()});

    });
  });

})(window.app, window.jQuery);
