/*global define */
define(['router', 'auth'], function (Router, Auth) {
    'use strict';

    var App = function () {

        // Internal variables
        var _router, _auth, _config = {};

        // Internal functions
        var init = {
            router: function (opts) {
                _router = new Router(opts);
            },
            auth: function() {
              _auth = new Auth();
            }
        };

        return {

            auth: function() {
              return _auth;
            },

            start: function (opts) {

                opts || (opts = {})

                // grab options
                _config.root = opts.root || '/';
                _config.api_root = opts.api_root || '/';

                // Init auth
                init.auth();

                // Init router
                init.router({config: _config, auth: _auth});

                // Mediations
                _auth.on('logged_in', function(user) {
                  _router.profiles.add(user);
                });

                // Check if user is loggedin
                _auth.getAuth({

                    loggedIn: function() {
                        $('body').removeClass('unauth');

                        // Starts pushstate
                        Backbone.history.start({
                            pushState: true
                        });

                        // All navigation that is relative should be passed through the navigate
                        // method, to be processed by the router. If the link has a `data-bypass`
                        // attribute, bypass the delegation completely.
                        $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
                          // Get the absolute anchor href.
                          var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
                          // Get the absolute root.
                          var root = location.protocol + "//" + location.host + _config.root;

                          // Ensure the root is part of the anchor href, meaning it's relative.
                          if (href.prop.slice(0, root.length) === root) {
                            // Stop the default event to ensure the link will not cause a page
                            // refresh.
                            evt.preventDefault();

                            // `Backbone.history.navigate` is sufficient for all Routers and will
                            // trigger the correct events. The Router's internal `navigate` method
                            // calls this anyways.  The fragment is sliced from the root.
                            Backbone.history.navigate(href.attr, true);
                          }
                        });
                      
                    },

                    notLoggedIn: function() {
                        $('body').addClass('unauth');
                    }

                });

            }
        };
    };

    return App;
});