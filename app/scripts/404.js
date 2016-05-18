(function(app, $){

  app.fallthroughRoute = function(){
    app.render(app.compile('error'));
  };

})(window.app, window.jQuery);
