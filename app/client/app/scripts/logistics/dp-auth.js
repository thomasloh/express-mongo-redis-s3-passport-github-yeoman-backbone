define([], function() {
  var Auth = Backbone.Model.extend({

    initialize: function() {
      this.url = '/auth';
    },

    login: function() {
    },

    logout: function() {
      
    },

    isLoggedIn: function() {
      return this.get('loggedIn');
    },

    getAuth: function(opts) {
      var _this = this;
      this.fetch({
        success: function(auth, data, jqxhr) {
          auth.set('loggedIn', data.loggedIn);
          auth.set('session', data.session);
          if (auth.isLoggedIn()) {
            auth.set('user', data.user);
            auth.trigger('logged_in', data.user);
          } else {
            // opts.notLoggedIn();
          }
          opts.loggedIn();
        }
      })
    }

  });

  return Auth;

});