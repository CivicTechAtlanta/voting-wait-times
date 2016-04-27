window.app = (function($, Firebase){

  var App = function(){
    this.routes = [];
    this.db = new Firebase('https://voting-wait-times.firebaseio.com');
  };

  App.prototype.addRoute = function(pattern, selector, callback){
    this.routes.push({ pattern: pattern, selector: selector, callback: callback });
  };

  App.prototype.route = function(path){
    for(var i = 0; i < this.routes.length; i++){
      var route = this.routes[i];
      var keys = route.pattern.match(/:[^\/]+/g);
      var pattern = new RegExp(route.pattern.replace(/:[^\/]+/g, '([^\/]+)'));
      var matches = path.match(pattern);
      if(matches){
        var data = {};
        for(var j = 1; j < matches.length; j++){
          data[keys[j-1].substring(1)] = matches[j];
        }
        $(route.selector).show();
        route.callback(data);
        return;
      }
    }
    if(this.fallthroughRoute){
      this.fallthroughRoute();
    }else{
      console.warn('No route found for ' + path);
    }
  };

  var app = new App();

  $(document).ready(function(){
    app.route(window.location.pathname);
  });

  return app;

})(window.window.jQuery, window.Firebase);
