(function(app, $){

  app.addRoute(/\/precincts\/([a-zA-Z]{2})\/([^\/]+)\/([^\/])/, function(matches){
    var state = matches[1].toLowerCase();
    var county = matches[2].toUpperCase();
    var precinctId = matches[3].toUpperCase();
    console.log(state, county, precinctId);
  });

})(window.app, window.jQuery);
