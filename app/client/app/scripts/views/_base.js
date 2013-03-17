// Base View
define([], function() {

  var BaseView = Backbone.View.extend({

    initialize: function(opts) {

      // precaution
      opts || (opts = {})

      // grab model
      this.model = opts.model || false;

      // grab auth
      this.auth = opts.auth || false;

    },

    html: function() {
      $(this.el).html(this.template(this.serialize()));
      return this.el;
    },

    postShow: function() {
      
    },

    serialize: function() {
      return {};
    }

  });

  return BaseView;

});