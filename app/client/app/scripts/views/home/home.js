// Home
define(['_base_view', 'text!home.html'], function(BaseView, home_template) {

  var Home = BaseView.extend({

    id: 'home',

    template: _.template(home_template),

    initialize: function(opts) {
      BaseView.prototype.initialize.apply(this, arguments);
    },

    serialize: function() {
      return {
        username: this.model.get('github_data').username
      };
    }

  });

  return Home;

});