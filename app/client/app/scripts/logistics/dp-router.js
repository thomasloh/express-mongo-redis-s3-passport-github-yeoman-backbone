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
      var user = this.profiles.retrieve(this.auth.get('user')._id);
      var home = new Home({model: user});
      this.page.show(home)
    },

    // View a profile
    view: function(id) {
      var model = this.profiles.retrieve(id);
      var view = new View({model: model});
      this.page.show(view);
    }

  });

  return DP_Router;

});