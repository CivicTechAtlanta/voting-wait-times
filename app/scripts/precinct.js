(function(app, $){

  app.addRoute('/precincts/:state/:county/:precintId', function(data){
    console.log(data);
  });

})(window.app, window.jQuery);
