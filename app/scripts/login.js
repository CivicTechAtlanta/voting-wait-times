(function(app, $){

  app.addRoute('/login', function(data){
    app.render(app.compile('login'));

    $('#registration_button').click(function(event){
    	var email = $('#new_userForm').val()
    	var password = $('#new_passForm').val()
    	app.db.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  			// Handle Errors here.
  		var errorCode = error.code;
		var errorMessage = error.message;
		});
    	event.preventDefault();
    })
  });

})(window.app, window.jQuery);
