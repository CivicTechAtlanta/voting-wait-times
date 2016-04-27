(function(app, $){

  var waitTimeMap = [
    'No Line (whoo hoo!)',
    'Small Line (Less than 10 min)',
    'Medium Line (10-45 min)',
    'Long Line (Over 45 min)'
  ];

  function createOrUpdatePrecinct(data){
    var id = data.state+'-'+data.county+'-'+data.precinct;
    var box = $('#'+id);
    if(box.length === 0){
      box = $('#admin-template').clone();
      box.attr('precinct', id);
      box.attr('id', id);
      $('#admin-container').append(box);
    }
    box.attr('wait', data.wait);
    box.attr('sort', (data.wait + 1) * new Date(data.timestamp).getTime());
    box.find('.precinct-name').text(data.county + ', ' + data.state + ' ' + data.precinct);
    box.attr('href', ['/precincts', data.state, data.county, data.precinct].join('/'));

    // var timeUpdateInterval;

    box.find('.wait-time').text(waitTimeMap[data.wait]);

    //update last updated. we do this on an interval so the time updates regularly
    // (e.g. 3 minutes ago, 4 minutes ago, ...)
    // `toRelativeString` is thanks to bower library `natural_dates`
    box.find('.last-updated').text(new Date(data.timestamp).toRelativeString());
    // clearInterval(timeUpdateInterval);
    setInterval(function(){
      box.find('.last-updated').text(new Date(data.timestamp).toRelativeString());
    }, 15*1000);
    box.show();
  }

  function sort(){
      var children = $('#admin-container').children();
      children.detach().sort(function(elm1, elm2){
        console.log("sort", $(elm1).attr('sort'), $(elm2).attr('sort'));
        return $(elm1).attr('sort') < $(elm2).attr('sort');
      });
      $('#admin-container').append(children);
  }

  // TODO: allow filtering of admin (e.g. by state, county)
  app.addRoute('/admin', '#admin', function(data){

    var waitNode = app.db.child('wait-times').orderByChild('wait').limitToLast(100);
    // get the latest 100 wait times
    waitNode.on('child_added', function(snapshot){
      // update precinct
      createOrUpdatePrecinct(snapshot.val());
      sort();
    });
    waitNode.on('child_removed', function(snapshot){
      // remove precint
      var id = data.state+'-'+data.county+'-'+data.precinct;
      $('#admin-container').remove($('#'+id));
    });
  });

})(window.app, window.jQuery);
