(function(app, $){

  /*
      Create a unique string for a state+county+precint combination for identifying elements
  */
  function getId(data){
    return data.state + '-' + data.county + '-' + data.precinct;
  }

  app.addRoute(['/admin', '/admin/:state', '/admin/:state/:county'], function(data){

    var element = app.render(app.compile('admin')).find('#admin-container');

    // Sorting of precinct info boxes are done using the 'sort' attribute (see below)
    function sortElements(){
      var children = element.children();
      children.detach().sort(function(elm1, elm2){
        return $(elm1).attr('sort') < $(elm2).attr('sort');
      });
      element.append(children);
    }

    var precinctNode = app.db.child('precincts');

    var waitStream = app.db.child('wait-times').orderByChild('wait').limitToLast(100);
    // get the latest 100 wait times
    waitStream.on('child_added', function(waitSnapshot){
      var waitData = waitSnapshot.val();
      if(data.state && data.county){
        // filter on county
        if(waitData.state !== data.state || waitData.county !== data.county){
          return;
        }
      }else if(data.state){
        // filter on state
        if(waitData.state !== data.state){
          return;
        }
      }
      precinctNode.child(waitData.state).child(waitData.county).child(waitData.precinct).once('value', function(precinctSnapshot){
        var precinct = precinctSnapshot.val();
        var id = getId(waitData);
        var existingElement = $('#' + id);
        if(existingElement){
          // skip older one
          if(Number(existingElement.attr('time')) > new Date(waitData.timestamp).getTime()){
            return
          }else{
            existingElement.remove();
          }
        }

        var title;
        var subtitle;
        var formattedPrecinctInfo = (waitData.county + ', ' + waitData.state + ' ' + waitData.precinct).toUpperCase();
        if(precinct){
          title = precinct.name;
          subtitle = formattedPrecinctInfo;
        }else{
          title = formattedPrecinctInfo;
          subtitle = "";
        }

        element.append(app.compile('precinct_admin', {
          id: id,
          // multiplying the unix timestamp by the magnitude of the wait is a hacky way
          // to sort first by wait time and then by most recently updated (big numbers should come earlier)
          // TODO: find a better sort system!
          sort: (waitData.wait + 1) * new Date(waitData.timestamp).getTime(),
          time: new Date(waitData.timestamp).getTime(),
          wait: app.waitInfo(waitData.wait),
          title: title,
          subtitle: subtitle,
          url: ['/precincts', waitData.state, waitData.county, waitData.precinct].join('/'),
          lastUpdated: new Date(waitData.timestamp).toRelativeString()
        }));

        sortElements();
      });
    });
    waitStream.on('child_removed', function(snapshot){
      element.remove($('#' + getId(data)));
    });
  });

})(window.app, window.jQuery);
