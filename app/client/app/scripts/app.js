/*global define */
define(['router'], function (Router) {
    'use strict';

    var App = function () {

        // Internal variables
        var _router, _config = {};

        // Internal functions
        var init = {
            router: function (opts) {
                _router = new Router(opts);
            }
        };

        return {

            start: function (opts) {

                opts || (opts = {})

                // grab options
                _config.root = opts.root || '/';
                _config.api_root = opts.api_root || '/';

                // Init router
                init.router({config: _config});

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
            }
        };
    };

    return App;
});