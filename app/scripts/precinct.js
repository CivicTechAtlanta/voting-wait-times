(function(app, $){
 
  app.addRoute('/precincts/:state/:county/:precinctId', function(data){

    var state = data.state.toLowerCase();
    var county = data.county.toLowerCase();
    var precinctId = data.precinctId;

    // This is a placeholder box to show until data is loaded from firebase
    var element = app.render(app.compile('precinct_full', {
      name: county + ', ' + state + ' ' + precinctId,
      wait: app.waitInfo(-1), // unknown wait
      lastUpdated: 'Never',
      showButtons: true //TODO: don't show to unauthorized users
    }));

    // get the node containing precinct data from firebase
    var precinctNode = app.db.child('precincts').child(state).child(county).child(precinctId);

    // the node containing the submitted wait times
    var waitNode = app.db.child('wait-times');

    var timeUpdateInterval = null;

    // called when a wait time button is clicked
    function addButtonListeners(element){
        // set a click listener to .btn-wait
        $(element).find('.btn-wait').click(function(){

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

          // update the precinct with the latest wait id
          precinctNode.update({lastWait: newNode.key()});

          // updating the data will cause on('value') to be called, so we don't have to draw the new data
        });
    }

    // attach listeners to the placeholder object
    addButtonListeners(element);

    // get basic precinct data
    precinctNode.on('value', function(valSnapshot){
      // when precint data is loaded, get the object
      var precinct = valSnapshot.val();

      // TODO: map link

      // if there is precint data and it also has lastWait data
      if(precinct && precinct.lastWait){
        // get the latest wait time
        waitNode.child(precinct.lastWait).once('value', function(waitSnapshot){
          // when it loads, get the data
          var waitTime = waitSnapshot.val();
          // then replace the page with the updated wait time
          var element = app.render(app.compile('precinct_full', {
            name: precinct.name,
            wait: app.waitInfo(waitTime.wait),
            lastUpdated: new Date(waitTime.timestamp).toRelativeString(),
            showButtons: true //TODO: don't show to unauthorized users
          }));
          // ... and re-add click listeners to the new page
          addButtonListeners(element);

          // finally, we set an interval so every 5 seconds, we recalculate the lastUpdated
          // time that we show on the page.
          // (e.g. 3 minutes ago, 4 minutes ago, ...)
          // `toRelativeString` is thanks to bower library `natural_dates`
          var lastUpdated = $(element).find('.last-updated');
          var interval = setInterval(function(){
            lastUpdated.text(new Date(waitTime.timestamp).toRelativeString());
          }, 5 * 1000);

          // if the element is removed (for example because firebase has updated data),
          // stop the existing interval.
          lastUpdated.on('remove', function(){
            clearInterval(interval);
          });
        });
      }
    });
  });

})(window.app, window.jQuery);
