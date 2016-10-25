# Appliation Archetecture

This is a basic [Single Page Web App](https://en.wikipedia.org/wiki/Single-page_application). In an effort to make it easy for beginners to contribute to the project, this app uses [Handlebars](http://handlebarsjs.com/) templates and a small amount of custom jQuery instead of a more structured framework like Angular or React.

The file `app/scripts/main.js` is the entrypoint to the application. It sets up a simple router which provides methods for adding routes and rendering, and handles rendering the right template at page load.

`app/scripts/index.js`, `app/scripts/admin.js`, `app/scripts/404.js`, etc. are pages of the application. The basic structure is:

```js
(function(app, $){

  app.addRoute('/my_page', function(data){
    // ...load some data...

    // draw the page
    app.render(app.compile('mypage'));

    // ...add some interactions...
  };

})(window.app, window.jQuery);
```

The first and last lines are simply the [Javascript module pattern](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html). If it looks foreign and crazy to you, don't worry too much about it. The important stuff is inside. 

First we call `app.addRoute` which registers a route (the path section of a url, like `/my_page`) for which this page should display. The first thing we do is render the page itself using `app.render(app.compile('mypage'));`. This looks for a Handlebars template in `app/templates/` named `mypage.hbs` and draws that on the page.

Our routes can contain custom parameters.The `addRoute` method provides the `data` variable which will contain the parameter values. For example, you can set the route to '/users/:userId'. Then, if someone navigates to '/users/3', the data object will look like `{userId: '3'}`.

After the render step, we can run any Javascript we want to run on the page. This likely means loading data from Firebase, which is accessible via `app.db`, and displaying it, for example using another Handlebars template. For example, if you are rendering a `user.hbs` template when someone navigates to our `/users/:userId` route,

```js
// get the value of the requested user
app.db.child('users').child(data.userId).on('value', function(snapshot){
  var user = snapshot.val();

  // now that we have a user object, let's render it to the page by passing the user object to the user.hbs template
  var element = app.render(app.compile('user', user));

  // we also have the HTML element that we just rendered if we need it
});
```
