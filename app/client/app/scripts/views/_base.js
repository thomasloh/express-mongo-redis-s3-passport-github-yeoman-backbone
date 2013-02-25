// Base View
define([], function() {

  var BaseView = Backbone.View.extend({

    initialize: function(opts) {

      // precaution
      opts || (opts = {})

      // grab model
      this.model = opts.model || false;

    },

    html: function() {
      $(this.el).html(this.template());
      return this.el;
    },

    postShow: function() {
      
    }

  });

  return BaseView;

});