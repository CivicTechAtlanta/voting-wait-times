(function(app, $){

  var waitTimeMap = [
    'No Line (whoo hoo!)',
    'Small Line (Less than 10 min)',
    'Medium Line (10-45 min)',
    'Long Line (Over 45 min)'
  ];

  function getId(data){
    return data.state + '-' + data.county + '-' + data.precinct;
  }

  // TODO: allow filtering of admin (e.g. by state, county)
  app.addRoute('/admin', function(data){

    var element = app.render(app.compile('admin')).find('#admin-container');

    // Sorting of precinct info boxes are done using the 'sort' attribute (see below)
    function sortElements(){
      var children = element.children();
      children.detach().sort(function(elm1, elm2){
        return $(elm1).attr('sort') < $(elm2).attr('sort');
      });
      element.append(children);
    }

    var waitNode = app.db.child('wait-times').orderByChild('wait').limitToLast(100);
    // get the latest 100 wait times
    waitNode.on('child_added', function(snapshot){
      var data = snapshot.val();
      var id = getId(data);
      $('#' + id).remove();

      element.append(app.compile('precinct_admin', {
        id: id,
        // multiplying the unix timestamp by the magnitude of the wait is a hacky way
        // to sort first by wait time and then by most recently updated (big numbers should come earlier)
        // TODO: find a better sort system!
        sort: (data.wait + 1) * new Date(data.timestamp).getTime(),
        waitClass: ['primary', 'success', 'warning', 'danger'][data.wait],
        name: (data.county + ', ' + data.state + ' ' + data.precinct).toUpperCase(),
        waitName: waitTimeMap[data.wait],
        url: ['/precincts', data.state, data.county, data.precinct].join('/'),
        lastUpdated: new Date(data.timestamp).toRelativeString()
      }));

      sortElements();
    });
    waitNode.on('child_removed', function(snapshot){
      element.remove($('#' + getId(data)));
    });
  });

})(window.app, window.jQuery);
