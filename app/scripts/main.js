window.app = (function($, Firebase){

  var app = {

    // the array for containing the routes of our app
    routes: [],

    // the top-level reference to our Firebase backend
    db: new Firebase('https://voting-wait-times.firebaseio.com'),

    // Call this method to add a new route. If the current path matches
    // the given pattern, the callback is called. Patterns are searched
    // in the order they are added and stop on the first match.
    // The pattern is a string of the path to match, with a leading slash.
    // Variables can be path parts by starting them with a colon. For
    // example:
    //    Given a pattern '/users/:id', if a user visits /users/14,
    //    the callback is called with the argument {id: '14'}.
    addRoute: function(pattern, callback){
      this.routes.push({ pattern: pattern, callback: callback });
    },
    // Execute the appropriate callback for the given path
    route: function(path){
      //for each route
      for(var i = 0; i < this.routes.length; i++){
        var route = this.routes[i];
        // get a list of the variable parameter names
        var keys = route.pattern.match(/:[^\/]+/g);
        // create a regular expression to match with
        var pattern = new RegExp(route.pattern.replace(/:[^\/]+/g, '([^\/]+)'));
        var matches = path.match(pattern);
        // if the path is a match
        if(matches){
          // collect the values of the parameters
          var data = {};
          for(var j = 1; j < matches.length; j++){
            data[keys[j - 1].substring(1)] = matches[j];
          }
          // call the callback with the result
          route.callback(data);
          // stop looking for matches
          return;
        }
      }
      // if no matches were found
      if(this.fallthroughRoute){
        this.fallthroughRoute();
      }else{
        console.warn('No route found for ' + path);
      }
    },
    compile: function(templateName, data){
      return this.templates[templateName](data);
    },
    render: function(e){
      $('.container').empty();
      return $('.container').append(e);
    }
  }

  // once all the javascript is loaded and ready to go
  $(document).ready(function(){
    // route the request
    app.route(window.location.pathname);
  });

  return app;

})(window.window.jQuery, window.Firebase);
