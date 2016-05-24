(function(app, $){

  // a hash of strings and other info for each integer wait level
  app.waitInfo = function(id){
    if(!id || id<0 || id>3){
      return {
        id: -1,
        shortName: 'unknown',
        name: 'Unknown',
        bootstrapClass: 'default'
      };
    }else{
      return {
        id: id,
        shortName: ['none', 'small', 'medium', 'long'][id],
        name: [
          'No Line (whoo hoo!)',
          'Small Line (Less than 10 min)',
          'Medium Line (10-45 min)',
          'Long Line (Over 45 min)'
        ][id],
        bootstrapClass: ['primary', 'success', 'warning', 'danger'][id]
      };
    }
  };

})(window.app, window.jQuery);
