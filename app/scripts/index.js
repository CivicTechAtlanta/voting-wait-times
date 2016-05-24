(function(app, $){

  app.addRoute('/', function(data){
    app.render(app.compile('index'));

    // TODO: add logic for search
  });

})(window.app, window.jQuery);
