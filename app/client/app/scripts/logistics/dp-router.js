// DP router
define(['_page', 'home', 'view', 'profiles'], function(_Page, Home, View, Profiles) {
  'use strict';
  
  var DP_Router = Backbone.Router.extend({

    routes: {
      ''        :    'home',
      ':id'     :    'view'
    },

    initialize: function(opts) {

      // precaution
      opts || (opts = {})

      // grab options
      this.config = opts.config;

      // grab auth
      this.auth = opts.auth;

      // A view holder
      this.page = new _Page({
        selector: '#main'
      });

      // Profile collection
      this.profiles = new Profiles([], {
        api_root: this.config.api_root
      });

    },

    // Home
    home: function() {

      if (this.auth.get('loggedIn')) {
        var user = this.profiles.retrieve({id: this.auth.get('user')._id});
        Backbone.history.navigate('/' + user.get('username'), true);
      } else {
        $('body').addClass('unauth');
      }
    },

    // View a profile
    view: function(username) {

      function cont() {
        $('body').removeClass('unauth');
        var model = this.profiles.retrieve({username: username});
        if (model) {
          var view = new View({model: model, auth: this.auth});
          this.page.show(view);
        } else {
          Backbone.history.navigate('/', true);
        }
      };
      var _this = this;
      if (!this.auth.get('loggedIn')) {
        var model = this.profiles.retrieve({username: username});
        model.fetch({
          success: function(p) {
            if (p.get('msg') === "Profile doesn't exist") {
              Backbone.history.navigate('/', true);
            } else {
              cont.call(_this);
            }
          }
        })
      } else {
        cont.call(this);
      }

    }

  });

  return DP_Router;

});